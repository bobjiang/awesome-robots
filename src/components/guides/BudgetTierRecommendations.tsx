'use client';

import React from 'react';
import Link from 'next/link';
import robots from '@/data/robots.json';

export interface BudgetTier {
  name: string;
  range: string;
  description: string;
  robots: (typeof robots)[number][];
}

export interface BudgetTierRecommendationsProps {
  category?: string;
  entryMax?: number;
  midMax?: number;
  limit?: number;
}

const formatPrice = (price: any): string => {
  if (typeof price === 'string') return price;
  if (typeof price === 'number') return `$${price.toLocaleString()}`;
  if (price && typeof price === 'object' && 'starting' in price) {
    if (typeof price.starting === 'string') return price.starting;
    return `From $${price.starting.toLocaleString()}`;
  }
  return 'Price on request';
};

const getNumericPrice = (price: any): number | null => {
  if (typeof price === 'number') return price;
  if (price && typeof price === 'object' && 'starting' in price) {
    if (typeof price.starting === 'number') return price.starting;
  }
  return null;
};

const getBudgetTiers = (
  category?: string,
  entryMax: number = 5000,
  midMax: number = 15000,
  limit: number = 3
): BudgetTier[] => {
  // Filter robots by category if specified
  let filteredRobots = category
    ? robots.filter(r => r.category.toLowerCase() === category.toLowerCase())
    : robots;

  // Filter out robots with no price
  filteredRobots = filteredRobots.filter(r => getNumericPrice(r.price) !== null);

  // Sort by price
  const sortedRobots = [...filteredRobots].sort((a, b) => {
    const priceA = getNumericPrice(a.price) ?? 999999;
    const priceB = getNumericPrice(b.price) ?? 999999;
    return priceA - priceB;
  });

  // Categorize into tiers
  const entry = sortedRobots
    .filter(r => {
      const price = getNumericPrice(r.price);
      return price !== null && price < entryMax;
    })
    .slice(0, limit);

  const mid = sortedRobots
    .filter(r => {
      const price = getNumericPrice(r.price);
      return price !== null && price >= entryMax && price < midMax;
    })
    .slice(0, limit);

  const premium = sortedRobots
    .filter(r => {
      const price = getNumericPrice(r.price);
      return price !== null && price >= midMax;
    })
    .slice(0, limit);

  const tiers: BudgetTier[] = [];

  if (entry.length > 0) {
    tiers.push({
      name: 'Entry Level',
      range: `Under ${formatPrice(entryMax)}`,
      description: 'Great for learning, research, and small-scale applications',
      robots: entry,
    });
  }

  if (mid.length > 0) {
    tiers.push({
      name: 'Mid-Range',
      range: `${formatPrice(entryMax)} - ${formatPrice(midMax)}`,
      description: 'Professional-grade robots for serious research and commercial use',
      robots: mid,
    });
  }

  if (premium.length > 0) {
    tiers.push({
      name: 'Premium',
      range: `Over ${formatPrice(midMax)}`,
      description: 'Top-tier robots with advanced capabilities and enterprise support',
      robots: premium,
    });
  }

  return tiers;
};

export default function BudgetTierRecommendations({
  category,
  entryMax = 5000,
  midMax = 15000,
  limit = 3,
}: BudgetTierRecommendationsProps) {
  const tiers = getBudgetTiers(category, entryMax, midMax, limit);

  if (tiers.length === 0) {
    return (
      <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No robots found {category ? `in the ${category} category` : ''} matching the budget criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 space-y-8">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Tier Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {tier.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {tier.range} • {tier.description}
            </p>
          </div>

          {/* Robot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white dark:bg-gray-900">
            {tier.robots.map((robot) => (
              <div
                key={robot.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Robot Image */}
                {robot.images && robot.images.length > 0 && (
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                    <img
                      src={robot.images[0]}
                      alt={`${robot.brand} ${robot.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Robot Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {robot.brand} {robot.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {robot.category}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(robot.price)}
                    </p>
                  </div>

                  {/* Key Features */}
                  {robot.features && robot.features.length > 0 && (
                    <ul className="text-xs text-gray-600 dark:text-gray-400 mb-3 space-y-1">
                      {robot.features.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Button */}
                  <Link
                    href={`/robots/${robot.id}`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
