export type { Robot, RobotCategory, Robots } from '@/lib/robot-schema';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  website: string;
  logo: string;
}

export interface BrandConfig extends Brand {
  imagePatterns: {
    hostname: string;
    pathname: string;
    protocol?: string;
    port?: string;
  }[];
  imageBasePath: string; // Base path for local images
  specificationSchema?: Record<string, unknown>; // Brand-specific spec validation
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  specifications?: {
    sensors?: string[];
    features?: string[];
  };
}

export interface SortOption {
  value: string;
  label: string;
}
