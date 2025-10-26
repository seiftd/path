import { NextRequest, NextResponse } from 'next/server';
import { getAllResources, getResourcesByCategory } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const language = searchParams.get('language') || 'en';

    let resources;
    if (category) {
      resources = await getResourcesByCategory(category, language);
    } else {
      resources = await getAllResources(language);
    }

    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const resourceData = await request.json();
    const { category, type, title, url, description, language = 'en', isFeatured = false } = resourceData;

    if (!category || !type || !title) {
      return NextResponse.json(
        { error: 'Category, type, and title are required' },
        { status: 400 }
      );
    }

    const connection = await import('@/lib/db').then(m => m.default);
    const id = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await connection.execute(
      'INSERT INTO resources (id, category, type, title, url, description, language, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, category, type, title, url, description, language, isFeatured]
    );

    return NextResponse.json({ 
      message: 'Resource created successfully',
      resource: { id, ...resourceData }
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
