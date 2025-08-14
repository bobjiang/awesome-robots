'use client';

import dynamic from 'next/dynamic';
import { Robot } from '@/types/robot';

const ProductCard = dynamic(() => import('./ProductCard'), {
  loading: () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

interface LazyProductCardProps {
  robot: Robot;
}

export default function LazyProductCard({ robot }: LazyProductCardProps) {
  return <ProductCard robot={robot} />;
}