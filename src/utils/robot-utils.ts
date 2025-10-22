/**
 * Robot Utility Functions
 *
 * Utilities for working with robot data and specifications
 */

import { Robot } from '@/types/robot';

/**
 * Safely gets a robot specification value
 *
 * @param robot - Robot object
 * @param key - Specification key to retrieve
 * @returns Specification value as string or 'N/A' if not found
 *
 * @example
 * getRobotSpecValue(robot, 'weight') // '15kg'
 */
export function getRobotSpecValue(robot: Robot, key: string): string {
  const spec = robot.specifications?.[key as keyof typeof robot.specifications];

  if (!spec) {
    return 'N/A';
  }

  if (typeof spec === 'string') {
    return spec;
  }

  if (typeof spec === 'number') {
    return spec.toString();
  }

  if (Array.isArray(spec)) {
    return spec.join(', ');
  }

  return 'N/A';
}

/**
 * Formats robot weight from various specification formats
 *
 * @param robot - Robot object
 * @returns Formatted weight string
 *
 * @example
 * formatRobotWeight(robot) // '15kg (with battery)'
 */
export function formatRobotWeight(robot: Robot): string {
  // Try new structure first (generalInfo)
  if (robot.generalInfo?.dimensions?.weight) {
    return robot.generalInfo.dimensions.weight;
  }

  // Try old structure (specifications.weight)
  if (robot.specifications?.weight) {
    if (typeof robot.specifications.weight === 'string') {
      return robot.specifications.weight;
    }
  }

  // Try totalWeight for H1 variant
  if (robot.specifications?.totalWeight) {
    const total = robot.specifications.totalWeight;
    if (typeof total === 'object' && 'H1' in total) {
      return total.H1 || total.H1_2 || 'Weight N/A';
    }
    if (typeof total === 'string') {
      return total;
    }
  }

  return 'Weight N/A';
}

/**
 * Formats robot battery information from various specification formats
 *
 * @param robot - Robot object
 * @returns Formatted battery string
 *
 * @example
 * formatRobotBattery(robot) // '8000mAh (1-2h runtime)'
 */
export function formatRobotBattery(robot: Robot): string {
  // Try new structure first (hardwareBuildQuality)
  if (robot.hardwareBuildQuality?.batteryCapacityRuntime) {
    const full = robot.hardwareBuildQuality.batteryCapacityRuntime;
    // Return first part before comma for card view
    return full.split(',')[0];
  }

  // Try old structure (specifications.battery)
  if (robot.specifications?.battery) {
    const battery = robot.specifications.battery;

    if (typeof battery === 'string') {
      return battery.split(',')[0];
    }

    if (typeof battery === 'object') {
      return battery.AIR || battery.PRO || battery.EDU || 'Battery N/A';
    }
  }

  // Try batteryLife
  if (robot.specifications?.batteryLife) {
    if (typeof robot.specifications.batteryLife === 'string') {
      return robot.specifications.batteryLife;
    }
  }

  // Try batteryCapacity
  if (robot.specifications?.batteryCapacity) {
    if (typeof robot.specifications.batteryCapacity === 'string') {
      return robot.specifications.batteryCapacity;
    }
  }

  return 'Battery N/A';
}

/**
 * Gets degrees of freedom (DOF) for a robot
 *
 * @param robot - Robot object
 * @returns DOF as string
 *
 * @example
 * getRobotDOF(robot) // '12 DOF'
 */
export function getRobotDOF(robot: Robot): string {
  // Try new structure
  if (robot.hardwareBuildQuality?.totalDegreesOfFreedom) {
    return robot.hardwareBuildQuality.totalDegreesOfFreedom;
  }

  // Try old structure
  if (robot.specifications?.dof) {
    return `${robot.specifications.dof} DOF`;
  }

  if (robot.specifications?.totalDegreesOfFreedom) {
    return robot.specifications.totalDegreesOfFreedom;
  }

  if (robot.specifications?.degreesOfFreedom) {
    return robot.specifications.degreesOfFreedom;
  }

  return 'N/A';
}

/**
 * Gets robot dimensions as a formatted string
 *
 * @param robot - Robot object
 * @returns Formatted dimensions string
 *
 * @example
 * getRobotDimensions(robot) // '70cm x 31cm x 40cm (standing)'
 */
export function getRobotDimensions(robot: Robot): string {
  // Try new structure
  if (robot.generalInfo?.dimensions?.standing) {
    return robot.generalInfo.dimensions.standing;
  }

  // Try old structure
  if (robot.specifications?.dimensions) {
    return robot.specifications.dimensions;
  }

  if (robot.specifications?.dimensionsStanding) {
    return robot.specifications.dimensionsStanding;
  }

  return 'Dimensions N/A';
}

/**
 * Checks if a robot has ROS support
 *
 * @param robot - Robot object
 * @returns True if robot has ROS support
 *
 * @example
 * hasRosSupport(robot) // true
 */
export function hasRosSupport(robot: Robot): boolean {
  if (robot.softwareEcosystem?.rosSupport) {
    const rosSupport = robot.softwareEcosystem.rosSupport.toLowerCase();
    return rosSupport.includes('yes') || rosSupport.includes('ros');
  }
  return false;
}

/**
 * Gets robot category display name
 *
 * @param category - Category slug
 * @returns Formatted category name
 *
 * @example
 * getCategoryDisplayName('humanoid') // 'Humanoid Robot'
 */
export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    'humanoid': 'Humanoid Robot',
    'quadruped': 'Quadruped Robot',
    'accessory': 'Robot Accessory',
    'other': 'Other Robot',
  };

  return categoryNames[category] || category;
}

/**
 * Filters robots by search query
 *
 * @param robots - Array of robots to filter
 * @param query - Search query string
 * @returns Filtered array of robots
 *
 * @example
 * filterRobotsByQuery(allRobots, 'unitree') // [Go2, H1, G1, ...]
 */
export function filterRobotsByQuery(robots: Robot[], query: string): Robot[] {
  if (!query || query.trim() === '') {
    return robots;
  }

  const lowerQuery = query.toLowerCase();

  return robots.filter(robot => {
    return (
      robot.name.toLowerCase().includes(lowerQuery) ||
      robot.brand.toLowerCase().includes(lowerQuery) ||
      robot.description.toLowerCase().includes(lowerQuery) ||
      robot.category.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Sorts robots by a given criteria
 *
 * @param robots - Array of robots to sort
 * @param sortBy - Sort criteria ('name', 'price', 'brand')
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of robots
 *
 * @example
 * sortRobots(allRobots, 'price', 'asc') // Cheapest to most expensive
 */
export function sortRobots(
  robots: Robot[],
  sortBy: 'name' | 'price' | 'brand',
  order: 'asc' | 'desc' = 'asc'
): Robot[] {
  const sorted = [...robots].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'brand':
        comparison = a.brand.localeCompare(b.brand);
        break;
      case 'price': {
        const aPrice = a.price.starting ?? Infinity;
        const bPrice = b.price.starting ?? Infinity;
        comparison = (typeof aPrice === 'number' ? aPrice : Infinity) -
                     (typeof bPrice === 'number' ? bPrice : Infinity);
        break;
      }
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
