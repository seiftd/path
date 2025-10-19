import { GoogleGenerativeAI } from '@google/generative-ai';

const googleApiKey = process.env.GOOGLE_AI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!googleApiKey && !openaiApiKey) {
  console.error('No AI API keys found. Please set GOOGLE_AI_API_KEY or OPENAI_API_KEY');
}

const genAI = googleApiKey ? new GoogleGenerativeAI(googleApiKey) : null;

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
  // Try Google AI first, then fallback to OpenAI
  if (genAI) {
    try {
      return await analyzeWithGoogleAI(ideaText, language);
    } catch (error) {
      console.warn('Google AI failed, trying OpenAI:', error);
      return await analyzeWithOpenAI(ideaText, language);
    }
  } else if (openaiApiKey) {
    return await analyzeWithOpenAI(ideaText, language);
  } else {
    throw new Error('No AI service configured');
  }
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
  // Try Google AI first, then fallback to OpenAI
  if (genAI) {
    try {
      return await generateQuestionsWithGoogleAI(ideaText, category, language);
    } catch (error) {
      console.warn('Google AI failed, trying OpenAI:', error);
      return await generateQuestionsWithOpenAI(ideaText, category, language);
    }
  } else if (openaiApiKey) {
    return await generateQuestionsWithOpenAI(ideaText, category, language);
  } else {
    throw new Error('No AI service configured');
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
  // Try Google AI first, then fallback to OpenAI
  if (genAI) {
    try {
      return await generatePathContentWithGoogleAI(ideaData, language);
    } catch (error) {
      console.warn('Google AI failed, trying OpenAI:', error);
      return await generatePathContentWithOpenAI(ideaData, language);
    }
  } else if (openaiApiKey) {
    return await generatePathContentWithOpenAI(ideaData, language);
  } else {
    throw new Error('No AI service configured');
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
