# GitHub Actions Placeholder Substitution Guide

## Overview

The weekly automation workflow (`.github/workflows/weekly-robot-fetch.yml`) creates pull requests with dynamic content by substituting placeholders in a template with actual values from the automation run.

## How Placeholder Substitution Works

### Step 1: Extract Data from JSON Files

The workflow extracts values from generated data files:

```bash
DATE=$(date +%Y-%m-%d)
WEEK_RANGE=$(jq -r '.week_range // "this week"' "data/collected-articles/$DATE.json")
ARTICLE_COUNT=$(jq -r '.total_count // 0' "data/collected-articles/$DATE.json")
DISCOVERED_COUNT=$(jq -r '.summary.total_discovered // 0' "data/discovered-robots/$DATE.json" 2>/dev/null || echo "0")
DIGEST_FILE=$(find content/blog -name "*digest-issue-*.md" -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2)
DIGEST_TITLE=$(if [ -f "$DIGEST_FILE" ]; then grep -m1 '^title:' "$DIGEST_FILE" | sed 's/title: "\(.*\)"/\1/'; else echo "Weekly Digest"; fi)
```

**Data sources:**
- `data/collected-articles/YYYY-MM-DD.json` - Article collection results
- `data/discovered-robots/YYYY-MM-DD.json` - Extracted robot data
- `content/blog/*digest-issue-*.md` - Generated digest blog post

### Step 2: Create Template with Placeholders

A template is created with these placeholders:

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `WEEK_RANGE_PLACEHOLDER` | Date range of collected articles | "Jan 17–23, 2026" |
| `GENERATED_DATE_PLACEHOLDER` | When automation ran | "January 23, 2026 at 10:00 UTC" |
| `ARTICLE_COUNT_PLACEHOLDER` | Total articles collected | "24" |
| `DISCOVERED_COUNT_PLACEHOLDER` | New robots discovered | "6" |
| `DATE_PLACEHOLDER` | ISO date for file references | "2026-01-23" |
| `DIGEST_TITLE_PLACEHOLDER` | Generated digest title | "Awesome Robots Digest - Issue 17" |
| `DIGEST_FILE_PLACEHOLDER` | Path to digest file | "content/blog/2026-01-23-digest-issue-17.md" |

### Step 3: Validate and Escape Variables

The workflow validates required variables and escapes special characters:

```bash
# Validate: Set defaults if files not found
if [ -z "$DIGEST_FILE" ]; then
  DIGEST_FILE="Not generated yet"
  DIGEST_TITLE="Weekly Digest (pending generation)"
fi

# Escape: Prevent sed substitution errors from /, &, \ characters
WEEK_RANGE_ESCAPED=$(printf '%s\n' "$WEEK_RANGE" | sed 's/[&/\]/\\&/g')
GENERATED_DATE=$(date +'%B %d, %Y at %H:%M UTC')
GENERATED_DATE_ESCAPED=$(printf '%s\n' "$GENERATED_DATE" | sed 's/[&/\]/\\&/g')
DIGEST_TITLE_ESCAPED=$(printf '%s\n' "$DIGEST_TITLE" | sed 's/[&/\]/\\&/g')
DIGEST_FILE_ESCAPED=$(printf '%s\n' "$DIGEST_FILE" | sed 's/[&/\]/\\&/g')
```

**Why escaping is important:**
- Without escaping, a title like "AI & Robotics" would break `sed` (& is a special character)
- File paths with `/` would cause substitution failures
- Escaped versions are safe to use in `sed` commands

### Step 4: Substitute Placeholders

The workflow uses `sed` to replace placeholders with escaped values:

```bash
sed -i "s/WEEK_RANGE_PLACEHOLDER/$WEEK_RANGE_ESCAPED/g" /tmp/pr-body.md
sed -i "s/GENERATED_DATE_PLACEHOLDER/$GENERATED_DATE_ESCAPED/g" /tmp/pr-body.md
sed -i "s/ARTICLE_COUNT_PLACEHOLDER/$ARTICLE_COUNT/g" /tmp/pr-body.md
sed -i "s/DISCOVERED_COUNT_PLACEHOLDER/$DISCOVERED_COUNT/g" /tmp/pr-body.md
sed -i "s/DATE_PLACEHOLDER/$DATE/g" /tmp/pr-body.md
sed -i "s/DIGEST_TITLE_PLACEHOLDER/$DIGEST_TITLE_ESCAPED/g" /tmp/pr-body.md
sed -i "s/DIGEST_FILE_PLACEHOLDER/$DIGEST_FILE_ESCAPED/g" /tmp/pr-body.md
```

### Step 5: Create Pull Request

The substituted template is used as the PR body:

```bash
gh pr create \
  --title "🤖 Weekly Digest & Discoveries - $WEEK_RANGE" \
  --label "automation,digest,review-needed" \
  --body-file /tmp/pr-body.md
```

## Manual PR Creation

If you need to manually create a PR with the automation results:

### Option 1: Use the Workflow Manually

1. Go to GitHub Actions: `https://github.com/YOUR_REPO/actions/workflows/weekly-robot-fetch.yml`
2. Click "Run workflow"
3. Select branch and click "Run workflow"
4. Wait for completion and review the generated PR

### Option 2: Manual Script

Create a file `scripts/manual-pr.sh`:

```bash
#!/bin/bash
set -e

# Extract data
DATE=$(date +%Y-%m-%d)
WEEK_RANGE=$(jq -r '.week_range // "this week"' "data/collected-articles/$DATE.json")
ARTICLE_COUNT=$(jq -r '.total_count // 0' "data/collected-articles/$DATE.json")
DISCOVERED_COUNT=$(jq -r '.summary.total_discovered // 0' "data/discovered-robots/$DATE.json" 2>/dev/null || echo "0")
DIGEST_FILE=$(find content/blog -name "*digest-issue-*.md" -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2)
DIGEST_TITLE=$(if [ -f "$DIGEST_FILE" ]; then grep -m1 '^title:' "$DIGEST_FILE" | sed 's/title: "\(.*\)"/\1/'; else echo "Weekly Digest"; fi)

# Validate
if [ -z "$DIGEST_FILE" ]; then
  DIGEST_FILE="Not generated yet"
  DIGEST_TITLE="Weekly Digest (pending generation)"
fi

# Escape special characters
WEEK_RANGE_ESCAPED=$(printf '%s\n' "$WEEK_RANGE" | sed 's/[&/\]/\\&/g')
GENERATED_DATE=$(date +'%B %d, %Y at %H:%M UTC')
GENERATED_DATE_ESCAPED=$(printf '%s\n' "$GENERATED_DATE" | sed 's/[&/\]/\\&/g')
DIGEST_TITLE_ESCAPED=$(printf '%s\n' "$DIGEST_TITLE" | sed 's/[&/\]/\\&/g')
DIGEST_FILE_ESCAPED=$(printf '%s\n' "$DIGEST_FILE" | sed 's/[&/\]/\\&/g')

# Create PR body
cat > /tmp/pr-body.md <<'TEMPLATE'
## 📊 Weekly Automation Results

**Week**: WEEK_RANGE_PLACEHOLDER
**Generated**: GENERATED_DATE_PLACEHOLDER

### 📰 Article Collection
- **Total Articles**: ARTICLE_COUNT_PLACEHOLDER from IEEE TV, Robot Report, arXiv

### 🔍 Robot Discovery
- **New Robots Discovered**: DISCOVERED_COUNT_PLACEHOLDER
- **Quality Breakdown**: See `data/discovered-robots/DATE_PLACEHOLDER.json`

### 📝 Content Generated
- **Digest**: DIGEST_TITLE_PLACEHOLDER
- **File**: `DIGEST_FILE_PLACEHOLDER`

### 📈 Analytics
- Dashboard updated with latest metrics
- Performance tracking data refreshed

---

### ✅ Review Checklist
- [ ] Review discovered robots for accuracy
- [ ] Verify digest content quality
- [ ] Check analytics data integrity
- [ ] Approve for publication

### 🚀 Next Steps
1. Review the digest blog post for editorial quality
2. Verify discovered robots against official sources
3. Merge this PR to publish the digest
4. Consider adding high-quality discoveries to main catalog

---
*Generated by Weekly Robot Discovery & Digest Automation*
TEMPLATE

# Substitute placeholders
sed -i "s/WEEK_RANGE_PLACEHOLDER/$WEEK_RANGE_ESCAPED/g" /tmp/pr-body.md
sed -i "s/GENERATED_DATE_PLACEHOLDER/$GENERATED_DATE_ESCAPED/g" /tmp/pr-body.md
sed -i "s/ARTICLE_COUNT_PLACEHOLDER/$ARTICLE_COUNT/g" /tmp/pr-body.md
sed -i "s/DISCOVERED_COUNT_PLACEHOLDER/$DISCOVERED_COUNT/g" /tmp/pr-body.md
sed -i "s/DATE_PLACEHOLDER/$DATE/g" /tmp/pr-body.md
sed -i "s/DIGEST_TITLE_PLACEHOLDER/$DIGEST_TITLE_ESCAPED/g" /tmp/pr-body.md
sed -i "s/DIGEST_FILE_PLACEHOLDER/$DIGEST_FILE_ESCAPED/g" /tmp/pr-body.md

# Create PR
gh pr create \
  --title "🤖 Weekly Digest & Discoveries - $WEEK_RANGE" \
  --label "automation,digest,review-needed" \
  --body-file /tmp/pr-body.md

echo "✅ Pull request created successfully"
```

**Usage:**
```bash
chmod +x scripts/manual-pr.sh
./scripts/manual-pr.sh
```

### Option 3: Completely Manual

1. **Gather data manually:**
   ```bash
   DATE=$(date +%Y-%m-%d)
   cat "data/collected-articles/$DATE.json" | jq '.week_range, .total_count'
   cat "data/discovered-robots/$DATE.json" | jq '.summary.total_discovered'
   ls -t content/blog/*digest-issue-*.md | head -1
   ```

2. **Create PR body file** (`pr-body.md`):
   ```markdown
   ## 📊 Weekly Automation Results

   **Week**: Jan 17–23, 2026
   **Generated**: January 23, 2026 at 15:30 UTC

   ### 📰 Article Collection
   - **Total Articles**: 24 from IEEE TV, Robot Report, arXiv

   ### 🔍 Robot Discovery
   - **New Robots Discovered**: 6
   - **Quality Breakdown**: See `data/discovered-robots/2026-01-23.json`

   ### 📝 Content Generated
   - **Digest**: Awesome Robots Digest - Issue 17
   - **File**: `content/blog/2026-01-23-digest-issue-17.md`

   [... rest of template ...]
   ```

3. **Create PR:**
   ```bash
   gh pr create \
     --title "🤖 Weekly Digest & Discoveries - Jan 17–23, 2026" \
     --label "automation,digest,review-needed" \
     --body-file pr-body.md
   ```

## Troubleshooting

### Problem: Placeholders Not Substituted

**Symptoms:** PR body shows `WEEK_RANGE_PLACEHOLDER` instead of actual values

**Causes:**
1. Missing data files
2. Invalid JSON in data files
3. Incorrect file paths

**Solution:**
```bash
# Check if files exist
ls -l data/collected-articles/$(date +%Y-%m-%d).json
ls -l data/discovered-robots/$(date +%Y-%m-%d).json

# Validate JSON
jq . data/collected-articles/$(date +%Y-%m-%d).json
jq . data/discovered-robots/$(date +%Y-%m-%d).json

# Check data extraction
DATE=$(date +%Y-%m-%d)
jq -r '.week_range // "this week"' "data/collected-articles/$DATE.json"
```

### Problem: `sed` Substitution Errors

**Symptoms:** Workflow fails with `sed: -e expression #1, char X: unknown option to 's'`

**Causes:**
1. Unescaped special characters (/, &, \)
2. Variables containing newlines

**Solution:**
- The updated workflow (as of 2026-01-23) includes proper escaping
- If you see this error, ensure you're using the escaped variables:
  ```bash
  # ❌ Wrong - can break with special characters
  sed -i "s/PLACEHOLDER/$VALUE/g" file.md

  # ✅ Correct - escaped for safety
  VALUE_ESCAPED=$(printf '%s\n' "$VALUE" | sed 's/[&/\]/\\&/g')
  sed -i "s/PLACEHOLDER/$VALUE_ESCAPED/g" file.md
  ```

### Problem: Empty or Missing Variables

**Symptoms:** PR body shows "Not generated yet" or empty values

**Causes:**
1. Digest generation failed
2. Files not committed before PR creation
3. Wrong file search pattern

**Solution:**
1. Check if digest was generated:
   ```bash
   ls -lt content/blog/*digest-issue-*.md | head -1
   ```

2. Verify files are staged:
   ```bash
   git status
   git add content/blog/
   ```

3. Check automation logs:
   ```bash
   # In GitHub Actions, view the "Generate Awesome Robots Digest" step
   ```

## Adding New Placeholders

To add a new placeholder to the PR template:

1. **Update the template** (lines 122-159 in workflow):
   ```yaml
   cat > /tmp/pr-body.md <<'TEMPLATE'
   ...
   **New Field**: NEW_PLACEHOLDER
   ...
   TEMPLATE
   ```

2. **Extract the data** (add before line 121):
   ```bash
   NEW_VALUE=$(jq -r '.new_field // "default"' "data/some-file.json")
   ```

3. **Escape the value** (add before line 161):
   ```bash
   NEW_VALUE_ESCAPED=$(printf '%s\n' "$NEW_VALUE" | sed 's/[&/\]/\\&/g')
   ```

4. **Add substitution** (add before line 170):
   ```bash
   sed -i "s/NEW_PLACEHOLDER/$NEW_VALUE_ESCAPED/g" /tmp/pr-body.md
   ```

## Best Practices

1. **Always escape variables** used in `sed` substitution
2. **Validate variables** before substitution to provide fallbacks
3. **Use `jq` with defaults** (`// "fallback"`) when extracting JSON data
4. **Test locally** before pushing workflow changes:
   ```bash
   # Extract your PR creation logic to a script
   bash .github/scripts/create-pr.sh
   ```
5. **Use `workflow_dispatch`** to manually test the full automation
6. **Check workflow logs** in GitHub Actions for debugging

## References

- GitHub Actions workflow: `.github/workflows/weekly-robot-fetch.yml`
- Data file schemas: `src/types/discovered-robot.ts`
- Automation documentation: `docs/SETUP.md`
