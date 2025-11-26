'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { Robot } from '@/types/robot';

interface BrandBrowserProps {
  robots: Robot[];
  brandName: string;
}

export default function BrandBrowser({
  robots,
  brandName,
}: BrandBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const brandRobots = useMemo(() => {
    const filtered = robots.filter((robot: Robot) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const features = robot.features || robot.keyFeatures || [];
        return (
          robot.name.toLowerCase().includes(query) ||
          robot.description.toLowerCase().includes(query) ||
          features.some(feature => feature.toLowerCase().includes(query))
        );
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          const priceA = typeof a.price.starting === 'number' ? a.price.starting : 999999;
          const priceB = typeof b.price.starting === 'number' ? b.price.starting : 999999;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = typeof a.price.starting === 'number' ? a.price.starting : 0;
          const priceB2 = typeof b.price.starting === 'number' ? b.price.starting : 0;
          return priceB2 - priceA2;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [robots, searchQuery, sortBy]);

  const robotsByCategory = useMemo(() => {
    const grouped = brandRobots.reduce((acc, robot) => {
      if (!acc[robot.category]) {
        acc[robot.category] = [];
      }
      acc[robot.category].push(robot);
      return acc;
    }, {} as Record<string, Robot[]>);

    return grouped;
  }, [brandRobots]);

  return (
    <>
      {/* Search and Sort Controls */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="w-full lg:w-96">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder={`Search ${brandName} robots...`}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* Products by Category */}
      {brandRobots.length > 0 ? (
        <div className="space-y-12">
          {Object.entries(robotsByCategory).map(([category, categoryRobots]) => (
            <div key={category}>
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {category} Robots
                </h2>
                <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {categoryRobots.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryRobots.map((robot) => (
                  <ProductCard key={robot.id} robot={robot} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No robots found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </>
  );
}
