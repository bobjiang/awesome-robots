import { Robot } from '@/types/robot';
import robots from '@/data/robots.json';
import categories from '@/data/categories.json';
import BrowseClient, { BrowseRobot } from './BrowseClient';

function slimRobot(robot: Robot): BrowseRobot {
  return {
    id: robot.id,
    name: robot.name,
    brand: robot.brand,
    category: robot.category,
    description: robot.description,
    price: {
      starting: robot.price.starting,
      currency: robot.price.currency,
      models: robot.price.models || [],
    },
    features: (robot.features || robot.keyFeatures || []).slice(0, 5),
    images: robot.images?.slice(0, 1) || [],
    availability: robot.availability ? { status: robot.availability.status } : undefined,
    officialUrl: robot.officialUrl,
    specifications: {},
  };
}

export default function BrowseAllPage() {
  const slimRobots = (robots as Robot[]).map(slimRobot);

  return <BrowseClient robots={slimRobots} categories={categories} />;
}
