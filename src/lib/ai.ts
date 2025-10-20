const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;

if (!huggingfaceApiKey) {
  console.error('HUGGINGFACE_API_KEY is not set in environment variables');
}

function getAnalyzeFallback(ideaText: string) {
  return {
    category: 'general',
    market_potential: 'medium',
    challenges: 'Competition, acquisition cost, and time-to-market risks.',
    next_steps: 'Validate the idea with 5–10 interviews, define MVP, and launch a landing page to collect signups.'
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

function getPathFallback() {
  return {
    Foundation: ['Choose legal structure', 'Register business', 'Open business bank account'],
    'Product Development': ['Define MVP scope', 'Build prototype', 'Collect user feedback'],
    'Marketing & Sales': ['Define ICP', 'Create landing page', 'Run small paid test'],
    Operations: ['Choose tools (auth, billing)', 'Set support process'],
    Finance: ['Create basic budget', 'Set pricing hypothesis']
  };
}

// Free AI analysis using Hugging Face (completely free)
const analyzeWithHuggingFace = async (ideaText: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    return getAnalyzeFallback(ideaText);
  }

  const prompt = `Analyze this business idea: "${ideaText}". Provide category, market potential (low/medium/high), challenges, and next steps. Format as JSON with keys: category, market_potential, challenges, next_steps.`;

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
    return getPathFallback();
  }

  const prompt = `Create business plan for idea: ${ideaData.idea_text} in category: ${ideaData.category}. Generate steps for Foundation, Product Development, Marketing & Sales, Operations, Finance. Format as JSON with categories as keys and arrays of steps as values.`;

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
      return getPathFallback();
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

    return getPathFallback();
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return getPathFallback();
  }
};

export const generatePathContent = async (ideaData: any, language: string = 'en') => {
  return await generatePathContentWithHuggingFace(ideaData, language);
};