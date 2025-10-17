import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    
    const { id } = await params;
    const resourceData = await request.json();
    const { category, type, title, url, description, language, isFeatured } = resourceData;

    const connection = await import('@/lib/db').then(m => m.default);
    
    await connection.execute(
      'UPDATE resources SET category = ?, type = ?, title = ?, url = ?, description = ?, language = ?, is_featured = ? WHERE id = ?',
      [category, type, title, url, description, language, isFeatured, id]
    );

    return NextResponse.json({ 
      message: 'Resource updated successfully',
      resource: { id, ...resourceData }
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    
    const { id } = await params;
    const connection = await import('@/lib/db').then(m => m.default);
    await connection.execute('DELETE FROM resources WHERE id = ?', [id]);

    return NextResponse.json({ 
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
