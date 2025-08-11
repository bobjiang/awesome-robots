export interface Robot {
  id: string;
  name: string;
  brand: string;
  category: 'humanoid' | 'quadruped' | 'accessory' | 'other';
  price: {
    starting: number;
    currency: string;
    models: Array<{
      name: string;
      price: number | 'request';
    }>;
  };
  specifications: {
    dimensions: string;
    weight: string;
    battery: string;
    sensors: string[];
    dof?: number;
    maxSpeed?: string;
    payload?: string;
  };
  features: string[];
  images: string[];
  videos?: string[];
  documentation?: string[];
  officialUrl: string;
  description: string;
}

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