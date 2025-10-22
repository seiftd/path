export interface ResourceRecommendation {
  title: string;
  type: 'course' | 'youtube' | 'book' | 'website' | 'tool';
  url: string;
  description: string;
  platform?: string;
}

export const getResourceRecommendations = (
  projectType: string,
  category: string
): ResourceRecommendation[] => {
  const type = projectType.toLowerCase();
  const cat = category.toLowerCase();

  // SaaS Resources
  if (type.includes('saas') || type.includes('software')) {
    return [
      {
        title: 'Y Combinator Startup School',
        type: 'course',
        url: 'https://www.startupschool.org/',
        description: 'Free online course covering all aspects of starting a SaaS company',
        platform: 'Y Combinator'
      },
      {
        title: 'The SaaS Playbook - Rob Walling',
        type: 'book',
        url: 'https://www.amazon.com/SaaS-Playbook-Entrepreneurs-Bootstrapped-Business/dp/1544542194',
        description: 'Comprehensive guide to building and scaling a SaaS business',
        platform: 'Amazon'
      }
    ];
  }

  // E-commerce Resources
  if (type.includes('ecommerce') || type.includes('retail') || type.includes('متجر')) {
    return [
      {
        title: 'Shopify Compass',
        type: 'course',
        url: 'https://www.shopify.com/compass',
        description: 'Free e-commerce courses covering store setup, marketing, and scaling',
        platform: 'Shopify'
      },
      {
        title: 'The $100 Startup - Chris Guillebeau',
        type: 'book',
        url: 'https://www.amazon.com/100-Startup-Reinvent-Living-Create/dp/0307951529',
        description: 'Guide to starting an online business with minimal investment',
        platform: 'Amazon'
      }
    ];
  }

  // Crypto/FinTech Resources
  if (type.includes('crypto') || type.includes('fintech') || type.includes('blockchain')) {
    return [
      {
        title: 'Blockchain Fundamentals - Berkeley',
        type: 'course',
        url: 'https://www.edx.org/course/blockchain-fundamentals',
        description: 'Professional blockchain and cryptocurrency course',
        platform: 'edX'
      },
      {
        title: 'The Bitcoin Standard - Saifedean Ammous',
        type: 'book',
        url: 'https://www.amazon.com/Bitcoin-Standard-Decentralized-Alternative-Central/dp/1119473861',
        description: 'Essential reading for understanding cryptocurrency economics',
        platform: 'Amazon'
      }
    ];
  }

  // Agricultural Resources
  if (type.includes('agricultural') || type.includes('زراع') || type.includes('farming')) {
    return [
      {
        title: 'FAO e-Learning Academy',
        type: 'course',
        url: 'https://elearning.fao.org/',
        description: 'Free courses on sustainable agriculture and food security from UN',
        platform: 'FAO'
      },
      {
        title: 'Modern Farming Techniques',
        type: 'website',
        url: 'https://www.agriculture.com/farm-management',
        description: 'Latest farming technology, market trends and management tips',
        platform: 'Agriculture.com'
      },
      {
        title: 'The Market Gardener - Jean-Martin Fortier',
        type: 'book',
        url: 'https://www.amazon.com/Market-Gardener-Successful-Handbook-Small-scale/dp/0865717656',
        description: 'Guide to profitable small-scale organic farming',
        platform: 'Amazon'
      },
      {
        title: 'Small Farm Business Planning',
        type: 'website',
        url: 'https://www.sare.org/publications/building-a-sustainable-business/',
        description: 'Free guide to sustainable farming business planning',
        platform: 'SARE'
      }
    ];
  }

  // Security Resources
  if (type.includes('security') || type.includes('أمن')) {
    return [
      {
        title: 'Cybrary - Security Training',
        type: 'course',
        url: 'https://www.cybrary.it/',
        description: 'Free cybersecurity and physical security training courses',
        platform: 'Cybrary'
      },
      {
        title: 'The Security Risk Assessment Handbook',
        type: 'book',
        url: 'https://www.amazon.com/Security-Risk-Assessment-Handbook-Approach/dp/0128125284',
        description: 'Comprehensive guide to security risk management',
        platform: 'Amazon'
      }
    ];
  }

  // Environmental Resources
  if (type.includes('environment') || type.includes('بيئ') || type.includes('sustainability')) {
    return [
      {
        title: 'SDG Academy',
        type: 'course',
        url: 'https://sdgacademy.org/',
        description: 'Free courses on sustainable development and environmental management',
        platform: 'UN SDG Academy'
      },
      {
        title: 'Cradle to Cradle - William McDonough',
        type: 'book',
        url: 'https://www.amazon.com/Cradle-Remaking-Way-Make-Things/dp/0865475873',
        description: 'Framework for sustainable business design',
        platform: 'Amazon'
      }
    ];
  }

  // Mobile App Resources
  if (type.includes('app') || type.includes('mobile') || type.includes('تطبيق')) {
    return [
      {
        title: 'CS50 Mobile App Development',
        type: 'course',
        url: 'https://cs50.harvard.edu/mobile/',
        description: 'Harvard\'s free mobile app development course',
        platform: 'Harvard'
      },
      {
        title: 'Lean Startup - Eric Ries',
        type: 'book',
        url: 'https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898',
        description: 'Essential guide to building and testing mobile products',
        platform: 'Amazon'
      }
    ];
  }

  // Marketing/Advertising Resources
  if (type.includes('marketing') || type.includes('تسويق') || type.includes('advertising')) {
    return [
      {
        title: 'Google Digital Garage',
        type: 'course',
        url: 'https://learndigital.withgoogle.com/',
        description: 'Free digital marketing courses from Google',
        platform: 'Google'
      },
      {
        title: 'This Is Marketing - Seth Godin',
        type: 'book',
        url: 'https://www.amazon.com/This-Marketing-Cant-Until-Learn/dp/0525540830',
        description: 'Modern marketing principles and strategies',
        platform: 'Amazon'
      }
    ];
  }

  // Education/EdTech Resources
  if (type.includes('education') || type.includes('تعليم') || type.includes('edtech')) {
    return [
      {
        title: 'Teaching Online - Coursera',
        type: 'course',
        url: 'https://www.coursera.org/learn/teach-online',
        description: 'Free course on creating and delivering online education',
        platform: 'Coursera'
      },
      {
        title: 'Creating Innovators - Tony Wagner',
        type: 'book',
        url: 'https://www.amazon.com/Creating-Innovators-Making-Young-People/dp/1451611498',
        description: 'Guide to innovation in education',
        platform: 'Amazon'
      }
    ];
  }

  // Healthcare Resources
  if (type.includes('health') || type.includes('صح') || type.includes('medical')) {
    return [
      {
        title: 'Healthcare Innovation - Stanford',
        type: 'course',
        url: 'https://online.stanford.edu/courses/som-ychearth0001-healthcare-innovation-and-entrepreneurship',
        description: 'Course on healthcare entrepreneurship and innovation',
        platform: 'Stanford Online'
      },
      {
        title: 'The Innovator\'s Prescription - Clayton Christensen',
        type: 'book',
        url: 'https://www.amazon.com/Innovators-Prescription-Disruptive-Solution-Healthcare/dp/0071592083',
        description: 'Framework for healthcare innovation',
        platform: 'Amazon'
      }
    ];
  }

  // Real Estate Resources
  if (type.includes('real estate') || type.includes('عقار') || type.includes('property')) {
    return [
      {
        title: 'Real Estate Investing - Udemy',
        type: 'course',
        url: 'https://www.udemy.com/topic/real-estate-investing/',
        description: 'Comprehensive real estate investment courses',
        platform: 'Udemy'
      },
      {
        title: 'The Millionaire Real Estate Investor',
        type: 'book',
        url: 'https://www.amazon.com/Millionaire-Real-Estate-Investor/dp/0071446370',
        description: 'Proven strategies for real estate success',
        platform: 'Amazon'
      }
    ];
  }

  // Food & Beverage Resources
  if (type.includes('food') || type.includes('restaurant') || type.includes('مطعم') || type.includes('أطعمة')) {
    return [
      {
        title: 'How to Start a Restaurant Business',
        type: 'website',
        url: 'https://www.restaurantengine.com/how-to-start-a-restaurant/',
        description: 'Complete guide to starting and running a restaurant',
        platform: 'Restaurant Engine'
      },
      {
        title: 'Food Truck Empire - Start Your Food Business',
        type: 'course',
        url: 'https://www.udemy.com/course/food-truck-empire/',
        description: 'Learn how to start and run a successful food business',
        platform: 'Udemy'
      },
      {
        title: 'Setting the Table - Danny Meyer',
        type: 'book',
        url: 'https://www.amazon.com/Setting-Table-Transforming-Hospitality-Business/dp/0060742763',
        description: 'Restaurant and hospitality business guide from Shake Shack founder',
        platform: 'Amazon'
      },
      {
        title: 'Restaurant Success by the Numbers',
        type: 'website',
        url: 'https://www.thebalancemoney.com/restaurant-business-4161646',
        description: 'Financial planning and management for restaurants',
        platform: 'The Balance'
      }
    ];
  }

  // Default/General Resources
  return [
    {
      title: 'Harvard Business Essentials',
      type: 'course',
      url: 'https://online.hbs.edu/courses/',
      description: 'Professional business courses from Harvard Business School',
      platform: 'Harvard Business School'
    },
    {
      title: 'The Lean Startup - Eric Ries',
      type: 'book',
      url: 'https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898',
      description: 'Essential guide for any entrepreneur building a new business',
      platform: 'Amazon'
    }
  ];
};

export const getYouTubeChannelRecommendations = (
  projectType: string
): Array<{ name: string; url: string; description: string }> => {
  const type = projectType.toLowerCase();

  if (type.includes('saas') || type.includes('software')) {
    return [
      {
        name: 'Y Combinator',
        url: 'https://www.youtube.com/@ycombinator',
        description: 'Startup advice from the world\'s top accelerator'
      },
      {
        name: 'MicroConf',
        url: 'https://www.youtube.com/@MicroConf',
        description: 'SaaS and bootstrapped startup strategies'
      }
    ];
  }

  if (type.includes('ecommerce') || type.includes('retail')) {
    return [
      {
        name: 'Shopify',
        url: 'https://www.youtube.com/@Shopify',
        description: 'E-commerce tips, success stories, and tutorials'
      },
      {
        name: 'Jungle Scout',
        url: 'https://www.youtube.com/@JungleScout',
        description: 'Amazon FBA and e-commerce strategies'
      }
    ];
  }

  if (type.includes('crypto') || type.includes('blockchain')) {
    return [
      {
        name: 'Andreas Antonopoulos',
        url: 'https://www.youtube.com/@aantonop',
        description: 'Bitcoin and blockchain education'
      },
      {
        name: 'Coin Bureau',
        url: 'https://www.youtube.com/@CoinBureau',
        description: 'Crypto market analysis and education'
      }
    ];
  }

  if (type.includes('agricultural') || type.includes('farm') || type.includes('زراع')) {
    return [
      {
        name: 'No-Till Growers',
        url: 'https://www.youtube.com/@notillgrowers',
        description: 'Modern sustainable farming techniques and market gardening'
      },
      {
        name: 'Richard Perkins',
        url: 'https://www.youtube.com/@richardperkins',
        description: 'Regenerative agriculture and profitable farming strategies'
      },
      {
        name: 'Curtis Stone',
        url: 'https://www.youtube.com/@Theurbanfarmer',
        description: 'Small-scale profitable farming and urban agriculture'
      },
      {
        name: 'Farm Marketing Solutions',
        url: 'https://www.youtube.com/@FarmMarketingSolutions',
        description: 'Marketing strategies and business tips for farmers'
      }
    ];
  }

  if (type.includes('food') || type.includes('restaurant') || type.includes('مطعم')) {
    return [
      {
        name: 'Restaurant Influencers',
        url: 'https://www.youtube.com/@restaurantinfluencers',
        description: 'Restaurant business strategies and success stories'
      },
      {
        name: 'Toast',
        url: 'https://www.youtube.com/@ToastTab',
        description: 'Restaurant technology, operations tips, and industry insights'
      },
      {
        name: 'The Restaurant Boss',
        url: 'https://www.youtube.com/@TheRestaurantBoss',
        description: 'Restaurant management, marketing, and profitability tips'
      },
      {
        name: 'Chef Lav',
        url: 'https://www.youtube.com/@ChefLav',
        description: 'Food business startup advice and kitchen operations'
      }
    ];
  }

  if (type.includes('marketing')) {
    return [
      {
        name: 'Neil Patel',
        url: 'https://www.youtube.com/@NeilPatel',
        description: 'Digital marketing and SEO strategies'
      },
      {
        name: 'GaryVee',
        url: 'https://www.youtube.com/@GaryVee',
        description: 'Marketing, branding, and entrepreneurship'
      }
    ];
  }

  // Default
  return [
    {
      name: 'Ali Abdaal',
      url: 'https://www.youtube.com/@aliabdaal',
      description: 'Productivity, business, and entrepreneurship'
    },
    {
      name: 'Think Media',
      url: 'https://www.youtube.com/@ThinkMedia',
      description: 'Video marketing and online business growth'
    }
  ];
};
