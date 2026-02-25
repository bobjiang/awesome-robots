/**
 * Internal Linking Recommendations Component
 *
 * Improves SEO through strategic internal linking:
 * - Related robots by category/brand
 * - Contextual product recommendations
 * - Category and brand page links
 * - Improves crawlability and PageRank distribution
 */

import Link from 'next/link';
import Image from 'next/image';
import { Robot } from '@/types/robot';

interface InternalLinkingRecommendationsProps {
  currentRobot: Robot;
  allRobots: Robot[];
  maxRecommendations?: number;
}

interface LinkRecommendation {
  robot: Robot;
  reason: string;
  score: number;
}

export default function InternalLinkingRecommendations({
  currentRobot,
  allRobots,
  maxRecommendations = 6,
}: InternalLinkingRecommendationsProps) {

  /**
   * Calculate similarity score between two robots
   * Higher score = more relevant recommendation
   */
  const calculateSimilarityScore = (robot: Robot): number => {
    let score = 0;
    const reason = '';

    // Same category (highest weight)
    if (robot.category === currentRobot.category) {
      score += 40;
    }

    // Same brand
    if (robot.brand === currentRobot.brand) {
      score += 30;
    }

    // Similar price range
    const currentPrice = typeof currentRobot.price?.starting === 'number'
      ? currentRobot.price.starting
      : 0;
    const robotPrice = typeof robot.price?.starting === 'number'
      ? robot.price.starting
      : 0;

    if (currentPrice > 0 && robotPrice > 0) {
      const priceDiff = Math.abs(currentPrice - robotPrice);
      const avgPrice = (currentPrice + robotPrice) / 2;
      const priceRatio = priceDiff / avgPrice;

      // Within 30% price range
      if (priceRatio < 0.3) {
        score += 20;
      } else if (priceRatio < 0.5) {
        score += 10;
      }
    }

    // Feature overlap
    const currentFeatures = (currentRobot.features || currentRobot.keyFeatures || [])
      .map(f => f.toLowerCase());
    const robotFeatures = (robot.features || robot.keyFeatures || [])
      .map(f => f.toLowerCase());

    const commonFeatures = currentFeatures.filter(f =>
      robotFeatures.some(rf => rf.includes(f) || f.includes(rf))
    );
    score += Math.min(commonFeatures.length * 5, 20);

    // Recency bonus (newer robots)
    // Assuming robots with higher IDs or certain patterns are newer
    // This is a simplified heuristic
    if (robot.id.includes('2024') || robot.id.includes('2025')) {
      score += 5;
    }

    return score;
  };

  /**
   * Get recommendation reason text
   */
  const getRecommendationReason = (robot: Robot): string => {
    const reasons: string[] = [];

    if (robot.category === currentRobot.category) {
      reasons.push(`Similar ${currentRobot.category} robot`);
    }

    if (robot.brand === currentRobot.brand) {
      reasons.push(`Same brand`);
    }

    const currentPrice = typeof currentRobot.price?.starting === 'number'
      ? currentRobot.price.starting
      : 0;
    const robotPrice = typeof robot.price?.starting === 'number'
      ? robot.price.starting
      : 0;

    if (currentPrice > 0 && robotPrice > 0) {
      const priceDiff = Math.abs(currentPrice - robotPrice);
      const avgPrice = (currentPrice + robotPrice) / 2;
      const priceRatio = priceDiff / avgPrice;

      if (priceRatio < 0.3) {
        reasons.push('Similar price');
      }
    }

    return reasons.length > 0
      ? reasons.slice(0, 2).join(' • ')
      : 'You might also like';
  };

  // Calculate recommendations
  const recommendations: LinkRecommendation[] = allRobots
    .filter(robot => robot.id !== currentRobot.id) // Exclude current robot
    .map(robot => ({
      robot,
      score: calculateSimilarityScore(robot),
      reason: getRecommendationReason(robot),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          You Might Also Like
        </h2>
        <Link
          href={`/categories/${currentRobot.category}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View all {currentRobot.category} robots →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(({ robot, reason }) => (
          <Link
            key={robot.id}
            href={`/robots/${robot.id}`}
            className="group bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            {/* Robot Image */}
            <div className="aspect-square bg-gray-100 relative">
              {robot.images && robot.images.length > 0 ? (
                <Image
                  src={robot.images[0]}
                  alt={`${robot.brand} ${robot.name}`}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                  🤖
                </div>
              )}
            </div>

            {/* Robot Info */}
            <div className="p-4">
              <div className="text-xs text-blue-600 font-medium mb-1">
                {reason}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {robot.brand} {robot.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {robot.description || `${robot.category} robot by ${robot.brand}`}
              </p>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {typeof robot.price?.starting === 'number'
                    ? `$${robot.price.starting.toLocaleString()}`
                    : 'Request Quote'}
                </span>
                <span className="text-xs text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Category and Brand Quick Links */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/categories/${currentRobot.category}`}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
          >
            <span className="mr-2">📁</span>
            All {currentRobot.category} robots
          </Link>
          <Link
            href={`/brands/${currentRobot.brand.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
          >
            <span className="mr-2">🏢</span>
            All {currentRobot.brand} robots
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
          >
            <span className="mr-2">🔍</span>
            Browse all robots
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span className="mr-2">⚖️</span>
            Compare robots
          </Link>
        </div>
      </div>
    </div>
  );
}
