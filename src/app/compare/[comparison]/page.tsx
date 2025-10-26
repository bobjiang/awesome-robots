import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { generateBreadcrumbSchema } from '@/lib/structured-data';
import { comparisonData } from '@/data/comparisons';

interface ComparisonPageProps {
  params: Promise<{ comparison: string }>;
}

export async function generateStaticParams() {
  return Object.keys(comparisonData).map((comparison) => ({
    comparison,
  }));
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { comparison } = await params;
  const data = comparisonData[comparison];

  if (!data) {
    return { title: 'Comparison Not Found | Awesome Robots' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.awesomerobots.xyz';
  const comparisonUrl = `${baseUrl}/compare/${comparison}`;

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords.join(', '),
    authors: [{ name: 'Awesome Robots Team' }],
    alternates: {
      canonical: comparisonUrl,
    },
    openGraph: {
      type: 'article',
      url: comparisonUrl,
      title: data.title,
      description: data.description,
      siteName: 'Awesome Robots',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { comparison } = await params;
  const data = comparisonData[comparison];

  if (!data) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.awesomerobots.xyz';
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/compare' },
    { name: data.breadcrumbName, url: `/compare/${comparison}` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, baseUrl);

  return (
    <Layout>
      {/* Structured Data */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {data.h1}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {/* Executive Summary */}
          {data.executiveSummary && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-12 rounded-r-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Summary</h2>
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: data.executiveSummary }} />
            </div>
          )}

          {/* Quick Comparison Table */}
          {data.quickComparisonTable && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Comparison</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {data.quickComparisonTable.headers.map((header, idx) => (
                        <th key={idx} className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.quickComparisonTable.rows.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-6 py-4 text-sm text-gray-700 border-b">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content Sections */}
          {data.sections.map((section, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h2>
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))}

          {/* Verdict/Recommendation */}
          {data.verdict && (
            <div className="bg-green-50 border-l-4 border-green-600 p-8 mb-12 rounded-r-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Expert Verdict & Recommendations</h2>
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: data.verdict }} />
            </div>
          )}

          {/* FAQs */}
          {data.faqs && data.faqs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {data.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Links */}
          {data.relatedLinks && data.relatedLinks.length > 0 && (
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Comparisons & Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.relatedLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url}
                    className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-gray-900 font-medium">{link.text}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
