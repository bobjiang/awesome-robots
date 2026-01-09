import { distance } from 'fastest-levenshtein';
import type { Robot } from '@/types/robot';
import type { DiscoveredRobot } from '@/types/discovered-robot';

class RobotDeduplicator {
  private existingRobots: Robot[];
  private readonly COMPANY_THRESHOLD = 85; // 85% similarity for company match
  private readonly ROBOT_THRESHOLD = 80; // 80% similarity for robot name match

  constructor(existingRobots: Robot[]) {
    this.existingRobots = existingRobots;
  }

  isDuplicate(discovered: DiscoveredRobot): boolean {
    // Skip if missing critical fields
    if (!discovered.company || !discovered.robot_name) {
      return false; // Can't determine duplicates without both fields
    }

    const normalizedDiscoveredCompany = this.normalizeString(discovered.company);
    const normalizedDiscoveredName = this.normalizeString(discovered.robot_name);

    // Check against all existing robots
    for (const existing of this.existingRobots) {
      const normalizedExistingBrand = this.normalizeString(existing.brand);
      const normalizedExistingName = this.normalizeString(existing.name);

      const companySimilarity = this.calculateSimilarity(
        normalizedDiscoveredCompany,
        normalizedExistingBrand
      );

      const nameSimilarity = this.calculateSimilarity(
        normalizedDiscoveredName,
        normalizedExistingName
      );

      // Both company AND name must match
      if (companySimilarity >= this.COMPANY_THRESHOLD && nameSimilarity >= this.ROBOT_THRESHOLD) {
        console.log(
          `Duplicate found: "${discovered.robot_name}" by "${discovered.company}" ` +
            `matches "${existing.name}" by "${existing.brand}" ` +
            `(company: ${companySimilarity.toFixed(1)}%, name: ${nameSimilarity.toFixed(1)}%)`
        );
        return true;
      }
    }

    return false;
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .replace(/[.,\-_]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\b(inc|ltd|corp|corporation|robotics|robot|co|company)\b/g, '') // Remove common suffixes
      .trim();
  }

  private calculateSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 100;

    const maxLen = Math.max(str1.length, str2.length);
    if (maxLen === 0) return 100;

    const dist = distance(str1, str2);
    return ((maxLen - dist) / maxLen) * 100;
  }

  // Helper to find best match for debugging
  findBestMatch(discovered: DiscoveredRobot): { match: Robot | null; companySimilarity: number; nameSimilarity: number } {
    if (!discovered.company || !discovered.robot_name) {
      return { match: null, companySimilarity: 0, nameSimilarity: 0 };
    }

    const normalizedDiscoveredCompany = this.normalizeString(discovered.company);
    const normalizedDiscoveredName = this.normalizeString(discovered.robot_name);

    let bestMatch: Robot | null = null;
    let bestScore = 0;
    let bestCompanySimilarity = 0;
    let bestNameSimilarity = 0;

    for (const existing of this.existingRobots) {
      const normalizedExistingBrand = this.normalizeString(existing.brand);
      const normalizedExistingName = this.normalizeString(existing.name);

      const companySimilarity = this.calculateSimilarity(
        normalizedDiscoveredCompany,
        normalizedExistingBrand
      );

      const nameSimilarity = this.calculateSimilarity(
        normalizedDiscoveredName,
        normalizedExistingName
      );

      const combinedScore = (companySimilarity + nameSimilarity) / 2;

      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        bestMatch = existing;
        bestCompanySimilarity = companySimilarity;
        bestNameSimilarity = nameSimilarity;
      }
    }

    return {
      match: bestMatch,
      companySimilarity: bestCompanySimilarity,
      nameSimilarity: bestNameSimilarity,
    };
  }
}

export { RobotDeduplicator };
