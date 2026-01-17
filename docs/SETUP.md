# Setup Guide for Weekly Automation

This guide explains how to configure the weekly automation system for article collection, robot discovery, digest generation, and analytics updates.

## Prerequisites

- GitHub repository with Actions enabled
- Anthropic API key (for robot extraction and digest generation)
- Node.js 20+ and npm installed locally for testing

## Configuration Steps

### 1. Add Anthropic API Key to GitHub Secrets

The automation requires an Anthropic API key to power the robot extraction and digest generation steps.

**Step 1: Get your API key**
- Visit https://console.anthropic.com/settings/keys
- Create a new API key or copy an existing one
- Recommended: Create a project-specific key named "awesome-robots-automation"

**Step 2: Add secret to GitHub**
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ANTHROPIC_API_KEY`
5. Value: Paste your Anthropic API key
6. Click **Add secret**

**Security notes:**
- Never commit API keys to the repository
- Rotate keys periodically for security
- Monitor API usage in Anthropic Console

### 2. Verify Workflow Configuration

The automation workflow is configured in `.github/workflows/weekly-robot-fetch.yml`.

**Default schedule:**
- Runs every Friday at 10:00 AM UTC
- Cron expression: `0 10 * * 5`

**To change the schedule:**
Edit the cron expression in the workflow file:
```yaml
on:
  schedule:
    - cron: '0 10 * * 5'  # Modify this line
```

**Manual trigger:**
The workflow can be manually triggered from the GitHub Actions UI:
1. Go to **Actions** tab
2. Select **Weekly Robot Discovery & Digest Automation**
3. Click **Run workflow**

### 3. Test Automation Locally

Before relying on GitHub Actions, test the automation scripts locally:

**Test article collection (no API required):**
```bash
npm run fetch-articles -- --dry-run
```

**Test robot extraction (requires API key):**
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
npm run extract-robots -- --dry-run
```

**Test digest generation (requires API key):**
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
npm run generate-digest -- --dry-run
```

**Test analytics update (no API required):**
```bash
npm run update-analytics
```

**Expected output:**
- Scripts should complete without errors
- Dry-run mode should show what would be generated without writing files
- Check console output for any warnings or issues

## Cost Monitoring

### Anthropic API Usage

The automation uses Claude Sonnet 4.5 for robot extraction and digest generation.

**Estimated weekly costs:**
- Robot extraction: ~20 articles × $0.003/article = **$0.06/week**
- Digest generation: 1 digest × $0.015 = **$0.015/week**
- **Total: ~$0.08/week** or **$4/year**

**Cost optimization tips:**
1. Monitor usage in Anthropic Console
2. Set budget alerts at $1/month
3. Adjust article sources if costs increase
4. Use `--dry-run` for testing to avoid API calls

**View usage:**
- Visit https://console.anthropic.com/settings/usage
- Monitor daily/monthly spend
- Set up budget alerts under Settings

### GitHub Actions Usage

The workflow runs weekly and is well within the free tier limits.

**Resource usage:**
- Compute time: ~3-5 minutes/week
- Free tier: 2,000 minutes/month
- Monthly usage: ~20 minutes (1% of free tier)

## Troubleshooting

### Common Issues

**Issue: API key not found**
```
Error: ANTHROPIC_API_KEY environment variable is not set
```
**Solution:** Verify the secret is added correctly in GitHub Settings → Secrets

**Issue: Rate limit exceeded**
```
Error: 429 Too Many Requests
```
**Solution:** Wait 60 seconds and retry, or reduce article sources temporarily

**Issue: Invalid JSON in collected articles**
```
Error: Unexpected token in JSON at position 0
```
**Solution:** Check `data/collected-articles/YYYY-MM-DD.json` for syntax errors

**Issue: Workflow fails but no error message**
```
Check the Actions tab for detailed logs
```
**Solution:**
1. Go to Actions tab in GitHub
2. Click on the failed workflow run
3. Expand failed step to see detailed error logs
4. Check "Report automation failure" issue for guidance

### Manual Recovery

If automation fails, you can run scripts manually and create a PR:

```bash
# 1. Fetch latest code
git pull origin main

# 2. Run automation scripts
npm run fetch-articles
export ANTHROPIC_API_KEY="your-key"
npm run extract-robots
npm run generate-digest
npm run update-analytics

# 3. Create feature branch
git checkout -b automation/manual-run-$(date +%Y-%m-%d)

# 4. Commit changes
git add data/ content/blog/ src/data/analytics-*.json
git commit -m "feat: Manual automation run for $(date +%Y-%m-%d)"
git push -u origin automation/manual-run-$(date +%Y-%m-%d)

# 5. Create PR from GitHub UI
```

## Support

- **Documentation:** See `CLAUDE.md` for system architecture
- **Scripts:** See `scripts/README.md` for detailed script documentation
- **Issues:** Create a GitHub issue with the `automation` label
- **API:** Visit https://docs.anthropic.com for Anthropic API documentation
