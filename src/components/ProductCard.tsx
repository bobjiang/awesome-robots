'use client';

import Link from 'next/link';
import { Robot } from '@/types/robot';

interface ProductCardProps {
  robot: Robot;
}

export default function ProductCard({ robot }: ProductCardProps) {
  const formatPrice = (price: number | 'request') => {
    if (price === 'request') return 'Request Quote';
    return `$${price.toLocaleString()}`;
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'humanoid':
        return '🤖';
      case 'quadruped':
        return '🐕';
      case 'accessory':
        return '🔧';
      default:
        return '⚙️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'humanoid':
        return 'from-blue-400 to-blue-600';
      case 'quadruped':
        return 'from-green-400 to-green-600';
      case 'accessory':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className={`h-48 bg-gradient-to-br ${getCategoryColor(robot.category)} flex items-center justify-center`}>
        <span className="text-6xl group-hover:scale-110 transition-transform">
          {getCategoryEmoji(robot.category)}
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {robot.name}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase tracking-wide">
            {robot.brand}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {robot.description}
        </p>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Key Specs:</div>
          <div className="text-sm text-gray-700">
            {robot.specifications.weight} • {robot.specifications.battery.split(',')[0]}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-sm text-gray-500">Starting from</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(robot.price.starting)}
            </div>
          </div>
          
          <Link
            href={`/robots/${robot.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}