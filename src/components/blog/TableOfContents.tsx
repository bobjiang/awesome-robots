interface TableOfContentsProps {
  content: string
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractHeadings(html: string): { text: string; slug: string }[] {
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi
  const headings: { text: string; slug: string }[] = []
  let match

  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '')
    headings.push({ text, slug: generateSlug(text) })
  }

  return headings
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const headings = extractHeadings(content)

  if (headings.length < 2) {
    return null
  }

  return (
    <nav className="bg-gray-50 rounded-xl p-6 mb-8">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
        In this article
      </h2>
      <ol className="space-y-2">
        {headings.map((heading, index) => (
          <li key={heading.slug} className="flex items-start gap-2">
            <span className="text-gray-400 font-mono text-xs mt-0.5">
              {index + 1}
            </span>
            <a
              href={`#${heading.slug}`}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export { generateSlug, extractHeadings }
