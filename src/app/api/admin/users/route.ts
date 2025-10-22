import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check (you can enhance this)
    const auth = request.headers.get('authorization');
    
    // Get all users
    const users = await query(
      'SELECT id, email, first_name, last_name, language, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json({
      users: users || [],
      total: users?.length || 0
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

