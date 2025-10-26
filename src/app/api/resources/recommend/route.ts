import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedResources, getResourcesForPathNode, searchResources } from '@/lib/resource-recommender';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'idea', 'node', 'search'
    const ideaCategory = searchParams.get('ideaCategory');
    const nodeCategory = searchParams.get('nodeCategory');
    const query = searchParams.get('query');
    const language = searchParams.get('language') || 'en';
    const limit = parseInt(searchParams.get('limit') || '10');

    let resources;

    switch (type) {
      case 'idea':
        if (!ideaCategory) {
          return NextResponse.json(
            { error: 'Idea category is required for idea recommendations' },
            { status: 400 }
          );
        }
        resources = await getRecommendedResources(ideaCategory, language, limit);
        break;

      case 'node':
        if (!nodeCategory) {
          return NextResponse.json(
            { error: 'Node category is required for node recommendations' },
            { status: 400 }
          );
        }
        resources = await getResourcesForPathNode(nodeCategory, language);
        break;

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Search query is required for search' },
            { status: 400 }
          );
        }
        const filters = {
          category: searchParams.get('category') || undefined,
          type: searchParams.get('resourceType') || undefined,
          featured: searchParams.get('featured') === 'true' ? true : undefined
        };
        resources = await searchResources(query, language, filters);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid recommendation type. Use: idea, node, or search' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      resources,
      count: resources.length,
      type,
      filters: {
        ideaCategory,
        nodeCategory,
        query,
        language
      }
    });
  } catch (error) {
    console.error('Error getting resource recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get resource recommendations' },
      { status: 500 }
    );
  }
}
