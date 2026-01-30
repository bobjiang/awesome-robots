import React from 'react';
import Link from 'next/link';

export interface RelatedGuide {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
}

export interface RelatedGuidesWidgetProps {
  guides: RelatedGuide[];
  title?: string;
  columns?: 2 | 3 | 4;
}

export default function RelatedGuidesWidget({
  guides,
  title = 'Related Guides',
  columns = 3,
}: RelatedGuidesWidgetProps) {
  if (!guides || guides.length === 0) {
    return null;
  }

  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <section className="my-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {title}
      </h2>

      <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/blog/${guide.slug}`}
            className="group block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200"
          >
            {/* Category Badge */}
            {guide.category && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                  {guide.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
              {guide.title}
            </h3>

            {/* Excerpt */}
            {guide.excerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {guide.excerpt}
              </p>
            )}

            {/* Read More Arrow */}
            <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              <span>Read Guide</span>
              <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
