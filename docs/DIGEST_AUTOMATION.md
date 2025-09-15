# Awesome Robots Digest Automation

This document describes the automated weekly digest generation and publishing system for the Awesome Robots blog.

## 🗓️ Schedule

- **Frequency**: Every Friday
- **Time**: 10:00 AM UTC+11 (11:00 PM UTC Thursday)
- **Platform**: GitHub Actions

## 🔧 How It Works

### Automated Generation
1. **GitHub Action triggers** every Friday at 10:00 AM UTC+11
2. **Template generation** using `scripts/generate-digest.ts`
3. **Auto-commit** new digest template to repository
4. **Pull Request creation** for manual review and editing

### Manual Process
1. **Review the PR** created by the automation
2. **Edit the digest content** with actual news, research, and developments
3. **Fill in all placeholder sections** with real content
4. **Merge the PR** when content is ready
5. **Publish to dev.to** using the publish command

## 📝 Commands

### Generate Digest Template
```bash
# Generate template only
npm run generate-digest

# Generate and publish as draft to dev.to
npm run digest-and-publish
```

### Publish Existing Digest
```bash
# Publish specific digest file to dev.to
npm run publish-blog file content/blog/awesome-robots-digest-issue-X.md

# Publish as draft
npm run publish-blog file content/blog/awesome-robots-digest-issue-X.md --draft

# Local file only (skip dev.to)
npm run publish-blog file content/blog/awesome-robots-digest-issue-X.md --local-only
```

## 🔐 Required Secrets

The GitHub Action requires these repository secrets:

### DEV_TO_API_KEY
Your dev.to API key for publishing articles.
- **How to get**: Go to dev.to → Settings → Extensions → DEV Community API Keys
- **Permissions**: Write access to create and update articles

### NEXT_PUBLIC_BASE_URL
The base URL of your website for canonical links.
- **Value**: `https://www.awesomerobots.xyz`

### Setting Up Secrets
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add both secrets with their respective values

## 🎯 Workflow Options

### Scheduled Automatic (Default)
- Runs every Friday at 10:00 AM UTC+11
- Creates template and PR for review
- Does NOT publish automatically

### Manual Trigger
- Go to **Actions** → **Weekly Awesome Robots Digest**
- Click **Run workflow**
- Choose whether to publish immediately as draft

## 📁 File Structure

```
awesome-robots/
├── .github/workflows/
│   └── weekly-digest.yml          # GitHub Action workflow
├── scripts/
│   ├── generate-digest.ts         # Digest generation script
│   └── publish-blog.ts           # Publishing script
├── content/
│   ├── blog/                     # Generated digest files
│   │   └── awesome-robots-digest-issue-X.md
│   └── templates/
│       └── awesome-robots-digest-template.md
└── docs/
    └── DIGEST_AUTOMATION.md       # This file
```

## 🔄 Typical Weekly Workflow

### Friday Morning (Automated)
1. ⏰ GitHub Action triggers at 10:00 AM UTC+11
2. 🤖 Script generates new digest template
3. 📝 Template committed to new branch
4. 🔄 Pull Request created for review

### Friday (Manual Review)
1. 📧 Receive PR notification
2. 📖 Review generated template
3. ✏️ Edit content with actual news and research
4. 🎯 Fill in TL;DR and conclusion sections
5. ✅ Approve and merge PR

### Friday (Publishing)
1. 🚀 Run publish command locally or via GitHub Action
2. 📤 Article published to dev.to with canonical links
3. 💾 Metadata saved for future reference

## 🛠️ Customization

### Changing Schedule
Edit the cron expression in `.github/workflows/weekly-digest.yml`:
```yaml
schedule:
  # Current: Friday 10:00 AM UTC+11 (23:00 UTC Thursday)
  - cron: '0 23 * * 4'
  
  # Examples:
  # Monday 9:00 AM UTC: '0 9 * * 1'
  # Wednesday 2:00 PM UTC: '0 14 * * 3'
```

### Template Modifications
Edit `scripts/generate-digest.ts` to modify:
- Default content structure
- Metadata fields
- Date formatting
- Issue numbering

### Adding Content Sources
The digest generation is currently template-based. To add automated content:
1. Integrate RSS feeds or APIs
2. Add content parsing logic
3. Update template generation with real data

## 🐛 Troubleshooting

### Action Fails
- Check repository secrets are set correctly
- Verify dev.to API key has write permissions
- Ensure Node.js dependencies are installed

### Template Not Generated
- Check file permissions in content/blog/
- Verify scripts/generate-digest.ts syntax
- Review GitHub Action logs

### Publishing Fails
- Confirm DEV_TO_API_KEY is valid
- Check dev.to API rate limits
- Verify markdown content formatting

## 🔮 Future Enhancements

### Automated Content Collection
- RSS feed integration for robotics news
- arXiv paper scanning for research
- GitHub trending repositories for tools
- Twitter/X hashtag monitoring for community content

### Enhanced Scheduling
- Multiple timezones support
- Holiday/conference awareness
- Custom trigger conditions

### Content Quality
- AI-powered content summarization
- Automated fact-checking
- SEO optimization suggestions
- Image generation for social media

## 📞 Support

For issues with the automation system:
1. Check GitHub Action logs
2. Review this documentation
3. Test commands locally first
4. Create an issue in the repository

---

**Last Updated**: September 2025  
**Maintained By**: Awesome Robots Team