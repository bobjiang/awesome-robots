import React from 'react';
import Link from 'next/link';

export interface QuoteRequestCTAProps {
  variant?: 'inline' | 'banner' | 'sidebar';
  robotId?: string;
  robotName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export default function QuoteRequestCTA({
  variant = 'inline',
  robotId,
  robotName,
  utmSource = 'guide',
  utmMedium = 'cta',
  utmCampaign = 'quote-request',
}: QuoteRequestCTAProps) {
  // Build quote request URL with UTM parameters
  const buildQuoteUrl = (): string => {
    const params = new URLSearchParams({
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    });

    if (robotId) {
      params.append('robot', robotId);
    }

    return `/quote?${params.toString()}`;
  };

  const quoteUrl = buildQuoteUrl();

  // Track CTA clicks with Google Analytics
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: variant,
        robot_id: robotId || 'general',
        robot_name: robotName || 'not_specified',
      });
    }
  };

  // Inline variant - compact CTA within content
  if (variant === 'inline') {
    return (
      <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {robotName ? `Interested in the ${robotName}?` : 'Ready to get started?'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Request a quote and compare pricing from multiple suppliers
            </p>
          </div>
          <Link
            href={quoteUrl}
            onClick={handleClick}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            Request Quote
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Banner variant - prominent full-width CTA
  if (variant === 'banner') {
    return (
      <div className="my-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {robotName ? `Ready to purchase ${robotName}?` : 'Find the Perfect Robot for Your Needs'}
          </h3>
          <p className="text-blue-100 text-sm md:text-base mb-6">
            Get custom quotes from verified suppliers. Compare prices, specs, and delivery times in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={quoteUrl}
              onClick={handleClick}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Request Free Quote
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Browse All Robots
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar variant - compact vertical CTA
  if (variant === 'sidebar') {
    return (
      <div className="sticky top-24 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            {robotName ? `Get ${robotName} Quote` : 'Request a Quote'}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Compare pricing from verified suppliers
          </p>
          <Link
            href={quoteUrl}
            onClick={handleClick}
            className="block w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
          >
            Get Quote
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Free • No obligation • Fast response
          </p>
        </div>
      </div>
    );
  }

  return null;
}
