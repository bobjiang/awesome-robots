'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Robot } from '@/types/robot';
import { trackRobotView } from '@/lib/gtag';

interface ProductCardProps {
  robot: Robot;
}

export default function ProductCard({ robot }: ProductCardProps) {
  const formatPrice = (price: number | 'request') => {
    if (price === 'request') return 'Request Quote';
    return `$${price.toLocaleString()}`;
  };

  const handleViewDetails = () => {
    trackRobotView(robot.id, robot.name, robot.brand);
  };

  const getRobotImage = (robot: Robot) => {
    // Use the first image from robot.images if available
    if (robot.images && robot.images.length > 0) {
      return robot.images[0];
    }

    // Generate consistent image path based on brand and robot ID
    const brandSlug = robot.brand.toLowerCase().replace(/\s+/g, '-');
    const possiblePaths = [
      `/images/robots/${brandSlug}/${robot.id}.jpg`,
      `/images/robots/${brandSlug}/${robot.id}.png`,
      `/images/robots/${robot.id}.jpg`,
      `/images/robots/${robot.id}.png`,
    ];

    // For now, return the first possible path - in production you might want to check if the file exists
    const imagePath = possiblePaths[0];

    // Fallback to category images if no specific robot image is found
    return imagePath || (
      robot.category === 'humanoid' ? '/images/categories/humanoid.png' :
      robot.category === 'quadruped' ? '/images/categories/quadruped.png' :
      robot.category === 'accessory' ? '/images/categories/accessories.svg' :
      '/images/categories/other.svg'
    );
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
      <div className={`h-48 bg-gradient-to-br ${getCategoryColor(robot.category)} flex items-center justify-center p-4`}>
        <div className="relative w-full h-full group-hover:scale-110 transition-transform">
          <Image
            src={getRobotImage(robot)}
            alt={robot.name}
            fill
            className="object-contain"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
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
            {(() => {
              // Handle weight - check new structure first, then fall back to old
              if (robot.generalInfo?.dimensions?.weight) {
                return robot.generalInfo.dimensions.weight;
              } else if (robot.specifications?.weight && typeof robot.specifications.weight === 'string') {
                return robot.specifications.weight;
              } else if (robot.specifications?.totalWeight) {
                if (typeof robot.specifications.totalWeight === 'string') {
                  return robot.specifications.totalWeight;
                } else if (typeof robot.specifications.totalWeight === 'object') {
                  return robot.specifications.totalWeight.H1 || robot.specifications.totalWeight.H1_2 || 'Weight N/A';
                } else {
                  return 'Weight N/A';
                }
              } else {
                return 'Weight N/A';
              }
            })()} • {
              (() => {
                // Handle battery info - check for extended structure first
                if (robot.hardwareBuildQuality?.batteryCapacityRuntime) {
                  return robot.hardwareBuildQuality.batteryCapacityRuntime.split(',')[0];
                } else if (robot.specifications?.battery && typeof robot.specifications.battery === 'string') {
                  return robot.specifications.battery.split(',')[0];
                } else if (typeof robot.specifications?.battery === 'object' && robot.specifications.battery) {
                  return robot.specifications.battery.AIR || robot.specifications.battery.PRO || robot.specifications.battery.EDU || 'Battery N/A';
                } else if (robot.specifications?.batteryLife) {
                  return typeof robot.specifications.batteryLife === 'string' ? robot.specifications.batteryLife : 'Battery Info Available';
                } else if (robot.specifications?.batteryCapacity) {
                  return typeof robot.specifications.batteryCapacity === 'string' ? robot.specifications.batteryCapacity : 'Battery Available';
                } else {
                  return 'Battery N/A';
                }
              })()
            }
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
            prefetch={true}
            onClick={handleViewDetails}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}