import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('dodo-signature');

    // Parse the webhook event
    const event = JSON.parse(body);

    console.log('🔔 Dodo Payments webhook received:', {
      type: event.type || event.event,
      status: event.status,
      customer_email: event.customer_email
    });

    // Handle payment success
    if (event.type === 'payment.successful' || event.status === 'paid' || event.status === 'successful') {
      await handlePaymentSuccess(event);
    } 
    // Handle subscription events
    else if (event.type === 'subscription.created' || event.type === 'subscription.renewed') {
      await handleSubscriptionEvent(event);
    }
    // Handle subscription cancellation
    else if (event.type === 'subscription.canceled' || event.type === 'subscription.cancelled') {
      await handleSubscriptionCanceled(event);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(event: any) {
  console.log('💳 Processing payment success:', event);

  try {
    const customerEmail = event.customer_email || event.email;
    
    if (!customerEmail) {
      console.error('❌ No customer email found in webhook');
      return;
    }

    // Get user ID from email using Clerk
    const users = await query(
      'SELECT id FROM users WHERE email = ?',
      [customerEmail]
    );

    if (!users || users.length === 0) {
      console.error('❌ User not found for email:', customerEmail);
      return;
    }

    const userId = users[0].id;

    // Check if subscription already exists
    const existingSubs = await query(
      'SELECT * FROM subscriptions WHERE user_id = ? AND status = ?',
      [userId, 'active']
    );

    if (existingSubs && existingSubs.length > 0) {
      console.log('✅ User already has active subscription');
      return;
    }

    // Create Pro subscription for 1 month
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await query(
      `INSERT INTO subscriptions 
       (id, user_id, plan, status, start_date, end_date, ideas_limit, pdfs_limit, ideas_used, pdfs_used, dodo_subscription_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        `sub_${Date.now()}`,
        userId,
        'pro',
        'active',
        startDate,
        endDate,
        50,  // 50 ideas for Pro
        20,  // 20 PDFs for Pro
        0,
        0,
        event.subscription_id || event.id || null
      ]
    );

    console.log('✅ Pro subscription activated for:', customerEmail);

  } catch (error) {
    console.error('❌ Error handling payment success:', error);
  }
}

async function handleSubscriptionEvent(event: any) {
  console.log('🔄 Processing subscription event:', event);

  try {
    const customerEmail = event.customer_email || event.email;
    
    if (!customerEmail) {
      console.error('❌ No customer email found in webhook');
      return;
    }

    // Get user ID from email
    const users = await query(
      'SELECT id FROM users WHERE email = ?',
      [customerEmail]
    );

    if (!users || users.length === 0) {
      console.error('❌ User not found for email:', customerEmail);
      return;
    }

    const userId = users[0].id;

    // Check if subscription exists
    const existingSubs = await query(
      'SELECT * FROM subscriptions WHERE user_id = ? AND status = ?',
      [userId, 'active']
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    if (existingSubs && existingSubs.length > 0) {
      // Update existing subscription
      await query(
        `UPDATE subscriptions 
         SET end_date = ?, ideas_used = 0, pdfs_used = 0, updated_at = NOW() 
         WHERE user_id = ? AND status = ?`,
        [endDate, userId, 'active']
      );
      console.log('✅ Subscription renewed for:', customerEmail);
    } else {
      // Create new subscription
      await query(
        `INSERT INTO subscriptions 
         (id, user_id, plan, status, start_date, end_date, ideas_limit, pdfs_limit, ideas_used, pdfs_used, dodo_subscription_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          `sub_${Date.now()}`,
          userId,
          'pro',
          'active',
          startDate,
          endDate,
          50,
          20,
          0,
          0,
          event.subscription_id || event.id || null
        ]
      );
      console.log('✅ New subscription created for:', customerEmail);
    }

  } catch (error) {
    console.error('❌ Error handling subscription event:', error);
  }
}

async function handleSubscriptionCanceled(event: any) {
  console.log('🚫 Processing subscription cancellation:', event);

  try {
    const customerEmail = event.customer_email || event.email;
    
    if (!customerEmail) {
      console.error('❌ No customer email found in webhook');
      return;
    }

    // Get user ID from email
    const users = await query(
      'SELECT id FROM users WHERE email = ?',
      [customerEmail]
    );

    if (!users || users.length === 0) {
      console.error('❌ User not found for email:', customerEmail);
      return;
    }

    const userId = users[0].id;

    // Update subscription status to canceled
    await query(
      `UPDATE subscriptions 
       SET status = ?, updated_at = NOW() 
       WHERE user_id = ? AND status = ?`,
      ['canceled', userId, 'active']
    );

    console.log('✅ Subscription canceled for:', customerEmail);

  } catch (error) {
    console.error('❌ Error handling subscription cancellation:', error);
  }
}

