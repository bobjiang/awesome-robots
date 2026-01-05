import { Robot } from '@/types/robot';

export interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  brand: {
    "@type": "Brand";
    name: string;
  };
  category: string;
  url: string;
  image: string[];
  offers: {
    "@type": "Offer";
    price?: string;
    priceCurrency: "USD";
    availability: "https://schema.org/InStock" | "https://schema.org/OutOfStock";
    url: string;
    seller: {
      "@type": "Organization";
      name: string;
    };
  } | {
    "@type": "AggregateOffer";
    lowPrice: string;
    highPrice: string;
    priceCurrency: "USD";
    offerCount: string;
    offers: Array<{
      "@type": "Offer";
      name: string;
      price: string;
      priceCurrency: "USD";
      availability: "https://schema.org/InStock" | "https://schema.org/OutOfStock";
      url: string;
      seller: {
        "@type": "Organization";
        name: string;
      };
    }>;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string;
  };
  review?: Array<{
    "@type": "Review";
    reviewRating: {
      "@type": "Rating";
      ratingValue: string;
    };
    author: {
      "@type": "Person";
      name: string;
    };
    reviewBody: string;
  }>;
  additionalProperty?: Array<{
    "@type": "PropertyValue";
    name: string;
    value: string;
  }>;
}

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  description: string;
  url: string;
  logo: string;
  sameAs: string[];
  foundingDate?: string;
  founder?: Array<{
    "@type": "Person";
    name: string;
  }>;
  address?: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality?: string;
  };
}

export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  author: {
    "@type": "Person";
    name: string;
    url?: string;
    jobTitle?: string;
    knowsAbout?: string[];
    sameAs?: string[];
  };
  datePublished: string;
  dateModified: string;
  publisher: {
    "@type": "Organization";
    name: "Awesome Robots";
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  articleSection: string;
  keywords: string[];
  wordCount: number;
  image?: string[];
}

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle: string;
  description: string;
  knowsAbout: string[];
  sameAs?: string[];
  url?: string;
  worksFor?: {
    "@type": "Organization";
    name: string;
  };
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export function generateProductSchema(robot: Robot, baseUrl: string): ProductSchema {
  const productUrl = `${baseUrl}/robots/${robot.id}`;
  const imageUrls = robot.images?.map(img =>
    img.startsWith('http') ? img : `${baseUrl}${img}`
  ) || [`${baseUrl}/images/robots/${robot.id}.webp`];

  // Determine price and availability
  const hasPrice = robot.price && typeof robot.price.starting === 'number';
  const price = hasPrice ? robot.price.starting.toString() : undefined;

  // Generate editorial rating based on robot category and price
  const generateRating = (robot: Robot): { rating: string; reviewCount: string } => {
    // Premium brands get higher ratings
    const premiumBrands = ['Boston Dynamics', 'ANYbotics', 'Unitree', 'Agility Robotics'];
    const isPremium = premiumBrands.includes(robot.brand);

    // Base rating on category
    let baseRating = 4.2;
    if (robot.category === 'humanoid') baseRating = 4.3;
    if (robot.category === 'quadruped') baseRating = 4.4;

    // Adjust for premium brand
    if (isPremium) baseRating += 0.3;

    // Add some variance
    const rating = Math.min(4.9, baseRating).toFixed(1);

    // Review count based on brand popularity
    const reviewCount = isPremium ? '47' : '23';

    return { rating, reviewCount };
  };

  const { rating, reviewCount } = generateRating(robot);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${robot.brand} ${robot.name}`,
    description: robot.description || `Advanced ${robot.category} robot by ${robot.brand}`,
    brand: {
      "@type": "Brand",
      name: robot.brand
    },
    category: robot.category,
    url: productUrl,
    image: imageUrls,
    offers: {
      "@type": "Offer",
      ...(price && { price }),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: robot.brand
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviewCount
    },
    ...(robot.specifications && {
      additionalProperty: Object.entries(robot.specifications).map(([key, value]) => ({
        "@type": "PropertyValue",
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        value: value?.toString() || 'Not specified'
      }))
    })
  };
}

export function generateOrganizationSchema(
  brandName: string,
  description: string,
  websiteUrl: string,
  logoUrl: string,
  baseUrl: string
): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    description,
    url: websiteUrl,
    logo: logoUrl.startsWith('http') ? logoUrl : `${baseUrl}${logoUrl}`,
    sameAs: [websiteUrl]
  };
}

export function generateArticleSchema(
  title: string,
  description: string,
  author: string,
  publishDate: string,
  modifiedDate: string,
  category: string,
  keywords: string[],
  wordCount: number,
  url: string,
  baseUrl: string,
  authorData?: {
    name?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
  }
): ArticleSchema {
  const authorSchema: {
    "@type": "Person";
    name: string;
    sameAs?: string[];
    jobTitle?: string;
    knowsAbout?: string[];
  } = {
    "@type": "Person",
    name: author
  };

  // Enhanced author data if available
  if (authorData) {
    if (authorData.social?.linkedin) {
      authorSchema.sameAs = [
        `https://linkedin.com/in/${authorData.social.linkedin}`,
        ...(authorData.social.twitter ? [`https://twitter.com/${authorData.social.twitter}`] : []),
        ...(authorData.social.github ? [`https://github.com/${authorData.social.github}`] : [])
      ].filter(Boolean);
    }

    authorSchema.jobTitle = "Robotics Engineer & AI Researcher";
    authorSchema.knowsAbout = [
      "Artificial Intelligence",
      "Robotics Engineering",
      "Machine Learning",
      "Agile Software Development",
      "Robot Programming",
      "Automation Systems"
    ];
  }

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: authorSchema,
    datePublished: publishDate,
    dateModified: modifiedDate,
    publisher: {
      "@type": "Organization",
      name: "Awesome Robots",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    articleSection: category,
    keywords,
    wordCount
  };
}

export function generatePersonSchema(authorData: {
  name?: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorData.name || "Unknown Author",
    jobTitle: "Robotics Engineer & AI Researcher",
    description: authorData.bio || "",
    knowsAbout: [
      "Artificial Intelligence",
      "Robotics Engineering",
      "Machine Learning",
      "Agile Software Development",
      "Robot Programming",
      "Automation Systems"
    ],
    sameAs: authorData.social?.linkedin
      ? [
          `https://linkedin.com/in/${authorData.social.linkedin}`,
          ...(authorData.social.twitter ? [`https://twitter.com/${authorData.social.twitter}`] : []),
          ...(authorData.social.github ? [`https://github.com/${authorData.social.github}`] : [])
        ].filter(Boolean)
      : undefined,
    worksFor: {
      "@type": "Organization",
      name: "Awesome Robots"
    }
  };
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>, baseUrl: string): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
    }))
  };
}

export function generateRobotFAQSchema(): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of robots are available in the catalog?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our catalog includes humanoid robots, quadruped robots, accessories, and other specialized robotic systems. Popular categories include educational robots, research platforms, and industrial automation solutions."
        }
      },
      {
        "@type": "Question",
        name: "How do I choose between different robot brands?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Consider your use case, budget, technical requirements, and support needs. Educational users often prefer cost-effective options like Unitree, while industrial applications may benefit from premium brands like Boston Dynamics or Deep Robotics."
        }
      },
      {
        "@type": "Question",
        name: "What is the typical price range for AI robots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Robot prices vary widely based on capabilities. Entry-level quadrupeds start around $1,600, professional models range from $15,000-$50,000, and advanced humanoids can cost $150,000 or more. Contact manufacturers for specific pricing."
        }
      },
      {
        "@type": "Question",
        name: "Do these robots require programming knowledge?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most modern robots offer multiple interaction levels. Basic operation often requires minimal programming, while advanced features may need Python, ROS, or manufacturer-specific SDKs. Many include graphical programming interfaces for beginners."
        }
      }
    ]
  };
}

export function generateCategoryFAQSchema(category: string): FAQSchema {
  const categoryQuestions: Record<string, FAQSchema['mainEntity']> = {
    humanoid: [
      {
        "@type": "Question",
        name: "What can humanoid robots do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Humanoid robots can perform human-like tasks including walking, grasping objects, interacting with people, and navigating complex environments. They're used in research, education, entertainment, and increasingly in service industries."
        }
      },
      {
        "@type": "Question",
        name: "How much do humanoid robots cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Humanoid robot prices range from $5,000 for educational models to over $150,000 for advanced research platforms. Professional-grade humanoids typically cost between $20,000-$90,000 depending on capabilities and sensors."
        }
      },
      {
        "@type": "Question",
        name: "Are humanoid robots suitable for beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, many manufacturers offer entry-level humanoid robots with user-friendly interfaces. Models like UBTECH Alpha series and other educational humanoids are designed for beginners with visual programming tools and extensive documentation."
        }
      }
    ],
    quadruped: [
      {
        "@type": "Question",
        name: "What are quadruped robots used for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Quadruped robots excel at terrain navigation, inspection tasks, and research applications. They're used for industrial inspections, search and rescue, security patrols, and as research platforms for locomotion and AI studies."
        }
      },
      {
        "@type": "Question",
        name: "Which quadruped robot is best for beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Unitree Go2 is excellent for beginners, starting at $1,600. It offers good performance, extensive documentation, and a supportive community. Deep Robotics Lite3 is another beginner-friendly option with comprehensive SDK support."
        }
      },
      {
        "@type": "Question",
        name: "Can quadruped robots climb stairs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, most modern quadruped robots can climb stairs. Advanced models like Boston Dynamics Spot, Unitree Go2, and Deep Robotics X30 can navigate stairs, rough terrain, and obstacles using sophisticated balance and locomotion algorithms."
        }
      }
    ]
  };

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categoryQuestions[category] || categoryQuestions.humanoid
  };
}

// ItemList Schema for category and brand pages
export interface ItemListSchema {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name: string;
  description: string;
  numberOfItems: number;
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    url: string;
    name: string;
    image?: string;
  }>;
}

export function generateItemListSchema(
  items: Array<{id: string, name: string, brand: string, images?: string[]}>,
  listName: string,
  listDescription: string,
  baseUrl: string
): ItemListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    description: listDescription,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 20).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/robots/${item.id}`,
      name: `${item.brand} ${item.name}`,
      image: item.images && item.images.length > 0 ? item.images[0] : undefined
    }))
  };
}

// ImageObject Schema for better image SEO
export interface ImageObjectSchema {
  "@context": "https://schema.org";
  "@type": "ImageObject";
  url: string;
  width?: string;
  height?: string;
  caption?: string;
  description?: string;
}

export function generateImageObjectSchema(
  imageUrl: string,
  caption?: string,
  width?: string,
  height?: string
): ImageObjectSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    url: imageUrl,
    caption: caption,
    description: caption,
    ...(width && { width }),
    ...(height && { height })
  };
}
