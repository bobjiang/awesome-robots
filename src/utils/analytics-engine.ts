import fs from 'fs';
import path from 'path';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Statistics for a single discovery source
 */
export interface SourceStats {
  source: string;
  totalArticles: number;
  robotsDiscovered: number;
  avgConfidence: number;
  avgQuality: number;
  discoveryRate: number; // robots per article
}

/**
 * Overall discovery statistics for a week
 */
export interface DiscoveryStats {
  weekRange: string;
  fetchDate: string;
  totalArticles: number;
  totalRobots: number;
  newRobots: number;
  duplicates: number;
  bySource: SourceStats[];
  byType: {
    humanoid: number;
    quadruped: number;
    other: number;
  };
  byStatus: {
    research: number;
    prototype: number;
    commercial: number;
  };
  qualityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Price trend data for a robot type
 */
export interface PriceTrend {
  type: 'humanoid' | 'quadruped';
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  sampleSize: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Emerging company detection
 */
export interface EmergingCompany {
  company: string;
  robotCount: number;
  firstSeen: string;
  latestProduct: string;
  momentum: 'high' | 'medium' | 'low';
}

/**
 * Long-term trend analysis
 */
export interface TrendAnalysis {
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  totalWeeks: number;
  trends: {
    priceTrends: PriceTrend[];
    emergingCompanies: EmergingCompany[];
    popularFeatures: Array<{ feature: string; count: number }>;
    growingCategories: Array<{ category: string; growth: number }>;
  };
}

/**
 * Weekly snapshot for historical tracking
 */
export interface WeeklySnapshot {
  date: string;
  weekRange: string;
  stats: DiscoveryStats;
}

// ============================================================================
// Analytics Engine Class
// ============================================================================

/**
 * Analytics engine for robot discovery data
 * Processes collected articles and discovered robots to generate insights
 */
export class AnalyticsEngine {
  private dataDir: string;
  private analyticsDir: string;

  constructor(
    dataDir: string = path.join(process.cwd(), 'data'),
    analyticsDir: string = path.join(process.cwd(), 'data', 'analytics')
  ) {
    this.dataDir = dataDir;
    this.analyticsDir = analyticsDir;
    this.ensureAnalyticsDir();
  }

  /**
   * Ensure analytics directory exists
   */
  private ensureAnalyticsDir(): void {
    if (!fs.existsSync(this.analyticsDir)) {
      fs.mkdirSync(this.analyticsDir, { recursive: true });
    }
  }

  /**
   * Load discovery stats from a specific date
   * @param date - Date string in YYYY-MM-DD format
   * @returns Discovery stats object or null if file doesn't exist or is corrupted
   */
  loadDiscoveryStats(date: string): DiscoveryStats | null {
    const filePath = path.join(this.analyticsDir, `stats-${date}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as DiscoveryStats;
    } catch (error) {
      console.error(`Error loading analytics file ${filePath}: ${error}`);
      return null;
    }
  }

  /**
   * Save discovery stats for a specific date
   */
  saveDiscoveryStats(date: string, stats: DiscoveryStats): void {
    const filePath = path.join(this.analyticsDir, `stats-${date}.json`);
    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2), 'utf-8');
  }

  /**
   * Load trend analysis
   * @returns Trend analysis object or null if file doesn't exist or is corrupted
   */
  loadTrendAnalysis(): TrendAnalysis | null {
    const filePath = path.join(this.analyticsDir, 'trends.json');
    if (!fs.existsSync(filePath)) {
      return null;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as TrendAnalysis;
    } catch (error) {
      console.error(`Error loading analytics file ${filePath}: ${error}`);
      return null;
    }
  }

  /**
   * Save trend analysis
   */
  saveTrendAnalysis(analysis: TrendAnalysis): void {
    const filePath = path.join(this.analyticsDir, 'trends.json');
    fs.writeFileSync(filePath, JSON.stringify(analysis, null, 2), 'utf-8');
  }

  /**
   * Save weekly snapshot to historical data
   * @param snapshot - Weekly snapshot to save
   */
  saveWeeklySnapshot(snapshot: WeeklySnapshot): void {
    const filePath = path.join(this.analyticsDir, 'weekly-snapshots.json');
    let snapshots: WeeklySnapshot[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        snapshots = JSON.parse(content);
      } catch (error) {
        console.error(`Error loading existing snapshots from ${filePath}: ${error}`);
        console.error('Starting with empty snapshots array');
        snapshots = [];
      }
    }

    // Add new snapshot and sort by date
    snapshots.push(snapshot);
    snapshots.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    fs.writeFileSync(filePath, JSON.stringify(snapshots, null, 2), 'utf-8');
  }

  /**
   * Get all weekly snapshots
   * @returns Array of weekly snapshots or empty array if file doesn't exist or is corrupted
   */
  getAllWeeklySnapshots(): WeeklySnapshot[] {
    const filePath = path.join(this.analyticsDir, 'weekly-snapshots.json');
    if (!fs.existsSync(filePath)) {
      return [];
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as WeeklySnapshot[];
    } catch (error) {
      console.error(`Error loading analytics file ${filePath}: ${error}`);
      return [];
    }
  }
}
