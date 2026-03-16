'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { posts } from '#site/content';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      // Delay focus to ensure the input is rendered
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const publishedPosts = posts.filter((p) => p.published);

  const results =
    query.length >= 2
      ? publishedPosts
          .filter((post) => {
            const q = query.toLowerCase();
            return (
              post.title.toLowerCase().includes(q) ||
              post.excerpt.toLowerCase().includes(q) ||
              post.tags.some((tag: string) => tag.toLowerCase().includes(q))
            );
          })
          .slice(0, 10)
      : [];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative mx-auto mt-20 max-w-xl bg-white rounded-xl shadow-2xl">
        {/* Search input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <svg
            className="h-5 w-5 text-gray-400 mr-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blog posts..."
            className="flex-1 bg-transparent text-lg text-gray-900 placeholder-gray-400 outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="ml-2 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.length > 0 ? (
              <ul>
                {results.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      onClick={onClose}
                      className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {post.excerpt}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            Type at least 2 characters to search
          </div>
        )}
      </div>
    </div>
  );
}
