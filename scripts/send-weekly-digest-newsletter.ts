import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import matter from "gray-matter";

type Frontmatter = {
  title?: string;
  slug?: string;
  date?: string | Date;
  category?: string;
  excerpt?: string;
};

type DigestMeta = {
  file: string;
  issue: number;
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
};

type PostMeta = {
  file: string;
  title: string;
  slug: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  category: string;
};

function toYyyyMmDd(d: unknown): string {
  if (!d) throw new Error("Missing date");
  if (typeof d === "string") return d.slice(0, 10);
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

function parseFrontmatter(filePath: string): Frontmatter {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return data as Frontmatter;
}

function isDigestFile(rel: string): boolean {
  return /^content\/blog\/awesome-robots-digest-issue-\d+\.md$/.test(rel);
}

function extractIssueNumber(rel: string): number {
  const m = rel.match(/awesome-robots-digest-issue-(\d+)\.md$/);
  if (!m) throw new Error(`Not a digest issue file: ${rel}`);
  return Number(m[1]);
}

function gitDiffNames(beforeSha: string, afterSha: string): string[] {
  const out = execSync(`git diff --name-only ${beforeSha} ${afterSha}`, {
    encoding: "utf8",
  }).trim();
  return out ? out.split("\n").map((s) => s.trim()).filter(Boolean) : [];
}

function listAllDigestFiles(repoRoot: string): string[] {
  const dir = path.join(repoRoot, "content", "blog");
  return fs
    .readdirSync(dir)
    .filter((f) => /^awesome-robots-digest-issue-\d+\.md$/.test(f))
    .map((f) => path.join("content", "blog", f));
}

function listAllBlogFiles(repoRoot: string): string[] {
  const dir = path.join(repoRoot, "content", "blog");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join("content", "blog", f));
}

function buildBlogUrl(slug: string): string {
  return `https://www.awesomerobots.xyz/blog/${slug}`;
}

function loadDigestMeta(relFile: string, repoRoot: string): DigestMeta {
  const abs = path.join(repoRoot, relFile);
  const fm = parseFrontmatter(abs);
  const issue = extractIssueNumber(relFile);
  const title = fm.title ?? `Awesome Robots Digest - Issue ${issue}`;
  const slug = fm.slug ?? `awesome-robots-digest-issue-${issue}`;
  const date = toYyyyMmDd(fm.date);
  return { file: relFile, issue, title, slug, date };
}

function loadPostMeta(relFile: string, repoRoot: string): PostMeta | null {
  const abs = path.join(repoRoot, relFile);
  const fm = parseFrontmatter(abs);
  const title = fm.title;
  const slug = fm.slug;
  const date = fm.date;
  const excerpt = fm.excerpt;
  const category = fm.category;

  if (!title || !slug || !date || !excerpt || !category) return null;

  return {
    file: relFile,
    title,
    slug,
    date: toYyyyMmDd(date),
    excerpt,
    category,
  };
}

function compareDate(a: string, b: string): number {
  return a.localeCompare(b);
}

function parseDateYmd(ymd: string): Date {
  // Interpret as UTC date to avoid TZ issues
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

function minusDaysYmd(ymd: string, days: number): string {
  const dt = parseDateYmd(ymd);
  dt.setUTCDate(dt.getUTCDate() - days);
  return dt.toISOString().slice(0, 10);
}

const DISCORD_MAX_LENGTH = 2000;

function splitIntoChunks(lines: string[], maxLen: number): string[] {
  const chunks: string[] = [];
  let current = "";
  for (const line of lines) {
    const candidate = current ? current + "\n" + line : line;
    if (candidate.length > maxLen) {
      if (current) chunks.push(current);
      current = line.length > maxLen ? line.slice(0, maxLen - 3) + "..." : line;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function sendDiscordMessage(webhookUrl: string, content: string) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Discord webhook failed: ${res.status} ${res.statusText} ${text}`);
  }
}

async function sendDiscordWebhook(webhookUrl: string, lines: string[]) {
  const chunks = splitIntoChunks(lines, DISCORD_MAX_LENGTH);
  for (const chunk of chunks) {
    await sendDiscordMessage(webhookUrl, chunk);
  }
}

async function main() {
  const repoRoot = process.cwd();

  const beforeSha = process.env.GITHUB_EVENT_BEFORE;
  const afterSha = process.env.GITHUB_SHA;
  const webhookUrl = process.env.DISCORD_NEWSLETTER_WEBHOOK_URL;

  if (!beforeSha || !afterSha) {
    throw new Error("Missing GITHUB_EVENT_BEFORE or GITHUB_SHA environment variables");
  }
  if (!webhookUrl) {
    throw new Error("Missing DISCORD_NEWSLETTER_WEBHOOK_URL secret/env");
  }

  const changed = gitDiffNames(beforeSha, afterSha);
  const digestChanged = changed.filter(isDigestFile);

  if (digestChanged.length === 0) {
    console.log("No digest issue file changed; skipping newsletter.");
    return;
  }

  // If multiple digests changed in one push (rare), send for the highest issue.
  const digestMetas = digestChanged.map((f) => loadDigestMeta(f, repoRoot));
  digestMetas.sort((a, b) => a.issue - b.issue);
  const current = digestMetas[digestMetas.length - 1];

  const allDigestFiles = listAllDigestFiles(repoRoot);
  const allDigestMetas = allDigestFiles
    .map((f) => loadDigestMeta(f, repoRoot))
    .sort((a, b) => a.issue - b.issue);

  const currentIndex = allDigestMetas.findIndex((d) => d.issue === current.issue);
  if (currentIndex <= 0) {
    console.log("No previous digest found (this is the first); skipping post list.");
  }
  const prev = currentIndex > 0 ? allDigestMetas[currentIndex - 1] : null;

  const posts = listAllBlogFiles(repoRoot)
    .filter((f) => f.startsWith("content/blog/"))
    .map((f) => loadPostMeta(f, repoRoot))
    .filter((p): p is PostMeta => Boolean(p))
    .filter((p) => p.category !== "digest");

  // Limit to last 7 days ending at the current digest date (inclusive)
  const windowStart = minusDaysYmd(current.date, 7);

  const filtered = (prev
    ? posts.filter((p) => compareDate(p.date, prev.date) > 0 && compareDate(p.date, current.date) <= 0)
    : posts.filter((p) => compareDate(p.date, current.date) <= 0))
    .filter((p) => compareDate(p.date, windowStart) >= 0);

  filtered.sort((a, b) => compareDate(a.date, b.date));

  const lines: string[] = [];
  lines.push(`- Awesome Robots Digest - Issue ${current.issue} - ${buildBlogUrl(current.slug)}`);

  for (const p of filtered) {
    // Keep it single-line; Discord will auto-link.
    const abstract = p.excerpt.replace(/\s+/g, " ").trim();
    lines.push(`- ${p.title} - ${buildBlogUrl(p.slug)} : ${abstract}`);
  }

  await sendDiscordWebhook(webhookUrl, lines);
  console.log(`Newsletter sent for digest issue ${current.issue}. Posts included: ${filtered.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
