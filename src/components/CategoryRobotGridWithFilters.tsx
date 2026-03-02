'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Robot } from '@/types/robot';

interface CategoryRobotGridWithFiltersProps {
  robots: Robot[];
  title: string;
  browseHref: string;
}

export default function CategoryRobotGridWithFilters({
  robots,
  title,
  browseHref,
}: CategoryRobotGridWithFiltersProps) {
  const [onlyCommercial, setOnlyCommercial] = useState(false);
  const [onlyWithOrderLink, setOnlyWithOrderLink] = useState(false);

  const filtered = useMemo(() => {
    return robots.filter((r) => {
      if (onlyCommercial && r.availability?.status !== 'commercial') return false;
      if (onlyWithOrderLink && !r.availability?.orderLink) return false;
      return true;
    });
  }, [robots, onlyCommercial, onlyWithOrderLink]);

  return (
    <section>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {title} ({filtered.length}{filtered.length !== robots.length ? ` / ${robots.length}` : ''})
          </h2>
          <div className="text-sm text-gray-500 mt-1">
            Filters are best-effort and depend on availability metadata + sources.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={browseHref} className="text-blue-600 hover:text-blue-700 font-medium">
            Advanced Filters →
          </Link>
        </div>
      </div>

      <div className="mb-6 bg-gray-50 rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={onlyCommercial}
              onChange={(e) => setOnlyCommercial(e.target.checked)}
            />
            Commercial only
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={onlyWithOrderLink}
              onChange={(e) => setOnlyWithOrderLink(e.target.checked)}
            />
            Has order link
          </label>
        </div>

        {(onlyCommercial || onlyWithOrderLink) && (
          <button
            onClick={() => {
              setOnlyCommercial(false);
              setOnlyWithOrderLink(false);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium self-start md:self-auto"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((robot) => (
          <ProductCard key={robot.id} robot={robot} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 text-center text-gray-600">
          No robots match the selected filters yet.
        </div>
      )}
    </section>
  );
}
