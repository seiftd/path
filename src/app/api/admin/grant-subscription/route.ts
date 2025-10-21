import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// This should be protected with admin authentication in production
export async function POST(request: NextRequest) {
  try {
    const { email, plan, months } = await request.json();
    
    if (!email || !plan) {
      return NextResponse.json({ error: 'Email and plan are required' }, { status: 400 });
    }

    const durationMonths = months || 1;
    
    // Set limits based on plan
    let ideasLimit = 1;
    let pdfsLimit = 1;
    
    if (plan === 'pro') {
      ideasLimit = 50;
      pdfsLimit = 20;
    }

    // Check if subscription exists
    const existing = await query(
      'SELECT id FROM subscriptions WHERE user_email = ?',
      [email]
    );

    if (existing.length > 0) {
      // Update existing subscription
      await query(
        `UPDATE subscriptions 
         SET plan = ?, 
             status = 'active', 
             ideas_limit = ?, 
             pdfs_limit = ?, 
             start_date = NOW(), 
             end_date = DATE_ADD(NOW(), INTERVAL ? MONTH),
             payment_provider = 'manual',
             updated_at = NOW()
         WHERE user_email = ?`,
        [plan, ideasLimit, pdfsLimit, durationMonths, email]
      );
    } else {
      // Create new subscription
      await query(
        `INSERT INTO subscriptions 
         (id, user_email, plan, status, ideas_limit, pdfs_limit, ideas_used, pdfs_used, start_date, end_date, payment_provider) 
         VALUES (UUID(), ?, ?, 'active', ?, ?, 0, 0, NOW(), DATE_ADD(NOW(), INTERVAL ? MONTH), 'manual')`,
        [email, plan, ideasLimit, pdfsLimit, durationMonths]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `${plan} subscription granted to ${email} for ${durationMonths} month(s)` 
    });

  } catch (error) {
    console.error('Error granting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to grant subscription' },
      { status: 500 }
    );
  }
}

