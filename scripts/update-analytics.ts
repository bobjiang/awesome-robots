#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import {
  AnalyticsEngine,
  DiscoveryStats,
  SourceStats,
  TrendAnalysis,
  WeeklySnapshot,
  PriceTrend,
  EmergingCompany,
} from '../src/utils/analytics-engine';
import { FetchResult, DiscoveredRobot } from '../src/types/discovered-robot';

// ============================================================================
// Analytics Updater Class
// ============================================================================

/**
 * Updates analytics data from weekly discovery data
 * Processes collected articles and discovered robots to generate insights
 */
class AnalyticsUpdater {
  private engine: AnalyticsEngine;
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.engine = new AnalyticsEngine(this.dataDir);
  }

  /**
   * Main entry point: Update analytics from weekly data
   */
  async updateFromWeeklyData(dateStr: string): Promise<void> {
    console.log(`\n📊 Updating analytics for ${dateStr}...`);

    // Load weekly data
    const collectedPath = path.join(
      this.dataDir,
      'collected-articles',
      `${dateStr}.json`
    );
    const discoveredPath = path.join(
      this.dataDir,
      'discovered-robots',
      `${dateStr}.json`
    );

    if (!fs.existsSync(discoveredPath)) {
      throw new Error(`Discovered robots file not found: ${discoveredPath}`);
    }

    const discoveredData: FetchResult = JSON.parse(
      fs.readFileSync(discoveredPath, 'utf-8')
    );

    // Load collected articles if available (for article counts)
    let articleCounts: Record<string, number> = {
      ieee: 0,
      robotreport: 0,
      arxiv: 0,
    };

    if (fs.existsSync(collectedPath)) {
      try {
        const collectedData = JSON.parse(
          fs.readFileSync(collectedPath, 'utf-8')
        );
        if (collectedData.summary) {
          articleCounts.ieee = collectedData.summary.ieee_count || 0;
          articleCounts.robotreport = collectedData.summary.robotreport_count || 0;
          articleCounts.arxiv = collectedData.summary.arxiv_count || 0;
        }
      } catch (error) {
        console.warn(`Warning: Could not load article counts from ${collectedPath}`);
      }
    }

    // Generate discovery stats
    const stats = this.updateDiscoveryStats(discoveredData, articleCounts);
    this.engine.saveDiscoveryStats(dateStr, stats);
    console.log(`✅ Saved discovery stats for ${dateStr}`);

    // Create weekly snapshot
    const snapshot = this.createWeeklySnapshot(dateStr, stats);
    this.engine.saveWeeklySnapshot(snapshot);
    console.log(`✅ Saved weekly snapshot`);

    // Update trend analysis
    await this.updateTrendAnalysis();
    console.log(`✅ Updated trend analysis`);

    console.log(`\n🎉 Analytics update complete!`);
  }

  /**
   * Generate discovery stats from weekly data
   */
  private updateDiscoveryStats(
    data: FetchResult,
    articleCounts: Record<string, number>
  ): DiscoveryStats {
    const robots = data.robots;

    // Calculate source stats
    const sourceStats: SourceStats[] = ['ieee', 'robotreport', 'arxiv'].map(
      (source) => {
        const sourceRobots = robots.filter((r) => r.source_type === source);
        const totalArticles = articleCounts[source] || 0;

        return {
          source,
          totalArticles,
          robotsDiscovered: sourceRobots.length,
          avgConfidence:
            sourceRobots.length > 0
              ? sourceRobots.reduce((sum, r) => sum + r.confidence_score, 0) /
                sourceRobots.length
              : 0,
          avgQuality:
            sourceRobots.length > 0
              ? sourceRobots.reduce(
                  (sum, r) => sum + r.quality_score.overall,
                  0
                ) / sourceRobots.length
              : 0,
          discoveryRate:
            totalArticles > 0 ? sourceRobots.length / totalArticles : 0,
        };
      }
    );

    // Calculate type breakdown
    const byType = {
      humanoid: robots.filter((r) => r.type === 'humanoid').length,
      quadruped: robots.filter((r) => r.type === 'quadruped').length,
      other: robots.filter((r) => r.type === null).length,
    };

    // Calculate status breakdown
    const byStatus = {
      research: robots.filter((r) => r.status === 'research').length,
      prototype: robots.filter((r) => r.status === 'prototype').length,
      commercial: robots.filter((r) => r.status === 'commercial').length,
    };

    return {
      weekRange: data.week_range,
      fetchDate: data.fetch_date,
      totalArticles:
        articleCounts.ieee + articleCounts.robotreport + articleCounts.arxiv,
      totalRobots: data.summary.total_discovered,
      newRobots: data.summary.new_robots,
      duplicates: data.summary.duplicates_filtered,
      bySource: sourceStats,
      byType,
      byStatus,
      qualityBreakdown: data.summary.quality_breakdown,
    };
  }

  /**
   * Update trend analysis with all historical data
   */
  private async updateTrendAnalysis(): Promise<void> {
    const snapshots = this.engine.getAllWeeklySnapshots();

    if (snapshots.length === 0) {
      console.warn('No weekly snapshots found, skipping trend analysis');
      return;
    }

    const sortedSnapshots = snapshots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const periodStart = sortedSnapshots[0].date;
    const periodEnd = sortedSnapshots[snapshots.length - 1].date;

    // Extract top themes from all discoveries
    const topThemes = this.extractTopThemes(snapshots);

    const analysis: TrendAnalysis = {
      generatedAt: new Date().toISOString(),
      periodStart,
      periodEnd,
      totalWeeks: snapshots.length,
      trends: {
        priceTrends: [], // Placeholder - requires robot pricing data
        emergingCompanies: this.identifyEmergingCompanies(snapshots),
        popularFeatures: topThemes,
        growingCategories: this.identifyGrowingCategories(snapshots),
      },
    };

    this.engine.saveTrendAnalysis(analysis);
  }

  /**
   * Create weekly snapshot for historical tracking
   */
  private createWeeklySnapshot(
    date: string,
    stats: DiscoveryStats
  ): WeeklySnapshot {
    return {
      date,
      weekRange: stats.weekRange,
      stats,
    };
  }

  /**
   * Extract top themes/features from discovery data
   */
  private extractTopThemes(
    snapshots: WeeklySnapshot[]
  ): Array<{ feature: string; count: number }> {
    // Analyze robot types and statuses as themes
    const themes = new Map<string, number>();

    snapshots.forEach((snapshot) => {
      const stats = snapshot.stats;

      // Add type-based themes
      if (stats.byType.humanoid > 0) {
        themes.set(
          'humanoid',
          (themes.get('humanoid') || 0) + stats.byType.humanoid
        );
      }
      if (stats.byType.quadruped > 0) {
        themes.set(
          'quadruped',
          (themes.get('quadruped') || 0) + stats.byType.quadruped
        );
      }

      // Add status-based themes
      if (stats.byStatus.commercial > 0) {
        themes.set(
          'commercial',
          (themes.get('commercial') || 0) + stats.byStatus.commercial
        );
      }
      if (stats.byStatus.prototype > 0) {
        themes.set(
          'prototype',
          (themes.get('prototype') || 0) + stats.byStatus.prototype
        );
      }
    });

    return Array.from(themes.entries())
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Identify emerging companies from discovery patterns
   */
  private identifyEmergingCompanies(
    snapshots: WeeklySnapshot[]
  ): EmergingCompany[] {
    // Load all discovered robots to analyze companies
    const companyCounts = new Map<
      string,
      { count: number; firstSeen: string; latestProduct: string }
    >();

    snapshots.forEach((snapshot) => {
      const dateStr = snapshot.date;
      const discoveredPath = path.join(
        this.dataDir,
        'discovered-robots',
        `${dateStr}.json`
      );

      if (fs.existsSync(discoveredPath)) {
        try {
          const data: FetchResult = JSON.parse(
            fs.readFileSync(discoveredPath, 'utf-8')
          );

          data.robots.forEach((robot) => {
            if (robot.company) {
              const existing = companyCounts.get(robot.company);
              if (existing) {
                existing.count++;
                existing.latestProduct = robot.robot_name || existing.latestProduct;
              } else {
                companyCounts.set(robot.company, {
                  count: 1,
                  firstSeen: dateStr,
                  latestProduct: robot.robot_name || 'Unknown',
                });
              }
            }
          });
        } catch (error) {
          console.warn(`Warning: Could not load ${discoveredPath}`);
        }
      }
    });

    return Array.from(companyCounts.entries())
      .map(([company, data]) => ({
        company,
        robotCount: data.count,
        firstSeen: data.firstSeen,
        latestProduct: data.latestProduct,
        momentum: (data.count >= 3 ? 'high' : data.count >= 2 ? 'medium' : 'low') as
          | 'high'
          | 'medium'
          | 'low',
      }))
      .sort((a, b) => b.robotCount - a.robotCount)
      .slice(0, 10);
  }

  /**
   * Identify growing categories from trends
   */
  private identifyGrowingCategories(
    snapshots: WeeklySnapshot[]
  ): Array<{ category: string; growth: number }> {
    if (snapshots.length < 2) {
      return [];
    }

    const sortedSnapshots = snapshots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstHalf = sortedSnapshots.slice(0, Math.floor(snapshots.length / 2));
    const secondHalf = sortedSnapshots.slice(Math.floor(snapshots.length / 2));

    const firstHalfStats = {
      humanoid: firstHalf.reduce((sum, s) => sum + s.stats.byType.humanoid, 0),
      quadruped: firstHalf.reduce((sum, s) => sum + s.stats.byType.quadruped, 0),
      commercial: firstHalf.reduce((sum, s) => sum + s.stats.byStatus.commercial, 0),
      prototype: firstHalf.reduce((sum, s) => sum + s.stats.byStatus.prototype, 0),
    };

    const secondHalfStats = {
      humanoid: secondHalf.reduce((sum, s) => sum + s.stats.byType.humanoid, 0),
      quadruped: secondHalf.reduce((sum, s) => sum + s.stats.byType.quadruped, 0),
      commercial: secondHalf.reduce(
        (sum, s) => sum + s.stats.byStatus.commercial,
        0
      ),
      prototype: secondHalf.reduce((sum, s) => sum + s.stats.byStatus.prototype, 0),
    };

    const categories = ['humanoid', 'quadruped', 'commercial', 'prototype'];
    return categories
      .map((category) => {
        const firstCount =
          firstHalfStats[category as keyof typeof firstHalfStats];
        const secondCount =
          secondHalfStats[category as keyof typeof secondHalfStats];
        const growth =
          firstCount > 0 ? ((secondCount - firstCount) / firstCount) * 100 : 0;

        return { category, growth };
      })
      .filter((c) => c.growth > 0)
      .sort((a, b) => b.growth - a.growth);
  }
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📊 Analytics Updater

Updates analytics data from weekly discovery results.

Usage:
  npm run update-analytics [date]

Arguments:
  date    Date string in YYYY-MM-DD format (optional, defaults to latest)

Examples:
  npm run update-analytics 2026-01-09
  npm run update-analytics              # Uses latest discovered-robots file
`);
    return;
  }

  const updater = new AnalyticsUpdater();

  // Get date argument or find latest file
  let dateStr = args[0];

  if (!dateStr) {
    const discoveredDir = path.join(process.cwd(), 'data', 'discovered-robots');
    const files = fs
      .readdirSync(discoveredDir)
      .filter((f) => f.endsWith('.json') && f !== '.gitkeep')
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error('❌ No discovered robots files found');
      process.exit(1);
    }

    dateStr = files[0].replace('.json', '');
    console.log(`📅 Using latest file: ${dateStr}`);
  }

  try {
    await updater.updateFromWeeklyData(dateStr);
  } catch (error) {
    console.error(
      '❌ Error:',
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AnalyticsUpdater };
