import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Check subscription in database
    const subscriptions = await query(
      'SELECT * FROM subscriptions WHERE user_email = ? OR clerk_user_id = ? ORDER BY created_at DESC LIMIT 1',
      [email, userId]
    );

    if (subscriptions.length === 0) {
      // Return default free subscription
      return NextResponse.json({
        plan: 'free',
        status: 'active',
        ideas_limit: 1,
        pdfs_limit: 1,
        ideas_used: 0,
        pdfs_used: 0,
        end_date: null
      });
    }

    const subscription = subscriptions[0];
    
    // Check if subscription has expired
    if (subscription.end_date && new Date(subscription.end_date) < new Date()) {
      // Update status to expired
      await query(
        'UPDATE subscriptions SET status = ? WHERE id = ?',
        ['expired', subscription.id]
      );
      
      return NextResponse.json({
        plan: 'free',
        status: 'expired',
        ideas_limit: 1,
        pdfs_limit: 1,
        ideas_used: subscription.ideas_used || 0,
        pdfs_used: subscription.pdfs_used || 0,
        end_date: subscription.end_date
      });
    }

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      ideas_limit: subscription.ideas_limit,
      pdfs_limit: subscription.pdfs_limit,
      ideas_used: subscription.ideas_used || 0,
      pdfs_used: subscription.pdfs_used || 0,
      start_date: subscription.start_date,
      end_date: subscription.end_date
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const { action, type } = await request.json(); // action: 'use_idea' or 'use_pdf'

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Get current subscription
    const subscriptions = await query(
      'SELECT * FROM subscriptions WHERE user_email = ? OR clerk_user_id = ? ORDER BY created_at DESC LIMIT 1',
      [email, userId]
    );

    if (subscriptions.length === 0) {
      // Create default free subscription
      await query(
        'INSERT INTO subscriptions (id, user_email, clerk_user_id, plan, status, ideas_limit, pdfs_limit, ideas_used, pdfs_used, payment_provider) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [email, userId, 'free', 'active', 1, 1, 0, 0, 'manual']
      );
    }

    const subscription = subscriptions[0];

    // Update usage
    if (action === 'use_idea') {
      const newIdeasUsed = (subscription?.ideas_used || 0) + 1;
      await query(
        'UPDATE subscriptions SET ideas_used = ? WHERE id = ?',
        [newIdeasUsed, subscription.id]
      );
    } else if (action === 'use_pdf') {
      const newPdfsUsed = (subscription?.pdfs_used || 0) + 1;
      await query(
        'UPDATE subscriptions SET pdfs_used = ? WHERE id = ?',
        [newPdfsUsed, subscription.id]
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating subscription usage:', error);
    return NextResponse.json(
      { error: 'Failed to update usage' },
      { status: 500 }
    );
  }
}

