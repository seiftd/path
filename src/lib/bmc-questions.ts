export interface BMCSection {
  id: string;
  title: string;
  question: string;
  explanation: string;
  examples: string[];
  options: string[];
  allowMultiple?: boolean; // Allow multiple selections
  country?: string; // For country-specific options
}

export interface BMCAnswers {
  customer_segments: string | string[];
  value_propositions: string | string[];
  channels: string | string[];
  customer_relationships: string | string[];
  revenue_streams: string | string[];
  key_resources: string | string[];
  key_activities: string | string[];
  key_partners: string | string[];
  cost_structure: string | string[];
}

export const getBMCSections = (ideaType?: string, category?: string): BMCSection[] => {
  const baseSections: BMCSection[] = [
    {
      id: 'customer_segments',
      title: 'Customer Segments',
      question: 'Who are your most important customers? Who are you creating value for?',
      explanation: 'Customer segments are the different groups of people or organizations your business aims to reach and serve. This helps you understand who will buy your product or service.',
      examples: [
        'B2C: Individual consumers (age 25-40, tech-savvy professionals)',
        'B2B: Small businesses (10-50 employees, retail sector)',
        'B2B2C: Platforms serving both businesses and end consumers'
      ],
      options: getCustomerSegmentOptions(ideaType, category)
    },
    {
      id: 'value_propositions',
      title: 'Value Propositions',
      question: 'What problem do you solve for your customers? What value do you deliver?',
      explanation: 'Value propositions are the reasons why customers turn to one company over another. It describes the benefits customers can expect from your products and services.',
      examples: [
        'Cost reduction: Save money compared to alternatives',
        'Risk reduction: Reduce uncertainty and risk for customers',
        'Accessibility: Make something accessible that was previously out of reach'
      ],
      options: getValuePropositionOptions(ideaType, category)
    },
    {
      id: 'channels',
      title: 'Channels',
      question: 'How do you reach your customer segments? (Select all that apply)',
      explanation: 'Channels are how a company communicates with and reaches its customer segments to deliver a value proposition. This includes both communication and distribution channels.',
      examples: [
        'Direct channels: Website, physical stores, sales force',
        'Indirect channels: Partner stores, wholesalers, online marketplaces',
        'Digital channels: Social media, email marketing, mobile apps'
      ],
      options: getChannelOptions(ideaType, category),
      allowMultiple: true
    },
    {
      id: 'customer_relationships',
      title: 'Customer Relationships',
      question: 'What type of relationship do you establish and maintain with each customer segment?',
      explanation: 'Customer relationships describe the types of relationships a company establishes with specific customer segments. This ranges from personal to automated.',
      examples: [
        'Personal assistance: Human interaction during sales or after-sales',
        'Self-service: No direct human interaction, customers help themselves',
        'Communities: Creating user communities around the product'
      ],
      options: getCustomerRelationshipOptions(ideaType, category)
    },
    {
      id: 'revenue_streams',
      title: 'Revenue Streams',
      question: 'How does your business make money? What are your revenue sources?',
      explanation: 'Revenue streams represent the cash a company generates from each customer segment. This is the heart of any business model.',
      examples: [
        'One-time payment: Single purchase of product or service',
        'Subscription: Recurring payment for ongoing access',
        'Commission: Percentage of transaction value'
      ],
      options: getRevenueStreamOptions(ideaType, category)
    },
    {
      id: 'key_resources',
      title: 'Key Resources',
      question: 'What key resources does your value proposition require?',
      explanation: 'Key resources are the most important assets required to make a business model work. These can be physical, intellectual, human, or financial.',
      examples: [
        'Physical: Manufacturing facilities, vehicles, buildings',
        'Intellectual: Patents, copyrights, customer databases',
        'Human: Key employees, specialized knowledge'
      ],
      options: getKeyResourceOptions(ideaType, category)
    },
    {
      id: 'key_activities',
      title: 'Key Activities',
      question: 'What key activities does your value proposition require?',
      explanation: 'Key activities are the most important things a company must do to make its business model work. These are the critical tasks needed to execute the value proposition.',
      examples: [
        'Production: Designing, manufacturing, delivering products',
        'Problem solving: Finding solutions to customer problems',
        'Platform/network: Managing platforms, networks, or marketplaces'
      ],
      options: getKeyActivityOptions(ideaType, category)
    },
    {
      id: 'key_partners',
      title: 'Key Partners',
      question: 'Who are your key partners and suppliers? What key resources do you acquire from them?',
      explanation: 'Key partnerships are the network of suppliers and partners that make the business model work. These can be strategic alliances, joint ventures, or buyer-supplier relationships.',
      examples: [
        'Strategic alliances: Non-competitors with complementary offerings',
        'Joint ventures: Partnerships to develop new business',
        'Buyer-supplier: Ensuring reliable supplies'
      ],
      options: getKeyPartnerOptions(ideaType, category)
    },
    {
      id: 'cost_structure',
      title: 'Cost Structure',
      question: 'What are the most important costs in your business model?',
      explanation: 'Cost structure describes all costs incurred to operate a business model. This includes fixed costs, variable costs, and economies of scale.',
      examples: [
        'Cost-driven: Focus on minimizing costs wherever possible',
        'Value-driven: Focus on creating value, less concerned with cost',
        'Fixed costs: Salaries, rent, insurance',
        'Variable costs: Materials, shipping, commissions'
      ],
      options: getCostStructureOptions(ideaType, category)
    }
  ];

  return baseSections;
};

// Dynamic options based on idea type and category
function getCustomerSegmentOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Small businesses (10-50 employees)',
      'Startups and entrepreneurs',
      'Enterprise companies (500+ employees)',
      'Freelancers and consultants',
      'Non-profit organizations'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Individual investors and traders',
      'Crypto exchanges and platforms',
      'Financial institutions',
      'DeFi protocol users',
      'Institutional investors'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Online shoppers (age 18-45)',
      'Small business owners',
      'Dropshippers and resellers',
      'B2B buyers',
      'International customers'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('app')) {
    return [
      'Mobile app users (iOS/Android)',
      'Gamers and entertainment seekers',
      'Productivity-focused professionals',
      'Social media users',
      'Health and fitness enthusiasts'
    ];
  }
  
  // Default options
  return [
    'Individual consumers (B2C)',
    'Small businesses (B2B)',
    'Enterprise clients',
    'Government organizations',
    'Non-profit organizations'
  ];
}

function getValuePropositionOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Automation and efficiency',
      'Cost reduction compared to traditional solutions',
      'Scalability and flexibility',
      'Real-time data and analytics',
      'Easy integration with existing tools'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Decentralization and transparency',
      'Lower transaction fees',
      'Faster cross-border payments',
      'Financial inclusion',
      'Programmable money and smart contracts'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Wide product selection',
      'Competitive pricing',
      'Fast and reliable delivery',
      'Easy returns and customer service',
      'Unique or exclusive products'
    ];
  }
  
  // Default options
  return [
    'Cost reduction',
    'Risk reduction',
    'Accessibility and convenience',
    'Performance improvement',
    'Customization and personalization'
  ];
}

function getChannelOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Direct website and online platform',
      'App stores (mobile/desktop)',
      'Partner integrations and APIs',
      'Content marketing and SEO',
      'Sales team and demos'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Cryptocurrency exchanges',
      'DeFi protocols and platforms',
      'Mobile wallets and apps',
      'Social media and community',
      'Partnerships with financial institutions'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Online marketplace (Amazon, eBay)',
      'Own website and e-commerce platform',
      'Social media selling (Instagram, Facebook)',
      'Physical retail stores',
      'B2B sales and wholesale'
    ];
  }
  
  // Default options
  return [
    'Direct sales (website, phone)',
    'Retail stores and distributors',
    'Online marketplaces',
    'Social media and digital marketing',
    'Partnerships and affiliates'
  ];
}

function getCustomerRelationshipOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Self-service with online support',
      'Personal assistance for enterprise clients',
      'Community-driven support forums',
      'Automated onboarding and tutorials',
      'Dedicated customer success managers'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Community-driven (Discord, Telegram)',
      'Automated smart contracts',
      'Educational content and tutorials',
      '24/7 technical support',
      'Partnership with exchanges'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Self-service with customer support',
      'Personal shopping assistance',
      'Loyalty programs and rewards',
      'Social media engagement',
      'Email marketing and newsletters'
    ];
  }
  
  // Default options
  return [
    'Personal assistance',
    'Self-service',
    'Automated services',
    'Community',
    'Co-creation'
  ];
}

function getRevenueStreamOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Monthly/annual subscription fees',
      'Usage-based pricing',
      'Freemium with premium features',
      'One-time setup fees',
      'Professional services and consulting'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Transaction fees and commissions',
      'Token sales and ICOs',
      'Staking rewards and yields',
      'Trading fees',
      'Lending and borrowing fees'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Product sales revenue',
      'Subscription boxes',
      'Marketplace commission fees',
      'Advertising and sponsored content',
      'Membership and loyalty programs'
    ];
  }
  
  // Default options
  return [
    'One-time payment',
    'Subscription/recurring',
    'Commission/fees',
    'Licensing',
    'Advertising'
  ];
}

function getKeyResourceOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Development team and engineers',
      'Cloud infrastructure (AWS, Azure)',
      'Proprietary algorithms and AI',
      'Customer data and analytics',
      'Intellectual property and patents'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Blockchain technology and nodes',
      'Cryptographic expertise',
      'Regulatory compliance knowledge',
      'Trading algorithms',
      'Security and audit capabilities'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Inventory and warehouse facilities',
      'Supplier relationships',
      'Logistics and shipping networks',
      'Customer data and analytics',
      'Brand and intellectual property'
    ];
  }
  
  // Default options
  return [
    'Physical assets (facilities, equipment)',
    'Intellectual property',
    'Human resources and expertise',
    'Financial resources',
    'Customer data and relationships'
  ];
}

function getKeyActivityOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Software development and maintenance',
      'Customer onboarding and support',
      'Data analysis and insights',
      'Platform scaling and optimization',
      'Security and compliance'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Smart contract development',
      'Security auditing and testing',
      'Regulatory compliance',
      'Community building and education',
      'Trading and liquidity management'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Product sourcing and procurement',
      'Inventory management',
      'Order fulfillment and shipping',
      'Customer service and support',
      'Marketing and advertising'
    ];
  }
  
  // Default options
  return [
    'Production and manufacturing',
    'Problem solving',
    'Platform/network management',
    'Research and development',
    'Marketing and sales'
  ];
}

function getKeyPartnerOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Cloud providers (AWS, Google Cloud)',
      'Integration partners (Zapier, Slack)',
      'Payment processors (Stripe, PayPal)',
      'Marketing agencies and consultants',
      'Technology vendors and suppliers',
      'Other (specify with country-specific options below)'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Cryptocurrency exchanges',
      'Blockchain infrastructure providers',
      'Regulatory and legal advisors',
      'Security auditors',
      'Financial institutions',
      'Other (specify with country-specific options below)'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Suppliers and manufacturers',
      'Shipping and logistics companies',
      'Payment processors',
      'Marketing and advertising partners',
      'Technology platforms (Shopify, WooCommerce)',
      'Other (specify with country-specific options below)'
    ];
  }
  
  // Default options
  return [
    'Suppliers and vendors',
    'Strategic alliances',
    'Joint ventures',
    'Distributors and retailers',
    'Service providers',
    'Other (specify with country-specific options below)'
  ];
}

// Get country-specific partner options for education projects
export function getCountrySpecificPartners(country: string, projectType: string): string[] {
  const countryLower = country.toLowerCase();
  const projectLower = projectType.toLowerCase();
  
  // Education projects
  if (projectLower.includes('education') || projectLower.includes('تعليم') || projectLower.includes('school')) {
    if (countryLower.includes('egypt') || countryLower.includes('مصر')) {
      return [
        'Private schools in Cairo (American schools, British schools)',
        'Private schools in Alexandria',
        'International schools (IB, IGCSE programs)',
        'Language centers and institutes',
        'Egyptian Ministry of Education',
        'Educational technology companies in Egypt',
        'Universities for partnerships (AUC, GUC, etc.)'
      ];
    }
    
    if (countryLower.includes('saudi') || countryLower.includes('السعودية')) {
      return [
        'Private schools in Riyadh',
        'Private schools in Jeddah',
        'International schools (American, British)',
        'Saudi Ministry of Education',
        'TATWEER Educational Technologies',
        'Universities (KAUST, King Saud University)',
        'EdTech companies in KSA'
      ];
    }
    
    if (countryLower.includes('uae') || countryLower.includes('الإمارات') || countryLower.includes('dubai')) {
      return [
        'Private schools in Dubai',
        'Private schools in Abu Dhabi',
        'International schools (IB, British curriculum)',
        'KHDA (Knowledge and Human Development Authority)',
        'ADEK (Abu Dhabi Department of Education)',
        'EdTech companies in UAE',
        'Universities in UAE'
      ];
    }
  }
  
  // Restaurant/Food projects
  if (projectLower.includes('restaurant') || projectLower.includes('food') || projectLower.includes('مطعم')) {
    if (countryLower.includes('egypt') || countryLower.includes('مصر')) {
      return [
        'Local food suppliers in Egypt',
        'Egyptian restaurants for partnerships',
        'Food delivery platforms (Talabat, Uber Eats Egypt)',
        'Tourism and restaurant associations',
        'Egyptian chefs and culinary schools',
        'Equipment suppliers in Cairo/Alexandria'
      ];
    }
    
    if (countryLower.includes('saudi') || countryLower.includes('السعودية')) {
      return [
        'Food suppliers in Saudi Arabia',
        'Restaurant chains in KSA',
        'Delivery platforms (HungerStation, Jahez, Mrsool)',
        'Saudi Food and Drug Authority',
        'Culinary institutes in KSA',
        'Hotel and hospitality groups'
      ];
    }
  }
  
  // Manufacturing/Factory projects
  if (projectLower.includes('manufactur') || projectLower.includes('factory') || projectLower.includes('مصنع')) {
    if (countryLower.includes('egypt') || countryLower.includes('مصر')) {
      return [
        'Industrial zones in Egypt (10th of Ramadan, 6th October)',
        'Raw material suppliers in Egypt',
        'Egyptian manufacturers associations',
        'Export councils in Egypt',
        'Shipping and logistics companies',
        'Equipment suppliers and machinery dealers'
      ];
    }
    
    if (countryLower.includes('saudi') || countryLower.includes('السعودية')) {
      return [
        'Industrial cities in KSA (Jubail, Yanbu)',
        'MODON (Saudi Industrial Property Authority)',
        'Saudi manufacturers and suppliers',
        'Saudi Export Development Authority',
        'Logistics and shipping companies in KSA'
      ];
    }
  }
  
  // Default country-specific options
  return [
    `Local suppliers in ${country}`,
    `Government agencies in ${country}`,
    `Business associations in ${country}`,
    `Universities and research centers in ${country}`,
    `Technology partners in ${country}`
  ];
}

function getCostStructureOptions(ideaType?: string, category?: string): string[] {
  if (ideaType?.toLowerCase().includes('saas')) {
    return [
      'Development and engineering costs',
      'Cloud infrastructure and hosting',
      'Customer acquisition and marketing',
      'Support and customer success',
      'Compliance and security'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    return [
      'Development and smart contract costs',
      'Security auditing and compliance',
      'Marketing and community building',
      'Legal and regulatory costs',
      'Infrastructure and hosting'
    ];
  }
  
  if (ideaType?.toLowerCase().includes('ecommerce')) {
    return [
      'Inventory and product costs',
      'Fulfillment and shipping',
      'Marketing and advertising',
      'Technology and platform fees',
      'Customer service and support'
    ];
  }
  
  // Default options
  return [
    'Fixed costs (rent, salaries)',
    'Variable costs (materials, shipping)',
    'Marketing and advertising',
    'Technology and infrastructure',
    'Legal and compliance'
  ];
}
