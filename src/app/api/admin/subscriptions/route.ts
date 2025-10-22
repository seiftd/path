import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all subscriptions
    const subscriptions = await query(
      `SELECT 
        s.*,
        u.email as user_email_verified,
        u.first_name,
        u.last_name
       FROM subscriptions s
       LEFT JOIN users u ON s.clerk_user_id = u.id
       ORDER BY s.created_at DESC`
    );

    return NextResponse.json({
      subscriptions: subscriptions || [],
      total: subscriptions?.length || 0
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

