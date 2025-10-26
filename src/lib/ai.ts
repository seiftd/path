import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export const analyzeIdea = async (ideaText: string, language: string = 'en') => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
    Analyze this business idea and provide insights:
    
    Idea: "${ideaText}"
    
    Please provide:
    1. Idea category (agriculture, automotive, technology, healthcare, education, etc.)
    2. Target market potential
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
    console.error('Error analyzing idea:', error);
    throw new Error('Failed to analyze idea');
  }
};

export const generateQuestions = async (ideaText: string, category: string, language: string = 'en') => {
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
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions');
  }
};

export const generatePathContent = async (ideaData: any, language: string = 'en') => {
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
    console.error('Error generating path content:', error);
    throw new Error('Failed to generate path content');
  }
};
