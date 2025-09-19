#!/bin/bash

# Weekly Awesome Robots Digest - Automated Generation and Publishing
# Runs every Friday at 10:00 AM UTC+11

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Change to project directory
cd "$PROJECT_DIR"

# Create log directory if it doesn't exist
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"

# Log file with timestamp
LOG_FILE="$LOG_DIR/weekly-digest-$(date '+%Y-%m-%d_%H-%M-%S').log"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting weekly digest generation and publishing process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log "ERROR: Not in the correct project directory. Expected to find package.json."
    exit 1
fi

# Check if a digest already exists for this week
CURRENT_DATE=$(date '+%Y-%m-%d')
EXISTING_DIGEST=$(find content/blog -name "awesome-robots-digest-issue-*.md" -exec grep -l "date: \"$CURRENT_DATE\"" {} \; 2>/dev/null | head -n 1)

if [ -n "$EXISTING_DIGEST" ]; then
    log "Digest already exists for today ($CURRENT_DATE): $EXISTING_DIGEST"
    log "Skipping generation to avoid duplicates. Exiting gracefully."
    exit 0
fi

# Generate the digest template
log "Generating digest template..."
if npm run generate-digest >> "$LOG_FILE" 2>&1; then
    log "Digest template generated successfully"
else
    log "ERROR: Failed to generate digest template"
    exit 1
fi

# Find the latest digest file
LATEST_DIGEST=$(ls -t content/blog/awesome-robots-digest-issue-*.md 2>/dev/null | head -n 1)

if [ -z "$LATEST_DIGEST" ]; then
    log "ERROR: No digest file found after generation"
    exit 1
fi

log "Latest digest file: $LATEST_DIGEST"

# Commit the new digest to git
log "Committing new digest to git..."
git add "$LATEST_DIGEST"

if git diff --staged --quiet; then
    log "No new digest files to commit"
else
    COMMIT_MSG="Generate Awesome Robots Digest template for $(date '+%Y-%m-%d')

🤖 Auto-generated weekly digest template

Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

    if git commit -m "$COMMIT_MSG" >> "$LOG_FILE" 2>&1; then
        log "Digest committed to git successfully"

        # Push to remote
        if git push >> "$LOG_FILE" 2>&1; then
            log "Changes pushed to remote repository"
        else
            log "WARNING: Failed to push to remote repository"
        fi
    else
        log "ERROR: Failed to commit digest to git"
        exit 1
    fi
fi

# Publish to dev.to as draft
log "Publishing digest to dev.to as draft..."
if npm run publish-blog file "$LATEST_DIGEST" -- --draft >> "$LOG_FILE" 2>&1; then
    log "Digest published to dev.to successfully as draft"
else
    log "ERROR: Failed to publish digest to dev.to"
    exit 1
fi

log "Weekly digest process completed successfully!"
log "Log file: $LOG_FILE"
log "Published file: $LATEST_DIGEST"

# Clean up old log files (keep only last 10)
find "$LOG_DIR" -name "weekly-digest-*.log" -type f | sort -r | tail -n +11 | xargs rm -f

log "Process complete. Check dev.to drafts for the published digest."