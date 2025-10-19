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
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          return_full_text: false
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

// Fallback AI analysis using OpenAI
const analyzeWithOpenAI = async (ideaText: string, language: string = 'en') => {
  if (!openaiApiKey) {
    throw new Error('No AI service available');
  }

  const prompt = `Analyze this business idea and provide insights:

Idea: "${ideaText}"

Please provide:
1. Idea category (agriculture, automotive, technology, healthcare, education, etc.)
2. Target market potential (low, medium, high)
3. Key challenges
4. Suggested next steps

Respond in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
Format as JSON with keys: category, market_potential, challenges, next_steps`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch {
      // If not JSON, return structured response
      return {
        category: 'general',
        market_potential: 'medium',
        challenges: content,
        next_steps: content
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze idea with OpenAI');
  }
};

export const analyzeIdea = async (ideaText: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
  }
  
  return await analyzeWithHuggingFace(ideaText, language);
};

const analyzeWithGoogleAI = async (ideaText: string, language: string = 'en') => {
  if (!genAI) {
    throw new Error('Google AI API key is not configured');
  }
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
    Analyze this business idea and provide insights:
    
    Idea: "${ideaText}"
    
    Please provide:
    1. Idea category (agriculture, automotive, technology, healthcare, education, etc.)
    2. Target market potential (low, medium, high)
    3. Key challenges
    4. Suggested next steps
    
    Respond in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
    Format as JSON with keys: category, market_potential, challenges, next_steps
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      return JSON.parse(text);
    } catch {
      // If not JSON, return structured response
      return {
        category: 'general',
        market_potential: 'medium',
        challenges: text,
        next_steps: text
      };
    }
  } catch (error) {
    console.error('Error analyzing idea with Google AI:', error);
    throw new Error('Failed to analyze idea with Google AI');
  }
};

export const generateQuestions = async (ideaText: string, category: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
  }
  
  return await generateQuestionsWithHuggingFace(ideaText, category, language);
};

const generateQuestionsWithHuggingFace = async (ideaText: string, category: string, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
  }

  const prompt = `Generate questions for business idea: "${ideaText}" in category: ${category}. Create 5-7 questions about target market, budget, audience, value proposition, timeline, and resources. Format as JSON array with keys: question, type, options.`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 800,
          temperature: 0.7,
          return_full_text: false
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

const generateQuestionsWithOpenAI = async (ideaText: string, category: string, language: string = 'en') => {
  if (!openaiApiKey) {
    throw new Error('No AI service available');
  }

  const prompt = `Generate 5-7 relevant questions to refine this business idea:

Idea: "${ideaText}"
Category: ${category}

Questions should cover:
- Target country/market
- Budget range
- Target audience
- Core value proposition
- Timeline
- Resources available

Respond in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
Format as JSON array of objects with keys: question, type (multiple_choice or open_ended), options (for multiple choice)`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch {
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
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate questions with OpenAI');
  }
};

const generateQuestionsWithGoogleAI = async (ideaText: string, category: string, language: string = 'en') => {
  if (!genAI) {
    throw new Error('Google AI API key is not configured');
  }
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
    Generate 5-7 relevant questions to refine this business idea:
    
    Idea: "${ideaText}"
    Category: ${category}
    
    Questions should cover:
    - Target country/market
    - Budget range
    - Target audience
    - Core value proposition
    - Timeline
    - Resources available
    
    Respond in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
    Format as JSON array of objects with keys: question, type (multiple_choice or open_ended), options (for multiple choice)
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
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
    }
  } catch (error) {
    console.error('Error generating questions with Google AI:', error);
    throw new Error('Failed to generate questions with Google AI');
  }
};

export const generatePathContent = async (ideaData: any, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
  }
  
  return await generatePathContentWithHuggingFace(ideaData, language);
};

const generatePathContentWithHuggingFace = async (ideaData: any, language: string = 'en') => {
  if (!huggingfaceApiKey) {
    throw new Error('Hugging Face API key is not configured');
  }

  const prompt = `Create business plan for idea: ${ideaData.idea_text} in category: ${ideaData.category}. Generate steps for Foundation, Product Development, Marketing & Sales, Operations, Finance. Format as JSON with categories as keys and arrays of steps as values.`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          return_full_text: false
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

const generatePathContentWithOpenAI = async (ideaData: any, language: string = 'en') => {
  if (!openaiApiKey) {
    throw new Error('No AI service available');
  }

  const prompt = `Create a structured business plan based on this idea and responses:

Idea: ${ideaData.idea_text}
Category: ${ideaData.category}
Responses: ${JSON.stringify(ideaData.responses)}

Generate actionable steps organized by categories:
- Foundation (legal, business setup)
- Product Development
- Marketing & Sales
- Operations
- Finance

Respond in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
Format as JSON with categories as keys and arrays of steps as values`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch {
      // Fallback structure
      return {
        Foundation: ['Set up legal structure', 'Register business'],
        'Product Development': ['Define MVP', 'Create prototype'],
        'Marketing & Sales': ['Identify target market', 'Create marketing strategy'],
        Operations: ['Set up processes', 'Hire team'],
        Finance: ['Create budget', 'Secure funding']
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate path content with OpenAI');
  }
};

const generatePathContentWithGoogleAI = async (ideaData: any, language: string = 'en') => {
  if (!genAI) {
    throw new Error('Google AI API key is not configured');
  }
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
    Create a structured business plan based on this idea and responses:
    
    Idea: ${ideaData.idea_text}
    Category: ${ideaData.category}
    Responses: ${JSON.stringify(ideaData.responses)}
    
    Generate actionable steps organized by categories:
    - Foundation (legal, business setup)
    - Product Development
    - Marketing & Sales
    - Operations
    - Finance
    
    Respond in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
    Format as JSON with categories as keys and arrays of steps as values.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      // Fallback structure
      return {
        Foundation: ['Set up legal structure', 'Register business'],
        'Product Development': ['Define MVP', 'Create prototype'],
        'Marketing & Sales': ['Identify target market', 'Create marketing strategy'],
        Operations: ['Set up processes', 'Hire team'],
        Finance: ['Create budget', 'Secure funding']
      };
    }
  } catch (error) {
    console.error('Error generating path content with Google AI:', error);
    throw new Error('Failed to generate path content with Google AI');
  }
};
