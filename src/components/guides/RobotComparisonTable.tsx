'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export interface RobotComparisonData {
  id: string;
  name: string;
  brand: string;
  price: number | string;
  dof?: number;
  payload?: number;
  battery?: number | string;
  height?: number | string;
  weight?: number | string;
  sensors?: string;
  os?: string;
  [key: string]: any;
}

export interface RobotComparisonTableProps {
  robots: RobotComparisonData[];
  columns: string[];
  sortable?: boolean;
  highlightBestValue?: boolean;
  caption?: string;
}

type SortDirection = 'asc' | 'desc' | null;

const columnLabels: Record<string, string> = {
  name: 'Model',
  brand: 'Brand',
  price: 'Price',
  dof: 'DOF',
  payload: 'Payload (kg)',
  battery: 'Battery Life',
  height: 'Height (cm)',
  weight: 'Weight (kg)',
  sensors: 'Sensors',
  os: 'Operating System',
};

const formatValue = (key: string, value: any): string => {
  if (value === null || value === undefined) return 'N/A';

  if (key === 'price') {
    if (typeof value === 'string') return value;
    return `$${value.toLocaleString()}`;
  }

  if (key === 'payload' || key === 'weight') {
    return `${value} kg`;
  }

  if (key === 'height') {
    return `${value} cm`;
  }

  if (key === 'battery') {
    if (typeof value === 'string') return value;
    return `${value} hrs`;
  }

  return String(value);
};

const calculateBestValue = (robots: RobotComparisonData[]): string | null => {
  // Simple heuristic: best value = lowest price with highest combined specs
  const scored = robots.map(robot => {
    const price = typeof robot.price === 'number' ? robot.price : 999999;
    const dof = robot.dof || 0;
    const payload = robot.payload || 0;
    const battery = typeof robot.battery === 'number' ? robot.battery : 0;

    // Higher score = better value (more features per dollar)
    const featureScore = dof + (payload * 2) + (battery * 5);
    const valueScore = price > 0 ? featureScore / price : 0;

    return { id: robot.id, valueScore };
  });

  const best = scored.reduce((prev, curr) =>
    curr.valueScore > prev.valueScore ? curr : prev
  );

  return best.valueScore > 0 ? best.id : null;
};

export default function RobotComparisonTable({
  robots,
  columns,
  sortable = true,
  highlightBestValue = false,
  caption,
}: RobotComparisonTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const bestValueId = useMemo(() => {
    return highlightBestValue ? calculateBestValue(robots) : null;
  }, [robots, highlightBestValue]);

  const sortedRobots = useMemo(() => {
    if (!sortColumn || !sortDirection) return robots;

    return [...robots].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      // Handle null/undefined
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Numeric comparison
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });
  }, [robots, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (!sortable) return;

    if (sortColumn === column) {
      // Cycle: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return '⇅';
    if (sortDirection === 'asc') return '↑';
    if (sortDirection === 'desc') return '↓';
    return '⇅';
  };

  return (
    <div className="overflow-x-auto my-8 rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {caption && (
          <caption className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
            {caption}
          </caption>
        )}
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                  sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none' : ''
                }`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center gap-2">
                  {columnLabels[column] || column}
                  {sortable && <span className="text-gray-400">{getSortIcon(column)}</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedRobots.map((robot) => {
            const isBestValue = highlightBestValue && robot.id === bestValueId;

            return (
              <tr
                key={robot.id}
                className={`${
                  isBestValue
                    ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                } transition-colors`}
              >
                {columns.map((column) => {
                  const value = robot[column];
                  const isNameColumn = column === 'name';

                  return (
                    <td
                      key={`${robot.id}-${column}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {isNameColumn ? (
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/robots/${robot.id}`}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {robot.brand} {robot.name}
                          </Link>
                          {isBestValue && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Best Value
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={column === 'price' ? 'font-semibold' : ''}>
                          {formatValue(column, value)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {sortable && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          Click column headers to sort. Click again to reverse order.
        </div>
      )}
    </div>
  );
}
