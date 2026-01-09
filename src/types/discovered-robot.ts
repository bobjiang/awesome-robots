export type QualityFlag =
  | 'missing_company'
  | 'missing_robot_name'
  | 'missing_image'
  | 'unclear_type'
  | 'research_paper_only'
  | 'invalid_url'
  | 'low_confidence';

export interface QualityScore {
  overall: number;
  completeness: number;
  reliability: number;
  flags: QualityFlag[];
}

export interface DiscoveredRobot {
  company: string | null;
  robot_name: string | null;
  type: 'humanoid' | 'quadruped' | null;
  status: 'research' | 'prototype' | 'commercial';
  image_link: string | null;
  specs_link: string | null;
  source_link: string;

  // Metadata
  discovered_at: string;
  source_type: 'ieee' | 'robotreport' | 'arxiv';
  confidence_score: number;
  quality_score: QualityScore;
  description?: string;
}

export interface FetchError {
  source: string;
  error: string;
  timestamp: string;
}

export interface FetchResult {
  fetch_date: string;
  week_range: string;
  summary: {
    total_discovered: number;
    duplicates_filtered: number;
    new_robots: number;
    quality_breakdown: {
      high: number;
      medium: number;
      low: number;
    };
    source_breakdown: Record<string, number>;
  };
  robots: DiscoveredRobot[];
  errors: FetchError[];
}

export interface RSSArticle {
  title: string;
  link: string;
  pubDate: Date;
  content: string;
  excerpt: string;
}

export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  link: string;
  submittedDate: Date;
}
