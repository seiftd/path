const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;

if (!huggingfaceApiKey) {
  console.error('HUGGINGFACE_API_KEY is not set in environment variables');
}

function getAnalyzeFallback(ideaText: string) {
  // Extract basic info from idea text for better fallback
  const idea = ideaText.toLowerCase();
  let category = 'general';
  let field = 'Technology';
  let competitors = ['Existing solutions in the market'];
  
  if (idea.includes('saas') || idea.includes('software')) {
    category = 'SaaS';
    field = 'Software as a Service';
    competitors = ['Salesforce', 'HubSpot', 'Zendesk'];
  } else if (idea.includes('crypto') || idea.includes('blockchain')) {
    category = 'FinTech';
    field = 'Cryptocurrency/Blockchain';
    competitors = ['Coinbase', 'Binance', 'Kraken'];
  } else if (idea.includes('ecommerce') || idea.includes('shop')) {
    category = 'E-commerce';
    field = 'Online Retail';
    competitors = ['Amazon', 'Shopify', 'eBay'];
  } else if (idea.includes('app') || idea.includes('mobile')) {
    category = 'Mobile App';
    field = 'Mobile Technology';
    competitors = ['App Store competitors', 'Google Play competitors'];
  }

  return {
    category,
    field,
    market_potential: 'medium',
    challenges: 'Competition, acquisition cost, and time-to-market risks.',
    next_steps: 'Validate the idea with 5–10 interviews, define MVP, and launch a landing page to collect signups.',
    competitors,
    idea_type: category
  };
}

function getQuestionsFallback(language: string) {
  return [
    {
      question: language === 'ar' ? 'من هو عميلك المستهدف؟' : language === 'fr' ? 'Qui est votre client cible ?' : 'Who is your target customer?',
      type: 'open_ended',
      options: []
    },
    {
      question: language === 'ar' ? 'ما هي ميزانيتك التقديرية لإطلاق MVP؟' : language === 'fr' ? 'Quel est votre budget estimé pour le MVP ?' : 'What is your estimated budget for the MVP?',
      type: 'multiple_choice',
      options: ['$0-1,000', '$1,000-10,000', '$10,000-50,000', '$50,000+']
    }
  ];
}

function getPathFallback(ideaData?: any) {
  const category = ideaData?.category || ideaData?.idea_type || 'general';
  
  // Customize path based on idea category
  if (category.toLowerCase().includes('saas')) {
    return {
      Foundation: ['Choose legal structure (LLC/Corp)', 'Register domain & trademark', 'Set up business banking'],
      'Product Development': ['Define MVP features', 'Choose tech stack', 'Build core functionality', 'Implement user authentication'],
      'Marketing & Sales': ['Define target market', 'Create landing page', 'Set up analytics', 'Launch beta program'],
      Operations: ['Set up hosting (AWS/Vercel)', 'Implement monitoring', 'Create support system'],
      Finance: ['Set subscription pricing', 'Integrate payment gateway', 'Create financial projections']
    };
  } else if (category.toLowerCase().includes('crypto') || category.toLowerCase().includes('fintech')) {
    return {
      Foundation: ['Research regulations', 'Get legal compliance', 'Register with authorities'],
      'Product Development': ['Design wallet/interface', 'Implement blockchain integration', 'Add security features'],
      'Marketing & Sales': ['Target crypto community', 'Create educational content', 'Partner with exchanges'],
      Operations: ['Set up secure infrastructure', 'Implement monitoring', 'Create risk management'],
      Finance: ['Set transaction fees', 'Create tokenomics', 'Plan funding rounds']
    };
  } else if (category.toLowerCase().includes('ecommerce')) {
    return {
      Foundation: ['Choose platform (Shopify/WooCommerce)', 'Register business', 'Get tax ID'],
      'Product Development': ['Source products', 'Set up inventory', 'Design storefront'],
      'Marketing & Sales': ['SEO optimization', 'Social media strategy', 'Google Ads campaign'],
      Operations: ['Set up fulfillment', 'Create return policy', 'Customer service'],
      Finance: ['Set product pricing', 'Calculate margins', 'Plan cash flow']
    };
  } else {
    return {
      Foundation: ['Choose legal structure', 'Register business', 'Open business bank account'],
      'Product Development': ['Define MVP scope', 'Build prototype', 'Collect user feedback'],
      'Marketing & Sales': ['Define ICP', 'Create landing page', 'Run small paid test'],
      Operations: ['Choose tools (auth, billing)', 'Set support process'],
      Finance: ['Create basic budget', 'Set pricing hypothesis']
    };
  }
}

// Free AI analysis using Hugging Face (completely free)
const analyzeWithHuggingFace = async (ideaText: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    return getAnalyzeFallback(ideaText);
  }

  const prompt = `Analyze this business idea: "${ideaText}". Provide detailed analysis including: category, field/industry, market potential (low/medium/high), challenges, next steps, potential competitors (3-5 companies), and idea type. Format as JSON with keys: category, field, market_potential, challenges, next_steps, competitors, idea_type.`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7
        },
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      return getAnalyzeFallback(ideaText);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Hugging Face model error:', data.error);
      return getAnalyzeFallback(ideaText);
    }

    const generatedText = data[0]?.generated_text || data.generated_text || '';

    // Try to parse JSON response
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON:', parseError);
    }

    return getAnalyzeFallback(ideaText);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return getAnalyzeFallback(ideaText);
  }
};

export const analyzeIdea = async (ideaText: string, language: string = 'en') => {
  return await analyzeWithHuggingFace(ideaText, language);
};

const generateQuestionsWithHuggingFace = async (ideaText: string, category: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    return getQuestionsFallback(language);
  }

  const prompt = `Generate questions for business idea: "${ideaText}" in category: ${category}. Create 5-7 questions about target market, budget, audience, value proposition, timeline, and resources. Format as JSON array with keys: question, type, options.`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7
        },
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      return getQuestionsFallback(language);
    }

    const data = await response.json();
    
    if (data.error) {
      return getQuestionsFallback(language);
    }

    const generatedText = data[0]?.generated_text || data.generated_text || '';

    // Try to parse JSON response
    try {
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If not JSON, return fallback questions
    }

    return getQuestionsFallback(language);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return getQuestionsFallback(language);
  }
};

export const generateQuestions = async (ideaText: string, category: string, language: string = 'en') => {
  return await generateQuestionsWithHuggingFace(ideaText, category, language);
};

const generatePathContentWithHuggingFace = async (ideaData: any, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    return getPathFallback(ideaData);
  }

  // Include BMC data in the prompt if available
  const bmcContext = ideaData.bmcAnswers ? 
    `\n\nBusiness Model Canvas Context:
    - Customer Segments: ${ideaData.bmcAnswers.customer_segments || 'Not specified'}
    - Value Propositions: ${ideaData.bmcAnswers.value_propositions || 'Not specified'}
    - Channels: ${ideaData.bmcAnswers.channels || 'Not specified'}
    - Revenue Streams: ${ideaData.bmcAnswers.revenue_streams || 'Not specified'}` : '';

  const prompt = `Create business plan for idea: ${ideaData.idea_text || ideaData.text} in category: ${ideaData.category}.${bmcContext} Generate steps for Foundation, Product Development, Marketing & Sales, Operations, Finance. Format as JSON with categories as keys and arrays of steps as values.`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 384,
          temperature: 0.7
        },
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      return getPathFallback();
    }

    const data = await response.json();
    
    if (data.error) {
    return getPathFallback(ideaData);
  }

  const generatedText = data[0]?.generated_text || data.generated_text || '';

  // Try to parse JSON response
  try {
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // If not JSON, return fallback structure
  }

  return getPathFallback(ideaData);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return getPathFallback(ideaData);
  }
};

export const generatePathContent = async (ideaData: any, language: string = 'en') => {
  return await generatePathContentWithHuggingFace(ideaData, language);
};