'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import { Robot, FilterOptions } from '@/types/robot';
import robots from '@/data/robots.json';
import categories from '@/data/categories.json';

function BrowseContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 200000 }
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    
    if (categoryParam || brandParam) {
      setFilters(prev => ({
        ...prev,
        categories: categoryParam ? [categoryParam] : prev.categories,
        brands: brandParam ? [brandParam] : prev.brands
      }));
    }
  }, [searchParams]);

  const filteredRobots = useMemo(() => {
    const filtered = (robots as Robot[]).filter((robot: Robot) => {
      // Category filter - if no categories selected, show all
      if (filters.categories.length > 0 && !filters.categories.includes(robot.category)) return false;
      
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
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, searchQuery, sortBy]);

  const availableBrands = Array.from(new Set((robots as Robot[])
    .map((robot: Robot) => robot.brand)
  ));

  const availableCategories = categories;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Browse All Robots
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our complete collection of AI-powered robots. Use filters to find exactly what you need 
            or browse through all available models from leading robotics companies.
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96">
            <SearchBar 
              onSearch={setSearchQuery}
              placeholder="Search all robots..."
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
              <option value="category">Category</option>
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
              availableCategories={availableCategories}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredRobots.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {filteredRobots.length} robot{filteredRobots.length !== 1 ? 's' : ''}
                    {filters.categories.length > 0 && (
                      <span className="ml-2">
                        in {filters.categories.map(cat => 
                          categories.find(c => c.id === cat)?.name || cat
                        ).join(', ')}
                      </span>
                    )}
                  </div>
                  
                  {(filters.categories.length > 0 || filters.brands.length > 0 || searchQuery) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({
                          categories: [],
                          brands: [],
                          priceRange: { min: 0, max: 200000 }
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Clear All Filters
                    </button>
                  )}
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
                      categories: [],
                      brands: [],
                      priceRange: { min: 0, max: 200000 }
                    });
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Category Access */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Looking for something specific? Browse robots by category for a more focused experience.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  categories: [category.id]
                }))}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className="text-2xl mb-2">
                  {category.id === 'humanoid' ? '🤖' : 
                   category.id === 'quadruped' ? '🐕' :
                   category.id === 'accessory' ? '🔧' : '⚙️'}
                </div>
                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function BrowseAllPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading robots...</p>
          </div>
        </div>
      </Layout>
    }>
      <BrowseContent />
    </Suspense>
  );
}