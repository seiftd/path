const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;

if (!huggingfaceApiKey) {
  console.error('HUGGINGFACE_API_KEY is not set in environment variables');
}

function getAnalyzeFallback(ideaText: string) {
  // Extract basic info from idea text for better fallback
  const idea = ideaText.toLowerCase();
  let category = 'General Business';
  let field = 'General';
  let competitors: string[] = [];
  let idea_type = 'General';
  
  // SaaS/Software
  if (idea.includes('saas') || idea.includes('software') || idea.includes('platform')) {
    category = 'SaaS/Software';
    field = 'Software as a Service';
    idea_type = 'SaaS Platform';
    competitors = ['Salesforce', 'HubSpot', 'Zendesk', 'Monday.com'];
  } 
  // Crypto/Blockchain
  else if (idea.includes('crypto') || idea.includes('blockchain') || idea.includes('bitcoin') || idea.includes('nft')) {
    category = 'FinTech/Crypto';
    field = 'Cryptocurrency & Blockchain';
    idea_type = 'Blockchain Solution';
    competitors = ['Coinbase', 'Binance', 'MetaMask', 'Kraken'];
  } 
  // E-commerce
  else if (idea.includes('ecommerce') || idea.includes('shop') || idea.includes('store') || idea.includes('متجر')) {
    category = 'E-commerce';
    field = 'Online Retail';
    idea_type = 'E-commerce Platform';
    competitors = ['Amazon', 'Shopify stores', 'Noon', 'Jumia'];
  } 
  // Agriculture
  else if (idea.includes('farm') || idea.includes('agriculture') || idea.includes('زراع') || idea.includes('مزرعة')) {
    category = 'Agriculture';
    field = 'Agricultural Technology';
    idea_type = 'Agricultural Project';
    competitors = ['Local farms', 'AgriTech startups', 'Cooperative farms'];
  }
  // Food & Beverage
  else if (idea.includes('food') || idea.includes('restaurant') || idea.includes('cafe') || idea.includes('مطعم') || idea.includes('أطعمة')) {
    category = 'Food & Beverage';
    field = 'Food Service Industry';
    idea_type = 'Food Business';
    competitors = ['Local restaurants', 'Food chains', 'Delivery platforms'];
  }
  // Healthcare
  else if (idea.includes('health') || idea.includes('medical') || idea.includes('clinic') || idea.includes('صح')) {
    category = 'Healthcare';
    field = 'Healthcare Services';
    idea_type = 'Healthcare Solution';
    competitors = ['Local clinics', 'Telemedicine platforms', 'Healthcare providers'];
  }
  // Education
  else if (idea.includes('education') || idea.includes('learning') || idea.includes('course') || idea.includes('تعليم')) {
    category = 'Education';
    field = 'Educational Technology';
    idea_type = 'EdTech Platform';
    competitors = ['Coursera', 'Udemy', 'Khan Academy', 'Local institutions'];
  }
  // Real Estate
  else if (idea.includes('real estate') || idea.includes('property') || idea.includes('عقار')) {
    category = 'Real Estate';
    field = 'Property & Real Estate';
    idea_type = 'Real Estate Business';
    competitors = ['Local agencies', 'Property portals', 'Real estate platforms'];
  }
  // Mobile App
  else if (idea.includes('app') || idea.includes('mobile') || idea.includes('تطبيق')) {
    category = 'Mobile Application';
    field = 'Mobile Technology';
    idea_type = 'Mobile App';
    competitors = ['Similar apps on App Store', 'Similar apps on Google Play'];
  }
  // Marketing/Advertising
  else if (idea.includes('marketing') || idea.includes('advertising') || idea.includes('تسويق')) {
    category = 'Marketing';
    field = 'Digital Marketing';
    idea_type = 'Marketing Agency';
    competitors = ['Digital agencies', 'Freelance marketers', 'Marketing platforms'];
  }
  // Security
  else if (idea.includes('security') || idea.includes('protection') || idea.includes('أمن')) {
    category = 'Security';
    field = 'Security Services';
    idea_type = 'Security Solution';
    competitors = ['Security companies', 'Cybersecurity firms', 'Local security services'];
  }
  // Environmental
  else if (idea.includes('environment') || idea.includes('sustainability') || idea.includes('green') || idea.includes('بيئ')) {
    category = 'Environmental';
    field = 'Environmental Services';
    idea_type = 'Sustainability Project';
    competitors = ['Environmental NGOs', 'Green startups', 'Sustainability initiatives'];
  }

  return {
    category,
    field,
    market_potential: 'medium',
    challenges: 'Market competition, customer acquisition, operational complexity, regulatory requirements.',
    next_steps: 'Conduct market research, validate with potential customers, create MVP, test with beta users.',
    competitors: competitors.length > 0 ? competitors : ['Existing market solutions'],
    idea_type
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
  const category = (ideaData?.category || ideaData?.idea_type || 'general').toLowerCase();
  
  // Agriculture / Farm projects
  if (category.includes('agricult') || category.includes('farm') || category.includes('زراع') || category.includes('مزرعة')) {
    return {
      Foundation: ['Study soil & climate', 'Get agricultural licenses', 'Secure land/lease', 'Register farming business'],
      'Product Development': ['Choose crops/livestock', 'Plan irrigation system', 'Setup infrastructure', 'Create farming schedule'],
      'Marketing & Sales': ['Find buyers (markets/cooperatives)', 'Build distribution', 'Brand products', 'Explore exports'],
      Operations: ['Hire farm workers', 'Daily operations', 'Sustainable practices', 'Quality control'],
      Finance: ['Calculate costs', 'Apply for grants/loans', 'Equipment budget', 'Seasonal cash flow']
    };
  }
  // Food & Restaurant
  else if (category.includes('food') || category.includes('restaurant') || category.includes('مطعم')) {
    return {
      Foundation: ['Food safety licenses', 'Find location', 'Kitchen layout', 'Register food business'],
      'Product Development': ['Create menu', 'Source ingredients', 'Hire chef', 'Test recipes'],
      'Marketing & Sales': ['Local presence', 'Delivery apps partnership', 'Social media', 'Loyalty programs'],
      Operations: ['Staff training', 'Hygiene protocols', 'Inventory', 'Customer service'],
      Finance: ['Food costs', 'Menu pricing', 'Cash flow', 'Daily revenue tracking']
    };
  }
  // SaaS / Software
  else if (category.includes('saas') || category.includes('software')) {
    return {
      Foundation: ['Choose legal structure (LLC/Corp)', 'Register domain & trademark', 'Set up business banking'],
      'Product Development': ['Define MVP features', 'Choose tech stack', 'Build core functionality', 'Implement user authentication'],
      'Marketing & Sales': ['Define target market', 'Create landing page', 'Set up analytics', 'Launch beta program'],
      Operations: ['Set up hosting (AWS/Vercel)', 'Implement monitoring', 'Create support system'],
      Finance: ['Set subscription pricing', 'Integrate payment gateway', 'Create financial projections']
    };
  }
  // Crypto / FinTech
  else if (category.includes('crypto') || category.includes('fintech') || category.includes('blockchain')) {
    return {
      Foundation: ['Research regulations', 'Get legal compliance', 'Register with authorities'],
      'Product Development': ['Design wallet/interface', 'Implement blockchain integration', 'Add security features'],
      'Marketing & Sales': ['Target crypto community', 'Create educational content', 'Partner with exchanges'],
      Operations: ['Set up secure infrastructure', 'Implement monitoring', 'Create risk management'],
      Finance: ['Set transaction fees', 'Create tokenomics', 'Plan funding rounds']
    };
  }
  // E-commerce
  else if (category.includes('ecommerce') || category.includes('shop') || category.includes('store')) {
    return {
      Foundation: ['Choose platform (Shopify/WooCommerce)', 'Register business', 'Get tax ID'],
      'Product Development': ['Source products', 'Set up inventory', 'Design storefront'],
      'Marketing & Sales': ['SEO optimization', 'Social media strategy', 'Google Ads campaign'],
      Operations: ['Set up fulfillment', 'Create return policy', 'Customer service'],
      Finance: ['Set product pricing', 'Calculate margins', 'Plan cash flow']
    };
  }
  // Healthcare
  else if (category.includes('health') || category.includes('medical') || category.includes('clinic')) {
    return {
      Foundation: ['Medical licenses', 'Find facility', 'Register healthcare business', 'Get insurance'],
      'Product Development': ['Setup equipment', 'Hire medical staff', 'Service protocols'],
      'Marketing & Sales': ['Build doctor network', 'Patient referrals', 'Local advertising'],
      Operations: ['Patient management', 'Medical records', 'Staff scheduling'],
      Finance: ['Insurance billing', 'Service pricing', 'Equipment financing']
    };
  }
  // Education
  else if (category.includes('educat') || category.includes('learning') || category.includes('course')) {
    return {
      Foundation: ['Educational accreditation', 'Register institution', 'Find location/platform'],
      'Product Development': ['Curriculum development', 'Hire instructors', 'Learning materials'],
      'Marketing & Sales': ['Student enrollment', 'Partner with schools', 'Referral programs'],
      Operations: ['Class scheduling', 'Student support', 'Learning management'],
      Finance: ['Tuition pricing', 'Scholarships', 'Operating budget']
    };
  }
  // Generic fallback
  else {
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
    const response = await fetch('https://router.huggingface.co/hf-inference/models/google/flan-t5-base', {
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
    const response = await fetch('https://router.huggingface.co/hf-inference/models/google/flan-t5-base', {
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
    const response = await fetch('https://router.huggingface.co/hf-inference/models/google/flan-t5-base', {
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