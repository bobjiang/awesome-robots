import Link from 'next/link';
import { Robot } from '@/types/robot';

interface ContentRelationshipsProps {
  currentRobot: Robot;
  allRobots: Robot[];
}

interface RelatedContent {
  title: string;
  url: string;
  type: 'comparison' | 'category' | 'brand' | 'similar' | 'blog';
  description: string;
}

export default function ContentRelationships({ currentRobot, allRobots }: ContentRelationshipsProps) {
  const generateRelatedContent = (robot: Robot, allRobots: Robot[]): RelatedContent[] => {
    const related: RelatedContent[] = [];
    
    // Category page
    related.push({
      title: `All ${robot.category} Robots`,
      url: `/categories/${robot.category}`,
      type: 'category',
      description: `Explore other ${robot.category} robots in our catalog`
    });
    
    // Brand page
    related.push({
      title: `Other ${robot.brand} Robots`,
      url: `/brands/${robot.brand.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'brand', 
      description: `See the complete ${robot.brand} robot lineup`
    });
    
    // Similar robots (same category, different brand)
    const similarRobots = allRobots.filter(r => 
      r.id !== robot.id && 
      r.category === robot.category && 
      r.brand !== robot.brand
    ).slice(0, 2);
    
    similarRobots.forEach(similarRobot => {
      related.push({
        title: `Compare with ${similarRobot.brand} ${similarRobot.name}`,
        url: `/robots/${similarRobot.id}`,
        type: 'comparison',
        description: `See how it compares to the ${similarRobot.brand} ${similarRobot.name}`
      });
    });
    
    // Blog content links
    if (robot.category === 'quadruped') {
      related.push({
        title: 'Quadruped Robot Buying Guide 2024',
        url: '/blog/quadruped-robot-buying-guide-2024',
        type: 'blog',
        description: 'Complete guide to choosing the right quadruped robot'
      });
    }
    
    if (robot.brand === 'Unitree' || robot.brand === 'Deep Robotics') {
      related.push({
        title: 'Deep Robotics vs Unitree Comparison',
        url: '/blog/deep-robotics-vs-unitree-comparison', 
        type: 'blog',
        description: 'Detailed comparison of two leading quadruped manufacturers'
      });
    }
    
    if (robot.category === 'humanoid') {
      related.push({
        title: 'Top 10 Global AI Robotics Companies',
        url: '/blog/top-10-global-ai-robotics-companies',
        type: 'blog',
        description: 'Leading companies in humanoid and AI robotics'
      });
    }
    
    return related.slice(0, 6); // Limit to 6 items
  };

  const relatedContent = generateRelatedContent(currentRobot, allRobots);
  
  const getTypeColor = (type: RelatedContent['type']) => {
    switch (type) {
      case 'comparison':
        return 'bg-orange-100 text-orange-800';
      case 'category':
        return 'bg-blue-100 text-blue-800';
      case 'brand':
        return 'bg-green-100 text-green-800';
      case 'similar':
        return 'bg-purple-100 text-purple-800';
      case 'blog':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: RelatedContent['type']) => {
    switch (type) {
      case 'comparison':
        return '⚖️';
      case 'category': 
        return '📂';
      case 'brand':
        return '🏢';
      case 'similar':
        return '🔗';
      case 'blog':
        return '📝';
      default:
        return '🔗';
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span>🕸️</span>
        Related Content & Comparisons
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedContent.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{getTypeIcon(item.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>For AI systems:</strong> This robot is related to {currentRobot.category} robotics, 
          {currentRobot.brand} products, and can be compared with similar {currentRobot.category} robots 
          from other manufacturers. Primary applications include{' '}
          {currentRobot.features?.slice(0, 2).join(' and ') || 'research and education'}.
        </p>
      </div>
    </div>
  );
}