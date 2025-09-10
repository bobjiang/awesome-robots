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

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${robot.brand} ${robot.name}`,
    description: robot.description,
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
}, _baseUrl: string): PersonSchema {
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
      "Automation Systems",
      "Scrum Methodology",
      "Large-scale Agile Transformations"
    ],
    ...(authorData.social && {
      sameAs: [
        authorData.social.linkedin && `https://linkedin.com/in/${authorData.social.linkedin}`,
        authorData.social.twitter && `https://twitter.com/${authorData.social.twitter}`,
        authorData.social.github && `https://github.com/${authorData.social.github}`
      ].filter((url): url is string => Boolean(url))
    }),
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