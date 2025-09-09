'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                🤖 Awesome Robots
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/browse" className="text-gray-700 hover:text-blue-600 transition-colors">
                Browse All
              </Link>
              <Link href="/brands" className="text-gray-700 hover:text-blue-600 transition-colors">
                Brands
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  href="/browse" 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse All
                </Link>
                <Link 
                  href="/brands" 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Brands
                </Link>
                <Link 
                  href="/blog" 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Awesome Robots</h3>
              <p className="text-gray-400">
                Your comprehensive catalog for AI-powered robots, from humanoids to quadrupeds.
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/browse?category=humanoid" className="hover:text-white">Humanoid Robots</Link></li>
                <li><Link href="/browse?category=quadruped" className="hover:text-white">Quadruped Robots</Link></li>
                <li><Link href="/browse?category=accessory" className="hover:text-white">Accessories</Link></li>
                <li><Link href="/browse?category=other" className="hover:text-white">Other Robots</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-4">Brands</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/browse?brand=Unitree" className="hover:text-white">Unitree</Link></li>
                <li><Link href="/browse?brand=Deep Robotics" className="hover:text-white">Deep Robotics</Link></li>
                <li><Link href="/browse?brand=UBTech" className="hover:text-white">UBTech</Link></li>
                <li><Link href="/browse?brand=Boston Dynamics" className="hover:text-white">Boston Dynamics</Link></li>
                <li><Link href="/browse?brand=ANYbotics" className="hover:text-white">ANYbotics</Link></li>
                <li><Link href="/browse?brand=Ghost Robotics" className="hover:text-white">Ghost Robotics</Link></li>
                <li><Link href="/browse?brand=UniX AI" className="hover:text-white">UniX AI</Link></li>
                <li><Link href="/browse?brand=Rainbow Robotics" className="hover:text-white">Rainbow Robotics</Link></li>
                <li><Link href="/browse?brand=EngineAI" className="hover:text-white">EngineAI</Link></li>
                <li><Link href="/browse?brand=Galaxea AI" className="hover:text-white">Galaxea AI</Link></li>
                <li><Link href="/browse?brand=Booster Robotics" className="hover:text-white">Booster Robotics</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/blog/category/buying-guides" className="hover:text-white">Buying Guides</Link></li>
                <li><Link href="/blog/category/digest" className="hover:text-white">Weekly Digest</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Awesome Robots. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}