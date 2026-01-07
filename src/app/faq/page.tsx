import Layout from '@/components/Layout';
import Link from 'next/link';
import Script from 'next/script';
import { Metadata } from 'next';
import { generateFAQPageSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Awesome Robots',
  description: 'Get answers to common questions about AI robots, including types, pricing, programming requirements, and choosing the right robot for your needs.',
  keywords: 'robot FAQ, AI robot questions, robot buying guide, robot types, robot programming',
};

const faqData = [
  {
    question: "What types of robots are available in the catalog?",
    answer: "Our catalog includes humanoid robots, quadruped robots, accessories, and other specialized robotic systems. Popular categories include educational robots for learning and research, professional platforms for development and testing, and industrial automation solutions. Each category serves different purposes from basic education to advanced research and commercial applications."
  },
  {
    question: "How do I choose between different robot brands?",
    answer: "Consider your specific use case, budget constraints, technical requirements, and support needs. Educational users often prefer cost-effective options like Unitree Go2, while industrial applications may benefit from premium brands like Boston Dynamics or Deep Robotics. Research institutions typically need platforms with strong SDK support and active communities, while commercial users prioritize reliability and professional support."
  },
  {
    question: "What is the typical price range for AI robots?",
    answer: "Robot prices vary significantly based on capabilities and target market. Entry-level quadrupeds start around $1,600 (Unitree Go2), professional models range from $15,000-$50,000, and advanced humanoids can cost $150,000 or more. Accessories and sensors add $500-$5,000 depending on specifications. Always contact manufacturers directly for current pricing and volume discounts."
  },
  {
    question: "Do these robots require programming knowledge?",
    answer: "Most modern robots offer multiple interaction levels to accommodate different skill levels. Basic operation often requires minimal programming, while advanced features may need Python, ROS (Robot Operating System), or manufacturer-specific SDKs. Many include graphical programming interfaces for beginners, drag-and-drop environments for intermediate users, and full API access for advanced developers."
  },
  {
    question: "What's the difference between humanoid and quadruped robots?",
    answer: "Humanoid robots have human-like bipedal structure, making them ideal for tasks in human environments but more complex to control. Quadruped robots offer superior stability and mobility over varied terrain, making them perfect for outdoor applications, inspection tasks, and situations requiring dynamic movement. Choice depends on your specific application requirements."
  },
  {
    question: "How long do robot batteries typically last?",
    answer: "Battery life varies greatly based on robot size, activity level, and usage patterns. Small quadrupeds like Unitree Go2 provide 2-4 hours of operation, while larger robots may offer 1-2 hours of continuous use. Most professional robots support hot-swappable batteries or charging stations for extended operation. Consider your use case duration when selecting a platform."
  },
  {
    question: "What support and maintenance do robots require?",
    answer: "Modern robots require regular software updates, occasional hardware maintenance, and proper storage conditions. Professional brands offer technical support, training programs, and replacement parts. Community-supported platforms rely on forums and documentation. Budget for ongoing costs including software licenses, replacement components, and potential repair services."
  },
  {
    question: "Can robots be customized for specific applications?",
    answer: "Yes, most professional robots support customization through additional sensors, custom software development, and hardware modifications. Manufacturers often provide SDK access, mounting points for accessories, and integration services. Educational platforms typically offer more open architectures, while industrial robots may require certified modifications for safety compliance."
  }
];

export default function FAQPage() {
  // Generate FAQ schema from centralized structured-data library (T3 pattern)
  const faqSchema = generateFAQPageSchema(faqData);

  return (
    <Layout>
      {/* Structured Data */}
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get answers to common questions about AI robots, from basic information to technical details about choosing and using robotic platforms.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {faq.question}
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                {faq.answer.split('. ').map((sentence, sentenceIndex) => (
                  <p key={sentenceIndex}>
                    {sentence}{sentenceIndex < faq.answer.split('. ').length - 1 ? '.' : ''}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Browse our comprehensive robot catalog or read our detailed buying guides for more specific information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse All Robots
            </Link>
            <Link
              href="/blog/category/buying-guides"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Read Buying Guides
            </Link>
          </div>
        </div>

        {/* Related Topics */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Related Topics
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/blog/category/buying-guides"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">Buying Guides</h4>
              <p className="text-sm text-gray-600">Comprehensive guides for choosing robots</p>
            </Link>
            <Link
              href="/categories"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">Robot Categories</h4>
              <p className="text-sm text-gray-600">Explore different types of robots</p>
            </Link>
            <Link
              href="/brands"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">Popular Brands</h4>
              <p className="text-sm text-gray-600">Compare robot manufacturers</p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}