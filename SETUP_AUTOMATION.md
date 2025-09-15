# 🤖 Digest Automation Setup Guide

## ✅ Completed Setup

The automated digest generation system has been successfully implemented with:

- ✅ **Digest Generation Script** (`scripts/generate-digest.ts`)
- ✅ **GitHub Actions Workflow** (`.github/workflows/weekly-digest.yml`) 
- ✅ **NPM Scripts** added to `package.json`
- ✅ **Documentation** created (`docs/DIGEST_AUTOMATION.md`)

## 🔐 Required: GitHub Repository Secrets

You need to set up these secrets in your GitHub repository for the automation to work:

### 1. DEV_TO_API_KEY
- **Value**: `awtGCrMBNTPKoEynRuuiFH6h` (your dev.to API key)
- **Purpose**: Publishing articles to dev.to

### 2. NEXT_PUBLIC_BASE_URL  
- **Value**: `https://www.awesomerobots.xyz`
- **Purpose**: Canonical URLs in published articles

### How to Add Secrets:
1. Go to your GitHub repository: `https://github.com/[username]/awesome-robots`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add both secrets above

## 🗓️ Schedule Confirmation

The automation is configured to run:
- **Every Friday at 10:00 AM UTC+11**
- **Equivalent to Thursday 11:00 PM UTC**
- **Cron expression**: `0 23 * * 4`

## 🎯 What Happens Automatically

### Every Friday:
1. 🤖 GitHub Action triggers
2. 📝 New digest template generated
3. 🔄 Pull Request created for review
4. 📧 You receive notification to edit content

### Manual Steps (after automation):
1. 📖 Review the PR
2. ✏️ Edit digest with real content
3. ✅ Merge PR when ready
4. 🚀 Run: `npm run publish-blog file content/blog/awesome-robots-digest-issue-X.md`

## 🧪 Testing Commands

```bash
# Generate template only
npm run generate-digest

# Generate and publish as draft
npm run digest-and-publish

# Publish specific digest
npm run publish-blog file content/blog/awesome-robots-digest-issue-X.md

# Publish as draft
npm run publish-blog file content/blog/awesome-robots-digest-issue-X.md --draft
```

## 🔄 Manual Trigger

You can also trigger the automation manually:
1. Go to **Actions** → **Weekly Awesome Robots Digest**
2. Click **Run workflow**
3. Choose whether to publish immediately as draft

## 📋 Next Steps

1. **Set up GitHub secrets** (required for automation)
2. **Test manual generation**: `npm run generate-digest`
3. **Wait for Friday** or manually trigger the workflow
4. **Review first automated PR** and adjust as needed

## 📚 Full Documentation

See `docs/DIGEST_AUTOMATION.md` for complete details on:
- Workflow customization
- Troubleshooting
- Future enhancements
- File structure

---

**Setup Status**: ✅ Complete (pending GitHub secrets)  
**Next Automated Run**: Friday, September 19, 2025 at 10:00 AM UTC+11