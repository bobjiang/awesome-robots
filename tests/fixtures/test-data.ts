/**
 * Static test data for E2E tests
 * Contains sample robots, search queries, filter options, and form data
 */

/**
 * Sample robots for testing (10 representative robots out of 105)
 * Selected to cover different categories, brands, and price ranges
 */
export const SAMPLE_ROBOTS = {
  // High-end humanoids
  UNITREE_G1: {
    name: 'Unitree G1',
    brand: 'Unitree',
    category: 'humanoid',
    priceRange: 'high',
    slug: 'unitree-g1',
  },
  BOSTON_DYNAMICS_ATLAS: {
    name: 'Boston Dynamics Atlas',
    brand: 'Boston Dynamics',
    category: 'humanoid',
    priceRange: 'request_quote',
    slug: 'boston-dynamics-atlas',
  },

  // Mid-range humanoids
  UBTECK_WALKER_X: {
    name: 'UBTech Walker X',
    brand: 'UBTech',
    category: 'humanoid',
    priceRange: 'mid',
    slug: 'ubtech-walker-x',
  },

  // Budget humanoids
  UNITREE_H1: {
    name: 'Unitree H1',
    brand: 'Unitree',
    category: 'humanoid',
    priceRange: 'mid',
    slug: 'unitree-h1',
  },

  // Quadrupeds - various prices
  UNITREE_GO2: {
    name: 'Unitree Go2',
    brand: 'Unitree',
    category: 'quadruped',
    priceRange: 'budget',
    slug: 'unitree-go2',
  },
  BOSTON_DYNAMICS_SPOT: {
    name: 'Boston Dynamics Spot',
    brand: 'Boston Dynamics',
    category: 'quadruped',
    priceRange: 'high',
    slug: 'boston-dynamics-spot',
  },
  DEEP_ROBOTICS_X30: {
    name: 'Deep Robotics X30',
    brand: 'Deep Robotics',
    category: 'quadruped',
    priceRange: 'mid',
    slug: 'deep-robotics-x30',
  },

  // Other categories
  ANYBOTICS_ANYMAL: {
    name: 'ANYbotics ANYmal',
    brand: 'ANYbotics',
    category: 'quadruped',
    priceRange: 'high',
    slug: 'anybotics-anymal',
  },

  // Accessories
  DEXTEROUS_HAND: {
    name: 'Dexterous Hand',
    brand: 'Various',
    category: 'accessory',
    priceRange: 'mid',
    slug: 'dexterous-hand',
  },

  // Request quote
  TESLA_OPTIMUS: {
    name: 'Tesla Optimus',
    brand: 'Tesla',
    category: 'humanoid',
    priceRange: 'request_quote',
    slug: 'tesla-optimus',
  },
} as const;

/**
 * Search queries for testing search functionality
 */
export const SEARCH_QUERIES = {
  // Exact robot names
  EXACT_NAME: 'Unitree G1',
  EXACT_NAME_LOWERCASE: 'unitree g1',
  PARTIAL_NAME: 'Unitree',

  // Brand searches
  BRAND_UNITREE: 'Unitree',
  BRAND_BOSTON_DYNAMICS: 'Boston Dynamics',
  BRAND_UBTECH: 'UBTech',

  // Feature searches
  FEATURE_WALKING: 'walking',
  FEATURE_CLIMBING: 'climbing',
  FEATURE_MANIPULATION: 'manipulation',
  FEATURE_AI: 'AI',
  FEATURE_ROS: 'ROS',

  // Category searches
  CATEGORY_HUMANOID: 'humanoid',
  CATEGORY_QUADRUPED: 'quadruped',

  // No results
  NO_RESULTS: 'XYZ123NotARobot',
  EMPTY_QUERY: '',
} as const;

/**
 * Filter options for testing filtering functionality
 */
export const FILTER_OPTIONS = {
  CATEGORIES: [
    { name: 'Humanoid', value: 'humanoid' },
    { name: 'Quadruped', value: 'quadruped' },
    { name: 'Accessory', value: 'accessory' },
    { name: 'Other', value: 'other' },
  ],

  BRANDS: [
    { name: 'Unitree', value: 'unitree' },
    { name: 'Boston Dynamics', value: 'boston-dynamics' },
    { name: 'UBTech', value: 'ubtech' },
    { name: 'Deep Robotics', value: 'deep-robotics' },
    { name: 'ANYbotics', value: 'anybotics' },
  ],

  PRICE_RANGES: [
    { min: 0, max: 10000, label: 'Under $10k' },
    { min: 10000, max: 50000, label: '$10k - $50k' },
    { min: 50000, max: 100000, label: '$50k - $100k' },
    { min: 100000, max: null, label: 'Over $100k' },
  ],
} as const;

/**
 * Sort options for testing sorting functionality
 */
export const SORT_OPTIONS = {
  NAME_ASC: 'Name (A-Z)',
  NAME_DESC: 'Name (Z-A)',
  PRICE_LOW: 'Price (Low to High)',
  PRICE_HIGH: 'Price (High to Low)',
  BRAND: 'Brand',
  CATEGORY: 'Category',
} as const;

/**
 * Form data for testing quote form
 */
export const QUOTE_FORM_DATA = {
  VALID: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    organization: 'Test Organization',
    phone: '+1-555-0123',
    quantity: '1',
    message: 'I am interested in purchasing this robot for research purposes.',
  },

  INVALID_EMAIL: {
    name: 'John Doe',
    email: 'invalid-email',
    organization: 'Test Organization',
    phone: '+1-555-0123',
    quantity: '1',
    message: 'Test message',
  },

  MISSING_REQUIRED: {
    name: '',
    email: '',
    organization: 'Test Organization',
    phone: '+1-555-0123',
    quantity: '1',
    message: 'Test message',
  },

  INVALID_PHONE: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    organization: 'Test Organization',
    phone: 'invalid-phone',
    quantity: '1',
    message: 'Test message',
  },
} as const;

/**
 * Page paths for navigation testing
 */
export const PAGE_PATHS = {
  HOME: '/',
  BROWSE: '/browse',
  BRANDS: '/brands',
  BLOG: '/blog',
  FAQ: '/faq',
  COMPARE: '/compare',

  // Category pages
  CATEGORY_HUMANOID: '/categories/humanoid',
  CATEGORY_QUADRUPED: '/categories/quadruped',
  CATEGORY_ACCESSORY: '/categories/accessory',

  // Brand pages (sample 5)
  BRAND_UNITREE: '/brands/unitree',
  BRAND_BOSTON_DYNAMICS: '/brands/boston-dynamics',
  BRAND_UBTECH: '/brands/ubtech',
  BRAND_DEEP_ROBOTICS: '/brands/deep-robotics',
  BRAND_ANYBOTICS: '/brands/anybotics',

  // Robot detail pages (sample 5)
  ROBOT_UNITREE_G1: '/robots/unitree-g1',
  ROBOT_BOSTON_DYNAMICS_SPOT: '/robots/boston-dynamics-spot',
  ROBOT_UNITREE_GO2: '/robots/unitree-go2',
  ROBOT_UBTECH_WALKER_X: '/robots/ubtech-walker-x',
  ROBOT_TESLA_OPTIMUS: '/robots/tesla-optimus',

  // Blog pages
  BLOG_POST_SAMPLE: '/blog/sample-post',
  BLOG_CATEGORY_NEWS: '/blog/category/news',
} as const;

/**
 * Expected page indicators for navigation verification
 */
export const PAGE_INDICATORS = {
  HOME: 'Discover AI-Powered Robots',
  BROWSE: 'Browse All Robots',
  BRANDS: 'Robot Brands',
  BLOG: 'Robot Blog',
  FAQ: 'Frequently Asked Questions',
  COMPARE: 'Compare Robots',

  CATEGORY_HUMANOID: 'Humanoid Robots',
  CATEGORY_QUADRUPED: 'Quadruped Robots',

  ROBOT_DETAIL: 'Request Quote',
} as const;

/**
 * Viewport presets for responsive testing
 */
export const VIEWPORT_PRESETS = {
  DESKTOP: { width: 1280, height: 720 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 667 },
  MOBILE_LANDSCAPE: { width: 667, height: 375 },
} as const;

/**
 * Wait times (in seconds) for different operations
 */
export const WAIT_TIMES = {
  FILTER: 1,
  SEARCH: 1,
  SORT: 1,
  NAVIGATION: 2,
  MODAL_OPEN: 0.5,
  MODAL_CLOSE: 0.5,
  LAYOUT_STABILIZE: 0.5,
} as const;

/**
 * Test user data
 */
export const TEST_USERS = {
  RESEARCHER: {
    name: 'Dr. Jane Smith',
    email: 'jane.smith@university.edu',
    organization: 'University Research Lab',
    phone: '+1-555-0100',
  },
  COMPANY: {
    name: 'John Manager',
    email: 'john.manager@company.com',
    organization: 'Tech Company Inc',
    phone: '+1-555-0200',
  },
  INDIVIDUAL: {
    name: 'Bob Hobbyist',
    email: 'bob.hobbyist@gmail.com',
    organization: 'Personal',
    phone: '+1-555-0300',
  },
} as const;

/**
 * Error messages for validation testing
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email',
  INVALID_PHONE: 'Please enter a valid phone number',
  NO_RESULTS: 'No robots found',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  QUOTE_SUBMITTED: 'Thank you! Your quote request has been submitted',
  FORM_SUBMITTED: 'Form submitted successfully',
} as const;
