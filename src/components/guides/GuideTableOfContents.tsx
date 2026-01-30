'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface GuideTableOfContentsProps {
  headings?: TocItem[];
  title?: string;
}

export default function GuideTableOfContents({
  headings,
  title = 'Table of Contents',
}: GuideTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>(headings || []);

  // Auto-generate TOC from page headings if not provided
  useEffect(() => {
    if (headings && headings.length > 0) {
      setTocItems(headings);
      return;
    }

    // Find all H2 and H3 headings in the document
    const articleHeadings = document.querySelectorAll('article h2, article h3');
    const items: TocItem[] = Array.from(articleHeadings).map((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';

      // Ensure heading has an ID for anchor links
      if (!heading.id && id) {
        heading.id = id;
      }

      return {
        id: id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      };
    });

    setTocItems(items);
  }, [headings]);

  // Scroll spy: highlight active section
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setIsMobileOpen(false);
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-toc"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {title}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile TOC Dropdown */}
        {isMobileOpen && (
          <div
            id="mobile-toc"
            className="mt-2 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          >
            <nav aria-label={title}>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className={`w-full text-left text-sm transition-colors ${
                        activeId === item.id
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sticky TOC */}
      <div className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <nav
            aria-label={title}
            className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4">
              {title}
            </h2>
            <ul className="space-y-2.5">
              {tocItems.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full text-left text-sm transition-all duration-200 ${
                      activeId === item.id
                        ? 'text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-600 dark:border-blue-400 pl-3 -ml-3'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 pl-0'
                    }`}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
