import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse All Robots - Compare 115+ AI Humanoid & Quadruped Robots | Awesome Robots',
  description: 'Browse and compare 115+ AI-powered robots including humanoids and quadrupeds. Filter by category, brand, and price. Find the perfect robot for research, education, or industrial applications.',
  keywords: 'browse robots, compare robots, humanoid robots catalog, quadruped robots list, robot comparison, buy robots, robot prices',
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
