import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { query } from '@/lib/db';

// Handle Dodo Payments webhooks without signature verification for now
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    
    console.log('🔔 Dodo webhook received:', body);

    let event;
    try {
      event = JSON.parse(body);
    } catch (e) {
      console.error('Failed to parse webhook body:', e);
      return NextResponse.json({ received: true }); // Still return success
    }

    console.log('📦 Parsed event:', {
      type: event.type || event.event,
      status: event.status,
      customer_email: event.customer_email || event.email,
      subscription_id: event.subscription_id || event.id
    });

    // Extract customer email from various possible fields
    const customerEmail = 
      event.customer_email || 
      event.email || 
      event.customer?.email ||
      event.data?.customer_email ||
      event.data?.email;

    if (!customerEmail) {
      console.error('❌ No customer email found in webhook');
      return NextResponse.json({ received: true });
    }

    // Handle any successful payment or subscription
    const isSuccess = 
      event.type === 'payment.successful' ||
      event.type === 'subscription.created' ||
      event.type === 'subscription.activated' ||
      event.status === 'paid' ||
      event.status === 'successful' ||
      event.status === 'active';

    if (isSuccess) {
      console.log('✅ Processing successful payment for:', customerEmail);
      await activateSubscription(customerEmail, event);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ received: true }); // Still return success to Dodo
  }
}

async function activateSubscription(email: string, event: any) {
  try {
    console.log(`🔍 Looking for user: ${email}`);

    // Get user by email
    const users = await query(
      'SELECT id, email FROM users WHERE email = ?',
      [email]
    );

    let userId;
    if (!users || users.length === 0) {
      console.log('⚠️  User not found, creating placeholder');
      // Create a placeholder - will be updated when user logs in
      userId = `temp_${Date.now()}`;
    } else {
      userId = users[0].id;
      console.log(`✅ Found user: ${userId}`);
    }

    // Check existing subscriptions
    const existingSubs = await query(
      'SELECT * FROM subscriptions WHERE user_email = ? AND status = ?',
      [email, 'active']
    );

    if (existingSubs && existingSubs.length > 0) {
      console.log('📝 Updating existing subscription');
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await query(
        `UPDATE subscriptions 
         SET plan = ?, ideas_limit = ?, pdfs_limit = ?, ideas_used = 0, pdfs_used = 0, 
             end_date = ?, status = ?, clerk_user_id = ?, updated_at = NOW()
         WHERE user_email = ? AND status = ?`,
        ['pro', 50, 20, endDate, 'active', userId, email, 'active']
      );
    } else {
      console.log('➕ Creating new subscription');
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await query(
        `INSERT INTO subscriptions 
         (id, user_email, clerk_user_id, plan, status, start_date, end_date, ideas_limit, pdfs_limit, ideas_used, pdfs_used, payment_provider, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          `sub_${Date.now()}`,
          email,
          userId,
          'pro',
          'active',
          startDate,
          endDate,
          50,
          20,
          0,
          0,
          'dodo'
        ]
      );
    }

    console.log('🎉 Subscription activated successfully for:', email);

  } catch (error) {
    console.error('❌ Error activating subscription:', error);
  }
}

// Also handle GET requests for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Dodo Payments webhook endpoint is ready',
    timestamp: new Date().toISOString()
  });
}

