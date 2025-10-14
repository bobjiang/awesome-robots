'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { Robot } from '@/types/robot';
import robots from '@/data/robots.json';
import brands from '@/data/brands.json';

export default function BrandPage() {
  const params = useParams();
  const brandId = params.brand as string;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const brand = brands.find(b => b.id === brandId);
  
  const brandRobots = useMemo(() => {
    const filtered = (robots as Robot[]).filter((robot: Robot) => {
      // Brand filter
      if (robot.brand.toLowerCase() !== brandId.replace('-', ' ')) return false;
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          robot.name.toLowerCase().includes(query) ||
          robot.description.toLowerCase().includes(query) ||
          robot.features.some(feature => feature.toLowerCase().includes(query))
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
  }, [brandId, searchQuery, sortBy]);

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

  if (!brand) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Brand Not Found</h1>
          <p className="text-lg text-gray-600">The brand you&apos;re looking for doesn&apos;t exist in our catalog.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand Header */}
        <div className="text-center mb-12">
          {brand.logo && (
            <div className="w-48 h-24 mx-auto mb-6 relative">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                fill
                className="object-contain"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {brand.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {brand.description}
          </p>
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            Visit Official Website
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96">
            <SearchBar 
              onSearch={setSearchQuery}
              placeholder={`Search ${brand.name} robots...`}
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
            {Object.entries(robotsByCategory).map(([category, robots]) => (
              <div key={category}>
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {category} Robots
                  </h2>
                  <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {robots.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {robots.map((robot) => (
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

        {/* Brand Stats */}
        {brandRobots.length > 0 && (
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {brandRobots.length}
                </div>
                <div className="text-gray-600">Total Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Object.keys(robotsByCategory).length}
                </div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ${Math.min(...brandRobots.map(r => typeof r.price.starting === 'number' ? r.price.starting : 999999)).toLocaleString()}+
                </div>
                <div className="text-gray-600">Starting Price</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/brands"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              ← All Brands
            </Link>
            <Link
              href="/browse"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse All
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}