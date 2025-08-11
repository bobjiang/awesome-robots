'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import { Robot, FilterOptions } from '@/types/robot';
import robots from '@/data/robots.json';
import categories from '@/data/categories.json';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [categoryId],
    brands: [],
    priceRange: { min: 0, max: 200000 }
  });

  const category = categories.find(c => c.id === categoryId);
  
  const filteredRobots = useMemo(() => {
    const filtered = (robots as Robot[]).filter((robot: Robot) => {
      // Category filter
      if (!filters.categories.includes(robot.category)) return false;
      
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(robot.brand)) return false;
      
      // Price filter
      const robotPrice = typeof robot.price.starting === 'number' ? robot.price.starting : 999999;
      if (robotPrice < filters.priceRange.min || robotPrice > filters.priceRange.max) return false;
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          robot.name.toLowerCase().includes(query) ||
          robot.brand.toLowerCase().includes(query) ||
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
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, searchQuery, sortBy]);

  const availableBrands = Array.from(new Set((robots as Robot[])
    .filter((robot: Robot) => robot.category === categoryId)
    .map((robot: Robot) => robot.brand)
  ));

  if (!category) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-lg text-gray-600">The category you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src={
                categoryId === 'humanoid' ? '/images/categories/humanoid.png' :
                categoryId === 'quadruped' ? '/images/categories/quadruped.png' :
                categoryId === 'accessory' ? '/images/categories/accessories.svg' :
                '/images/categories/other.svg'
              }
              alt={category.name}
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {category.description}
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96">
            <SearchBar 
              onSearch={setSearchQuery}
              placeholder={`Search ${category.name.toLowerCase()}...`}
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
              <option value="brand">Brand</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              availableBrands={availableBrands}
              availableCategories={[category]}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredRobots.length > 0 ? (
              <>
                <div className="mb-6 text-sm text-gray-600">
                  Showing {filteredRobots.length} robot{filteredRobots.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRobots.map((robot) => (
                    <ProductCard key={robot.id} robot={robot} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No robots found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters to find what you&apos;re looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      categories: [categoryId],
                      brands: [],
                      priceRange: { min: 0, max: 200000 }
                    });
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}