// Google Analytics utility functions
// Simple and direct integration without environment dependencies

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string | Date, config?: Record<string, unknown>) => void;
    dataLayer: Record<string, unknown>[];
  }
}

// Check if gtag is available
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Basic event tracking function
export const trackEvent = (
  eventName: string, 
  parameters: Record<string, unknown> = {}
): void => {
  if (!isGtagAvailable()) return;
  
  window.gtag('event', eventName, parameters);
};

// Page view tracking (automatically handled by GA4, but can be used for SPAs)
export const trackPageView = (url: string, title?: string): void => {
  if (!isGtagAvailable()) return;
  
  window.gtag('config', 'G-88F0E7K5RF', {
    page_title: title,
    page_location: url,
  });
};

// Robot-specific tracking functions
export const trackRobotView = (robotId: string, robotName: string, robotBrand: string): void => {
  trackEvent('view_robot', {
    robot_id: robotId,
    robot_name: robotName,
    robot_brand: robotBrand,
  });
};

export const trackRobotQuote = (robotId: string, robotName: string, robotBrand: string): void => {
  trackEvent('request_quote', {
    robot_id: robotId,
    robot_name: robotName,
    robot_brand: robotBrand,
  });
};

export const trackRobotSearch = (searchTerm: string, resultsCount: number): void => {
  trackEvent('search_robots', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackRobotFilter = (filterType: string, filterValue: string, resultsCount: number): void => {
  trackEvent('filter_robots', {
    filter_type: filterType,
    filter_value: filterValue,
    results_count: resultsCount,
  });
};

// Blog content tracking
export const trackBlogView = (blogSlug: string, blogTitle: string, category: string): void => {
  trackEvent('view_blog_post', {
    blog_slug: blogSlug,
    blog_title: blogTitle,
    blog_category: category,
  });
};

export const trackBlogEngagement = (blogSlug: string, scrollPercent: number): void => {
  trackEvent('blog_engagement', {
    blog_slug: blogSlug,
    scroll_percent: scrollPercent,
  });
};

// Navigation tracking
export const trackNavigation = (section: string, source?: string): void => {
  trackEvent('navigate_section', {
    section: section,
    source: source || 'unknown',
  });
};

export const trackExternalLink = (url: string, linkText: string): void => {
  trackEvent('click_external_link', {
    external_url: url,
    link_text: linkText,
  });
};

// Category and brand tracking
export const trackCategoryView = (category: string, itemCount: number): void => {
  trackEvent('view_category', {
    category_name: category,
    item_count: itemCount,
  });
};

export const trackBrandView = (brand: string, itemCount: number): void => {
  trackEvent('view_brand', {
    brand_name: brand,
    item_count: itemCount,
  });
};

// Custom conversion tracking
export const trackConversion = (conversionType: string, value?: number): void => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value,
  });
};

// User engagement tracking
export const trackUserEngagement = (engagementType: string, duration?: number): void => {
  trackEvent('user_engagement', {
    engagement_type: engagementType,
    duration: duration,
  });
};

const gtag = {
  trackEvent,
  trackPageView,
  trackRobotView,
  trackRobotQuote,
  trackRobotSearch,
  trackRobotFilter,
  trackBlogView,
  trackBlogEngagement,
  trackNavigation,
  trackExternalLink,
  trackCategoryView,
  trackBrandView,
  trackConversion,
  trackUserEngagement,
};

export default gtag;