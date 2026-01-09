import type { DiscoveredRobot, QualityScore, QualityFlag } from '@/types/discovered-robot';

class QualityScorer {
  scoreRobot(robot: DiscoveredRobot): QualityScore {
    const flags: QualityFlag[] = [];

    // Check for missing fields
    if (!robot.company) flags.push('missing_company');
    if (!robot.robot_name) flags.push('missing_robot_name');
    if (!robot.image_link) flags.push('missing_image');
    if (!robot.type) flags.push('unclear_type');
    if (robot.status === 'research') flags.push('research_paper_only');
    if (robot.confidence_score < 60) flags.push('low_confidence');

    // Validate URLs
    if (robot.image_link && !this.isValidUrl(robot.image_link)) {
      flags.push('invalid_url');
    }
    if (robot.specs_link && !this.isValidUrl(robot.specs_link)) {
      flags.push('invalid_url');
    }

    // Calculate scores
    const completeness = this.calculateCompleteness(robot);
    const reliability = this.calculateReliability(robot);
    const overall = completeness * 0.6 + reliability * 0.4;

    return {
      overall: Math.round(overall),
      completeness: Math.round(completeness),
      reliability: Math.round(reliability),
      flags,
    };
  }

  private calculateCompleteness(robot: DiscoveredRobot): number {
    const fields: (keyof DiscoveredRobot)[] = [
      'company',
      'robot_name',
      'type',
      'image_link',
      'specs_link',
    ];

    const present = fields.filter(field => {
      const value = robot[field];
      return value !== null && value !== undefined && value !== '';
    }).length;

    return (present / fields.length) * 100;
  }

  private calculateReliability(robot: DiscoveredRobot): number {
    let score = 0;

    // Critical fields (60 points total)
    if (robot.company) score += 30;
    if (robot.robot_name) score += 30;

    // Important fields (30 points total)
    if (robot.type) score += 20;
    if (robot.image_link) score += 10;

    // Bonus for specs link (10 points)
    if (robot.specs_link) score += 10;

    return score;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export { QualityScorer };
