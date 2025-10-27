import { getResourcesByCategory, getAllResources } from './db';

export interface ResourceRecommendation {
  id: string;
  title: string;
  url: string;
  type: 'course' | 'article' | 'book' | 'tool';
  category: string;
  description: string;
  isFeatured: boolean;
  relevanceScore: number;
  reason: string;
}

export const getRecommendedResources = async (
  ideaCategory: string,
  userLanguage: string = 'en',
  maxResources: number = 10
): Promise<ResourceRecommendation[]> => {
  try {
    // Get all resources
    const allResources = (await getAllResources(userLanguage)) as unknown[];
    
    // Calculate relevance scores based on idea category
    const scoredResources = allResources.map(resource => {
      const res = resource as {category: string; type: string; is_featured?: boolean; [key: string]: unknown};
      const relevanceScore = calculateRelevanceScore(res, ideaCategory);
      return {
        ...res,
        relevanceScore,
        reason: getRecommendationReason(res, ideaCategory)
      };
    });

    // Sort by relevance score and featured status
    const sortedResources = scoredResources
      .sort((a, b) => {
        // Featured resources first
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        
        // Then by relevance score
        return b.relevanceScore - a.relevanceScore;
      })
      .slice(0, maxResources);

    return sortedResources;
  } catch (error) {
    console.error('Error getting recommended resources:', error);
    return [];
  }
};

const calculateRelevanceScore = (resource: {category: string; type: string; is_featured?: boolean}, ideaCategory: string): number => {
  let score = 0;
  
  // Base score
  score += 1;
  
  // Category matching
  const categoryMatch = getCategoryMatch(resource.category, ideaCategory);
  score += categoryMatch * 3;
  
  // Type preference (courses and books are more valuable)
  const typeScore = getTypeScore(resource.type);
  score += typeScore;
  
  // Featured resources get bonus
  if (resource.is_featured) {
    score += 2;
  }
  
  return score;
};

const getCategoryMatch = (resourceCategory: string, ideaCategory: string): number => {
  const categoryMappings: Record<string, string[]> = {
    'technology': ['Product Development', 'Marketing & Sales', 'Operations'],
    'agriculture': ['Foundation', 'Operations', 'Finance'],
    'healthcare': ['Foundation', 'Product Development', 'Operations'],
    'education': ['Foundation', 'Product Development', 'Marketing & Sales'],
    'manufacturing': ['Foundation', 'Operations', 'Finance'],
    'retail': ['Marketing & Sales', 'Operations', 'Finance'],
    'finance': ['Foundation', 'Finance', 'Operations'],
    'consulting': ['Foundation', 'Marketing & Sales', 'Operations']
  };
  
  const mappedCategories = categoryMappings[ideaCategory.toLowerCase()] || [];
  return mappedCategories.includes(resourceCategory) ? 1 : 0;
};

const getTypeScore = (type: string): number => {
  const typeScores: Record<string, number> = {
    'course': 3,
    'book': 2,
    'article': 1,
    'tool': 1
  };
  
  return typeScores[type] || 0;
};

const getRecommendationReason = (resource: {category: string}, ideaCategory: string): string => {
  const reasons: Record<string, string> = {
    'Foundation': 'Essential for setting up your business structure',
    'Product Development': 'Key for developing your product or service',
    'Marketing & Sales': 'Critical for reaching your target market',
    'Operations': 'Important for managing day-to-day operations',
    'Finance': 'Essential for financial planning and funding'
  };
  
  return reasons[resource.category] || 'Recommended based on your idea category';
};

export const getResourcesForPathNode = async (
  nodeCategory: string,
  userLanguage: string = 'en'
): Promise<ResourceRecommendation[]> => {
  try {
    const resources = (await getResourcesByCategory(nodeCategory, userLanguage)) as unknown[];
    
    return resources.map(resource => {
      const res = resource as {category: string; [key: string]: unknown};
      return {
        ...res,
        relevanceScore: 5, // High relevance for specific node
        reason: `Essential resources for ${nodeCategory}`
      };
    });
  } catch (error) {
    console.error('Error getting resources for path node:', error);
    return [];
  }
};

export const searchResources = async (
  query: string,
  userLanguage: string = 'en',
  filters?: {
    category?: string;
    type?: string;
    featured?: boolean;
  }
): Promise<ResourceRecommendation[]> => {
  try {
    const allResources = (await getAllResources(userLanguage)) as unknown[];
    
    // Filter resources based on search query and filters
    const filteredResources = allResources.filter(item => {
      const resource = item as {title: string; description?: string; category: string; type: string; is_featured?: boolean; [key: string]: unknown};
      const matchesQuery = !query || 
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !filters?.category || resource.category === filters.category;
      const matchesType = !filters?.type || resource.type === filters.type;
      const matchesFeatured = filters?.featured === undefined || resource.is_featured === filters.featured;
      
      return matchesQuery && matchesCategory && matchesType && matchesFeatured;
    });
    
    // Sort by relevance
    const scoredResources = filteredResources.map(item => {
      const resource = item as {title: string; description?: string; is_featured?: boolean; type: string; [key: string]: unknown};
      return {
        ...resource,
        relevanceScore: calculateSearchScore(resource, query),
        reason: 'Matches your search criteria'
      };
    });
    
    return scoredResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    console.error('Error searching resources:', error);
    return [];
  }
};

const calculateSearchScore = (resource: {title: string; description?: string; is_featured?: boolean; type: string}, query: string): number => {
  if (!query) return 1;
  
  let score = 0;
  const queryLower = query.toLowerCase();
  
  // Title match gets highest score
  if (resource.title.toLowerCase().includes(queryLower)) {
    score += 3;
  }
  
  // Description match gets medium score
  if (resource.description?.toLowerCase().includes(queryLower)) {
    score += 2;
  }
  
  // Featured resources get bonus
  if (resource.is_featured) {
    score += 1;
  }
  
  return score;
};
