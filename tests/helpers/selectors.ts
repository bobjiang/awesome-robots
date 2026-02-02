/**
 * Centralized selector documentation for E2E tests
 *
 * NOTE: These are NOT CSS selectors. They are documentation of common
 * UI elements and patterns. Actual element refs (@e1, @e2, etc.) come
 * from browser_snapshot() and change based on page structure.
 *
 * Use this file to:
 * 1. Document common element patterns across pages
 * 2. Keep track of element descriptions for browser interactions
 * 3. Maintain consistency in element naming
 */

/**
 * Homepage elements and patterns
 */
export const HOMEPAGE = {
  // Header
  HEADER: {
    LOGO: 'Awesome Robots logo',
    NAV_BROWSE: 'Browse link',
    NAV_BRANDS: 'Brands link',
    NAV_BLOG: 'Blog link',
    NAV_FAQ: 'FAQ link',
    MOBILE_MENU_TOGGLE: 'Menu toggle button',
  },

  // Hero section
  HERO: {
    HEADING: 'Discover AI-Powered Robots',
    CTA_BROWSE: 'Browse All Robots button',
    CTA_COMPARE: 'Compare Robots button',
  },

  // Featured robots section
  FEATURED: {
    SECTION_TITLE: 'Featured Robots',
    ROBOT_CARD: 'robot card',
    VIEW_DETAILS_BUTTON: 'View Details button',
  },

  // Footer
  FOOTER: {
    QUICK_LINKS: 'Quick Links',
    CATEGORIES: 'Categories',
    SOCIAL_MEDIA: 'Follow Us',
  },
} as const;

/**
 * Browse page elements and patterns
 */
export const BROWSE = {
  // Search
  SEARCH: {
    INPUT: 'Search robots textbox',
    PLACEHOLDER: 'Search by name, brand, or features',
  },

  // Filters sidebar
  FILTERS: {
    SECTION_TITLE: 'Filters',
    CLEAR_ALL: 'Clear Filters button',

    // Category filters
    CATEGORY: {
      SECTION: 'Category',
      HUMANOID: 'Humanoid checkbox',
      QUADRUPED: 'Quadruped checkbox',
      ACCESSORY: 'Accessory checkbox',
      OTHER: 'Other checkbox',
    },

    // Brand filters
    BRAND: {
      SECTION: 'Brand',
      UNITREE: 'Unitree checkbox',
      BOSTON_DYNAMICS: 'Boston Dynamics checkbox',
      UBTECK: 'UBTech checkbox',
      DEEP_ROBOTICS: 'Deep Robotics checkbox',
      ANYBOTICS: 'ANYbotics checkbox',
    },

    // Price range
    PRICE: {
      SECTION: 'Price Range',
      MIN_INPUT: 'Minimum price input',
      MAX_INPUT: 'Maximum price input',
      APPLY_BUTTON: 'Apply price filter button',
    },

    // Mobile filters
    MOBILE: {
      TOGGLE: 'Filter toggle button',
      CLOSE: 'Close filters button',
    },
  },

  // Sort dropdown
  SORT: {
    DROPDOWN: 'Sort by dropdown',
    OPTIONS: {
      NAME_ASC: 'Name (A-Z)',
      NAME_DESC: 'Name (Z-A)',
      PRICE_LOW: 'Price (Low to High)',
      PRICE_HIGH: 'Price (High to Low)',
      BRAND: 'Brand',
      CATEGORY: 'Category',
    },
  },

  // Results
  RESULTS: {
    COUNT: /Showing \d+ robots?/,
    ROBOT_CARD: 'robot card',
    NO_RESULTS: 'No robots found',
    VIEW_DETAILS: 'View Details button',
  },

  // Pagination (if exists)
  PAGINATION: {
    NEXT: 'Next page button',
    PREVIOUS: 'Previous page button',
    PAGE_NUMBER: 'Page number',
  },
} as const;

/**
 * Robot detail page elements
 */
export const ROBOT_DETAIL = {
  // Header
  TITLE: 'robot name heading',
  BRAND: 'brand name',
  CATEGORY: 'category badge',

  // Images
  MAIN_IMAGE: 'main robot image',
  THUMBNAIL: 'thumbnail image',

  // Actions
  REQUEST_QUOTE: 'Request Quote button',
  OFFICIAL_WEBSITE: 'Official Website link',
  SHARE: 'Share button',

  // Specifications
  SPECS: {
    TAB: 'Specifications tab',
    GENERAL_INFO: 'General Information',
    KEY_FEATURES: 'Key Features',
    HARDWARE: 'Hardware & Build Quality',
    SOFTWARE: 'Software Ecosystem',
    SUPPLIER: 'Supplier Reliability',
  },

  // Related robots
  RELATED: {
    SECTION: 'Related Robots',
    ROBOT_CARD: 'related robot card',
  },
} as const;

/**
 * Quote form modal elements
 */
export const QUOTE_FORM = {
  MODAL: {
    TITLE: 'Request a Quote',
    CLOSE_BUTTON: 'Close modal button',
    BACKDROP: 'Modal backdrop',
  },

  FIELDS: {
    NAME: 'Name input',
    EMAIL: 'Email input',
    ORGANIZATION: 'Organization input',
    PHONE: 'Phone input',
    QUANTITY: 'Quantity input',
    MESSAGE: 'Message textarea',
    ROBOT_NAME: 'Robot name (hidden)',
  },

  BUTTONS: {
    SUBMIT: 'Submit Quote Request button',
    CANCEL: 'Cancel button',
  },

  VALIDATION: {
    REQUIRED_ERROR: 'This field is required',
    EMAIL_ERROR: 'Please enter a valid email',
    PHONE_ERROR: 'Please enter a valid phone number',
  },

  SUCCESS: {
    MESSAGE: 'Thank you! Your quote request has been submitted',
    CLOSE_BUTTON: 'Close success message button',
  },
} as const;

/**
 * Navigation elements (common across pages)
 */
export const NAVIGATION = {
  // Main nav
  MAIN_NAV: {
    HOME: 'Home link',
    BROWSE: 'Browse link',
    BRANDS: 'Brands link',
    CATEGORIES: 'Categories link',
    BLOG: 'Blog link',
    FAQ: 'FAQ link',
    COMPARE: 'Compare link',
  },

  // Breadcrumbs
  BREADCRUMBS: {
    HOME: 'Home breadcrumb',
    SEPARATOR: '/',
  },

  // Mobile navigation
  MOBILE: {
    MENU_TOGGLE: 'Mobile menu toggle',
    MENU_CLOSE: 'Close mobile menu',
    OVERLAY: 'Mobile menu overlay',
  },
} as const;

/**
 * Common UI patterns
 */
export const COMMON = {
  // Buttons
  BUTTONS: {
    PRIMARY: 'primary button',
    SECONDARY: 'secondary button',
    LINK: 'link button',
  },

  // Loading states
  LOADING: {
    SPINNER: 'loading spinner',
    MESSAGE: 'Loading...',
  },

  // Error states
  ERROR: {
    MESSAGE: 'error message',
    RETRY_BUTTON: 'Retry button',
  },

  // Empty states
  EMPTY: {
    MESSAGE: 'No results found',
    CTA: 'Browse all robots button',
  },
} as const;

/**
 * Helper function to build element descriptions
 */
export function buildElementDescription(parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Helper function to build filter checkbox description
 */
export function filterCheckboxDescription(filterName: string): string {
  return `${filterName} checkbox`;
}

/**
 * Helper function to build robot card description
 */
export function robotCardDescription(robotName: string): string {
  return `${robotName} robot card`;
}
