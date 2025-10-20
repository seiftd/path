const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;

if (!huggingfaceApiKey) {
  console.error('HUGGINGFACE_API_KEY is not set in environment variables');
}

// Free AI analysis using Hugging Face (completely free)
const analyzeWithHuggingFace = async (ideaText: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
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
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Hugging Face model error:', data.error);
      throw new Error(`Hugging Face model error: ${data.error}`);
    }

    const generatedText = data[0]?.generated_text || data.generated_text || '';

    console.log('Hugging Face response:', generatedText);

    // Try to parse JSON response
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Parsed JSON:', parsed);
        return parsed;
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON:', parseError);
    }

    // Fallback structured response
    return {
      category: 'general',
      market_potential: 'medium',
      challenges: generatedText || 'Market competition and funding challenges',
      next_steps: generatedText || 'Research market, create MVP, validate with customers'
    };
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw new Error('Failed to analyze idea with Hugging Face');
  }
};

export const analyzeIdea = async (ideaText: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
  }
  
  return await analyzeWithHuggingFace(ideaText, language);
};

const generateQuestionsWithHuggingFace = async (ideaText: string, category: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
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
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Hugging Face error: ${data.error}`);
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

    // Fallback questions
    return [
      {
        question: language === 'ar' ? 'في أي بلد تريد تطوير فكرتك؟' : 
                 language === 'fr' ? 'Dans quel pays voulez-vous développer votre idée ?' :
                 'In which country do you want to develop your idea?',
        type: 'open_ended',
        options: []
      },
      {
        question: language === 'ar' ? 'ما هو ميزانيتك المقدرة؟' :
                 language === 'fr' ? 'Quel est votre budget estimé ?' :
                 'What is your estimated budget?',
        type: 'multiple_choice',
        options: ['$0-1,000', '$1,000-10,000', '$10,000-50,000', '$50,000+']
      }
    ];
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw new Error('Failed to generate questions with Hugging Face');
  }
};

export const generateQuestions = async (ideaText: string, category: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
  }
  
  return await generateQuestionsWithHuggingFace(ideaText, category, language);
};

const generatePathContentWithHuggingFace = async (ideaData: any, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
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
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Hugging Face error: ${data.error}`);
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

    // Fallback structure
    return {
      Foundation: ['Set up legal structure', 'Register business'],
      'Product Development': ['Define MVP', 'Create prototype'],
      'Marketing & Sales': ['Identify target market', 'Create marketing strategy'],
      Operations: ['Set up processes', 'Hire team'],
      Finance: ['Create budget', 'Secure funding']
    };
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw new Error('Failed to generate path content with Hugging Face');
  }
};

export const generatePathContent = async (ideaData: any, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
  }
  
  return await generatePathContentWithHuggingFace(ideaData, language);
};