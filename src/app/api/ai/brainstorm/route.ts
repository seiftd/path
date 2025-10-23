import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { country, mode } = await req.json();

    if (!country && mode !== 'global') {
      return NextResponse.json(
        { error: 'Country is required unless in global mode' },
        { status: 400 }
      );
    }

    const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (!huggingfaceApiKey) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 500 }
      );
    }

    const locationContext = mode === 'global' 
      ? 'globally viable' 
      : `specifically tailored for ${country}, considering local market conditions, regulations, and cultural preferences`;

    const prompt = `Generate 5 innovative and profitable business ideas that are ${locationContext}.

For each idea, provide:
1. Idea Name (concise, catchy)
2. Category (e.g., SaaS, E-commerce, Agriculture, Healthcare, etc.)
3. Brief Description (2-3 sentences)
4. Why It Works (1-2 sentences explaining market opportunity)
${mode !== 'global' ? `5. Local Advantage (why this works specifically in ${country})` : ''}

Format as JSON array:
[
  {
    "name": "Idea Name",
    "category": "Category",
    "description": "Description here",
    "why_it_works": "Market opportunity",
    ${mode !== 'global' ? '"local_advantage": "Local benefits"' : ''}
  }
]

Focus on:
- Current market trends (2024-2025)
- Scalable business models
- Clear revenue potential
- Realistic entry barriers
${mode !== 'global' ? `- ${country}'s specific market needs and opportunities` : '- Global market opportunities'}

Generate JSON only, no additional text.`;

    const response = await fetch('https://router.huggingface.co/hf-inference/models/google/flan-t5-base', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.8,
          top_p: 0.9,
          do_sample: true
        },
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      
      // Fallback ideas
      return NextResponse.json({
        ideas: getFallbackIdeas(country, mode)
      });
    }

    const result = await response.json();
    let aiResponse = '';
    
    if (Array.isArray(result) && result.length > 0) {
      aiResponse = result[0].generated_text || '';
    } else if (typeof result === 'object' && result.generated_text) {
      aiResponse = result.generated_text;
    }

    // Try to parse JSON from response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const ideas = JSON.parse(jsonMatch[0]);
        if (Array.isArray(ideas) && ideas.length > 0) {
          return NextResponse.json({ ideas: ideas.slice(0, 5) });
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
      }
    }

    // Fallback if parsing fails
    return NextResponse.json({
      ideas: getFallbackIdeas(country, mode)
    });

  } catch (error) {
    console.error('Error brainstorming ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate ideas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getFallbackIdeas(country: string, mode: string) {
  const isGlobal = mode === 'global';
  const countryLower = country?.toLowerCase() || '';
  
  // Egypt-specific ideas
  if (countryLower.includes('egypt') || countryLower.includes('مصر')) {
    return [
      {
        name: 'Smart Agriculture Platform',
        category: 'AgTech',
        description: 'A mobile and web platform connecting Egyptian farmers with modern farming techniques, weather data, and direct market access. Includes AI-powered crop disease detection and pricing insights.',
        why_it_works: 'Egypt has 5+ million farmers who lack access to modern agricultural technology and fair market pricing.',
        local_advantage: 'Egypt\'s government is investing heavily in agricultural tech. The platform can integrate with local cooperatives and government initiatives.'
      },
      {
        name: 'EdTech for Arabic Speakers',
        category: 'Education Technology',
        description: 'An online learning platform offering professional courses (coding, design, business) in Arabic with local payment options and certificates recognized by Egyptian employers.',
        why_it_works: 'High demand for skill development among Egypt\'s young population (60% under 30) with limited quality Arabic content.',
        local_advantage: 'Partnerships with Egyptian universities and companies for certificate recognition. Affordable pricing in EGP with local payment methods.'
      },
      {
        name: 'Last-Mile Delivery Network',
        category: 'Logistics',
        description: 'A logistics platform connecting local delivery drivers with e-commerce stores and restaurants for same-day delivery across Egyptian cities.',
        why_it_works: 'E-commerce is growing 30% annually in Egypt, but last-mile delivery remains a challenge.',
        local_advantage: 'Understanding of local neighborhoods, traffic patterns, and building relationships with building concierges (bawab) who facilitate deliveries.'
      },
      {
        name: 'Waste-to-Product Manufacturing',
        category: 'Sustainability & Manufacturing',
        description: 'Convert plastic and organic waste into useful products (furniture, compost, building materials) while creating jobs in lower-income areas.',
        why_it_works: 'Egypt generates 95 million tons of waste annually with poor recycling infrastructure, creating both environmental and economic opportunity.',
        local_advantage: 'Government incentives for green businesses, access to abundant waste materials, and low manufacturing costs.'
      },
      {
        name: 'Halal Food Export Platform',
        category: 'Food & E-commerce',
        description: 'B2B platform connecting Egyptian halal food producers with international buyers in Gulf countries, Europe, and Asia.',
        why_it_works: 'Global halal food market worth $2+ trillion, Egypt has strong food production but weak export infrastructure.',
        local_advantage: 'Strategic location between markets, existing halal certification processes, and competitive production costs.'
      }
    ];
  }
  
  // Saudi Arabia-specific ideas
  if (countryLower.includes('saudi') || countryLower.includes('السعودية')) {
    return [
      {
        name: 'Smart Hajj & Umrah Tech',
        category: 'Travel Technology',
        description: 'A comprehensive app for pilgrims offering real-time crowd management, personalized guides, hotel booking, and multilingual support for Hajj and Umrah visitors.',
        why_it_works: '13+ million pilgrims visit annually, creating massive demand for tech solutions that enhance the spiritual experience.',
        local_advantage: 'Direct access to the market, partnerships with Saudi tourism authority, and understanding of religious requirements.'
      },
      {
        name: 'Women-Focused Co-Working Spaces',
        category: 'Real Estate & Services',
        description: 'Premium co-working spaces designed for Saudi businesswomen with childcare, private meeting rooms, and business development programs.',
        why_it_works: 'Saudi Arabia has the fastest-growing female workforce in the region (Vision 2030 targets 30% female participation).',
        local_advantage: 'Understanding of cultural needs, compliance with local regulations, and access to government support for women entrepreneurship programs.'
      },
      {
        name: 'Localized SaaS for SMEs',
        category: 'SaaS',
        description: 'Arabic-first business management software for Saudi SMEs covering accounting, inventory, HR, with Zakat and ZATCA compliance built-in.',
        why_it_works: 'Saudi SMEs represent 99% of businesses but lack affordable, compliant, Arabic-friendly software.',
        local_advantage: 'Built-in compliance with Saudi regulations, Arabic interface, and local payment gateways (Mada, STC Pay).'
      },
      {
        name: 'Healthy Food Subscription',
        category: 'Food & Beverage',
        description: 'Weekly subscription service delivering fresh, calorie-counted, Saudi-style healthy meals to homes and offices across major cities.',
        why_it_works: 'Saudi Arabia has high obesity rates (35%+) and growing health consciousness, especially among young professionals.',
        local_advantage: 'Local taste preferences, Halal compliance, and partnerships with Saudi fitness centers and health insurance providers.'
      },
      {
        name: 'Entertainment Venues Management',
        category: 'Entertainment & Events',
        description: 'Platform to manage and book entertainment venues (escape rooms, gaming centers, family entertainment) with integrated ticketing and marketing.',
        why_it_works: 'Saudi entertainment industry is booming with Vision 2030, expected to reach $30 billion by 2030.',
        local_advantage: 'Understanding of family entertainment needs, compliance with entertainment regulations, and access to newly opened entertainment districts.'
      }
    ];
  }
  
  // Global ideas
  return [
    {
      name: 'AI-Powered Content Localization',
      category: 'SaaS',
      description: 'A platform that helps businesses automatically translate and culturally adapt their content, marketing materials, and websites for different markets using AI.',
      why_it_works: 'Global e-commerce is growing, and businesses need to reach customers in their local languages and cultural contexts.'
    },
    {
      name: 'Remote Team Wellness Platform',
      category: 'HR Tech',
      description: 'A comprehensive wellness app for remote teams offering mental health support, virtual fitness classes, and team-building activities.',
      why_it_works: 'Remote work is now mainstream, and companies are investing heavily in employee well-being and retention.'
    },
    {
      name: 'Sustainable Packaging Solutions',
      category: 'Manufacturing & Sustainability',
      description: 'Manufacture eco-friendly, biodegradable packaging for e-commerce and food delivery businesses as an alternative to plastic.',
      why_it_works: 'Global shift toward sustainability and regulations banning single-use plastics create massive market opportunity.'
    },
    {
      name: 'Micro-Learning Mobile App',
      category: 'EdTech',
      description: 'A mobile app delivering 5-minute professional development lessons in bite-sized formats for busy professionals.',
      why_it_works: 'Professionals want continuous learning but lack time for long courses. Micro-learning has 50%+ higher engagement.'
    },
    {
      name: 'Freelancer Financial Services',
      category: 'FinTech',
      description: 'A financial platform designed for freelancers offering invoicing, tax management, international payments, and income smoothing.',
      why_it_works: 'Freelance economy is $1.5 trillion globally, and freelancers struggle with financial management and traditional banking.'
    }
  ];
}

