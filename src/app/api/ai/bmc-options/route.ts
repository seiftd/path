import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';
export const preferredRegion = ['pdx1', 'cle1', 'lhr1'];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaType, category, bmcSection } = await request.json();

    if (!bmcSection) {
      return NextResponse.json({ error: 'BMC section is required' }, { status: 400 });
    }

    // Generate dynamic options based on idea type and category
    const options = generateBMCOptions(bmcSection, ideaType, category);
    const explanation = generateExplanation(bmcSection, ideaType, category);

    return NextResponse.json({
      options,
      explanation,
      examples: generateExamples(bmcSection, ideaType, category)
    });
  } catch (error: any) {
    console.error('Error generating BMC options:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate BMC options' },
      { status: 500 }
    );
  }
}

function generateBMCOptions(section: string, ideaType?: string, category?: string): string[] {
  const baseOptions: Record<string, string[]> = {
    customer_segments: [
      'Individual consumers (B2C)',
      'Small businesses (B2B)',
      'Enterprise clients',
      'Government organizations',
      'Non-profit organizations'
    ],
    value_propositions: [
      'Cost reduction',
      'Risk reduction',
      'Accessibility and convenience',
      'Performance improvement',
      'Customization and personalization'
    ],
    channels: [
      'Direct sales (website, phone)',
      'Retail stores and distributors',
      'Online marketplaces',
      'Social media and digital marketing',
      'Partnerships and affiliates'
    ],
    customer_relationships: [
      'Personal assistance',
      'Self-service',
      'Automated services',
      'Community',
      'Co-creation'
    ],
    revenue_streams: [
      'One-time payment',
      'Subscription/recurring',
      'Commission/fees',
      'Licensing',
      'Advertising'
    ],
    key_resources: [
      'Physical assets (facilities, equipment)',
      'Intellectual property',
      'Human resources and expertise',
      'Financial resources',
      'Customer data and relationships'
    ],
    key_activities: [
      'Production and manufacturing',
      'Problem solving',
      'Platform/network management',
      'Research and development',
      'Marketing and sales'
    ],
    key_partners: [
      'Suppliers and vendors',
      'Strategic alliances',
      'Joint ventures',
      'Distributors and retailers',
      'Service providers'
    ],
    cost_structure: [
      'Fixed costs (rent, salaries)',
      'Variable costs (materials, shipping)',
      'Marketing and advertising',
      'Technology and infrastructure',
      'Legal and compliance'
    ]
  };

  // Customize based on idea type
  if (ideaType?.toLowerCase().includes('saas')) {
    const saasOptions: Record<string, string[]> = {
      customer_segments: [
        'Small businesses (10-50 employees)',
        'Startups and entrepreneurs',
        'Enterprise companies (500+ employees)',
        'Freelancers and consultants',
        'Non-profit organizations'
      ],
      value_propositions: [
        'Automation and efficiency',
        'Cost reduction compared to traditional solutions',
        'Scalability and flexibility',
        'Real-time data and analytics',
        'Easy integration with existing tools'
      ],
      channels: [
        'Direct website and online platform',
        'App stores (mobile/desktop)',
        'Partner integrations and APIs',
        'Content marketing and SEO',
        'Sales team and demos'
      ],
      customer_relationships: [
        'Self-service with online support',
        'Personal assistance for enterprise clients',
        'Community-driven support forums',
        'Automated onboarding and tutorials',
        'Dedicated customer success managers'
      ],
      revenue_streams: [
        'Monthly/annual subscription fees',
        'Usage-based pricing',
        'Freemium with premium features',
        'One-time setup fees',
        'Professional services and consulting'
      ],
      key_resources: [
        'Development team and engineers',
        'Cloud infrastructure (AWS, Azure)',
        'Proprietary algorithms and AI',
        'Customer data and analytics',
        'Intellectual property and patents'
      ],
      key_activities: [
        'Software development and maintenance',
        'Customer onboarding and support',
        'Data analysis and insights',
        'Platform scaling and optimization',
        'Security and compliance'
      ],
      key_partners: [
        'Cloud providers (AWS, Google Cloud)',
        'Integration partners (Zapier, Slack)',
        'Payment processors (Stripe, PayPal)',
        'Marketing agencies and consultants',
        'Technology vendors and suppliers'
      ],
      cost_structure: [
        'Development and engineering costs',
        'Cloud infrastructure and hosting',
        'Customer acquisition and marketing',
        'Support and customer success',
        'Compliance and security'
      ]
    };
    return saasOptions[section] || baseOptions[section] || [];
  }

  if (ideaType?.toLowerCase().includes('crypto') || category?.toLowerCase().includes('fintech')) {
    const cryptoOptions: Record<string, string[]> = {
      customer_segments: [
        'Individual investors and traders',
        'Crypto exchanges and platforms',
        'Financial institutions',
        'DeFi protocol users',
        'Institutional investors'
      ],
      value_propositions: [
        'Decentralization and transparency',
        'Lower transaction fees',
        'Faster cross-border payments',
        'Financial inclusion',
        'Programmable money and smart contracts'
      ],
      channels: [
        'Cryptocurrency exchanges',
        'DeFi protocols and platforms',
        'Mobile wallets and apps',
        'Social media and community',
        'Partnerships with financial institutions'
      ],
      customer_relationships: [
        'Community-driven (Discord, Telegram)',
        'Automated smart contracts',
        'Educational content and tutorials',
        '24/7 technical support',
        'Partnership with exchanges'
      ],
      revenue_streams: [
        'Transaction fees and commissions',
        'Token sales and ICOs',
        'Staking rewards and yields',
        'Trading fees',
        'Lending and borrowing fees'
      ],
      key_resources: [
        'Blockchain technology and nodes',
        'Cryptographic expertise',
        'Regulatory compliance knowledge',
        'Trading algorithms',
        'Security and audit capabilities'
      ],
      key_activities: [
        'Smart contract development',
        'Security auditing and testing',
        'Regulatory compliance',
        'Community building and education',
        'Trading and liquidity management'
      ],
      key_partners: [
        'Cryptocurrency exchanges',
        'Blockchain infrastructure providers',
        'Regulatory and legal advisors',
        'Security auditors',
        'Financial institutions'
      ],
      cost_structure: [
        'Development and smart contract costs',
        'Security auditing and compliance',
        'Marketing and community building',
        'Legal and regulatory costs',
        'Infrastructure and hosting'
      ]
    };
    return cryptoOptions[section] || baseOptions[section] || [];
  }

  if (ideaType?.toLowerCase().includes('ecommerce')) {
    const ecommerceOptions: Record<string, string[]> = {
      customer_segments: [
        'Online shoppers (age 18-45)',
        'Small business owners',
        'Dropshippers and resellers',
        'B2B buyers',
        'International customers'
      ],
      value_propositions: [
        'Wide product selection',
        'Competitive pricing',
        'Fast and reliable delivery',
        'Easy returns and customer service',
        'Unique or exclusive products'
      ],
      channels: [
        'Online marketplace (Amazon, eBay)',
        'Own website and e-commerce platform',
        'Social media selling (Instagram, Facebook)',
        'Physical retail stores',
        'B2B sales and wholesale'
      ],
      customer_relationships: [
        'Self-service with customer support',
        'Personal shopping assistance',
        'Loyalty programs and rewards',
        'Social media engagement',
        'Email marketing and newsletters'
      ],
      revenue_streams: [
        'Product sales revenue',
        'Subscription boxes',
        'Marketplace commission fees',
        'Advertising and sponsored content',
        'Membership and loyalty programs'
      ],
      key_resources: [
        'Inventory and warehouse facilities',
        'Supplier relationships',
        'Logistics and shipping networks',
        'Customer data and analytics',
        'Brand and intellectual property'
      ],
      key_activities: [
        'Product sourcing and procurement',
        'Inventory management',
        'Order fulfillment and shipping',
        'Customer service and support',
        'Marketing and advertising'
      ],
      key_partners: [
        'Suppliers and manufacturers',
        'Shipping and logistics companies',
        'Payment processors',
        'Marketing and advertising partners',
        'Technology platforms (Shopify, WooCommerce)'
      ],
      cost_structure: [
        'Inventory and product costs',
        'Fulfillment and shipping',
        'Marketing and advertising',
        'Technology and platform fees',
        'Customer service and support'
      ]
    };
    return ecommerceOptions[section] || baseOptions[section] || [];
  }

  return baseOptions[section] || [];
}

function generateExplanation(section: string, ideaType?: string, category?: string): string {
  const explanations: Record<string, string> = {
    customer_segments: 'Customer segments are the different groups of people or organizations your business aims to reach and serve. This helps you understand who will buy your product or service.',
    value_propositions: 'Value propositions are the reasons why customers turn to one company over another. It describes the benefits customers can expect from your products and services.',
    channels: 'Channels are how a company communicates with and reaches its customer segments to deliver a value proposition. This includes both communication and distribution channels.',
    customer_relationships: 'Customer relationships describe the types of relationships a company establishes with specific customer segments. This ranges from personal to automated.',
    revenue_streams: 'Revenue streams represent the cash a company generates from each customer segment. This is the heart of any business model.',
    key_resources: 'Key resources are the most important assets required to make a business model work. These can be physical, intellectual, human, or financial.',
    key_activities: 'Key activities are the most important things a company must do to make its business model work. These are the critical tasks needed to execute the value proposition.',
    key_partners: 'Key partnerships are the network of suppliers and partners that make the business model work. These can be strategic alliances, joint ventures, or buyer-supplier relationships.',
    cost_structure: 'Cost structure describes all costs incurred to operate a business model. This includes fixed costs, variable costs, and economies of scale.'
  };

  return explanations[section] || 'This section is important for understanding your business model.';
}

function generateExamples(section: string, ideaType?: string, category?: string): string[] {
  const baseExamples: Record<string, string[]> = {
    customer_segments: [
      'B2C: Individual consumers (age 25-40, tech-savvy professionals)',
      'B2B: Small businesses (10-50 employees, retail sector)',
      'B2B2C: Platforms serving both businesses and end consumers'
    ],
    value_propositions: [
      'Cost reduction: Save money compared to alternatives',
      'Risk reduction: Reduce uncertainty and risk for customers',
      'Accessibility: Make something accessible that was previously out of reach'
    ],
    channels: [
      'Direct channels: Website, physical stores, sales force',
      'Indirect channels: Partner stores, wholesalers, online marketplaces',
      'Digital channels: Social media, email marketing, mobile apps'
    ],
    customer_relationships: [
      'Personal assistance: Human interaction during sales or after-sales',
      'Self-service: No direct human interaction, customers help themselves',
      'Communities: Creating user communities around the product'
    ],
    revenue_streams: [
      'One-time payment: Single purchase of product or service',
      'Subscription: Recurring payment for ongoing access',
      'Commission: Percentage of transaction value'
    ],
    key_resources: [
      'Physical: Manufacturing facilities, vehicles, buildings',
      'Intellectual: Patents, copyrights, customer databases',
      'Human: Key employees, specialized knowledge'
    ],
    key_activities: [
      'Production: Designing, manufacturing, delivering products',
      'Problem solving: Finding solutions to customer problems',
      'Platform/network: Managing platforms, networks, or marketplaces'
    ],
    key_partners: [
      'Strategic alliances: Non-competitors with complementary offerings',
      'Joint ventures: Partnerships to develop new business',
      'Buyer-supplier: Ensuring reliable supplies'
    ],
    cost_structure: [
      'Cost-driven: Focus on minimizing costs wherever possible',
      'Value-driven: Focus on creating value, less concerned with cost',
      'Fixed costs: Salaries, rent, insurance',
      'Variable costs: Materials, shipping, commissions'
    ]
  };

  return baseExamples[section] || [];
}
