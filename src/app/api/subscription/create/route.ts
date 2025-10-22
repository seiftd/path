import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customer_email, customer_name } = await request.json();

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourpath.vercel.app';

    // Create subscription using Dodo Payments API
    const dodoResponse = await fetch('https://api.dodopayments.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: userId, // Using Clerk user ID as customer ID
        product_id: 'pdt_gETIuWASgloYg0idOZFcE', // Your subscription product ID
        quantity: 1,
        customer_email: customer_email,
        customer_name: customer_name,
        success_url: `${baseUrl}/payment/success`,
        cancel_url: `${baseUrl}/#pricing`,
        metadata: {
          clerk_user_id: userId,
          plan: 'monthly',
          source: 'foundyourpath.com',
          customer_email: customer_email
        }
      })
    });

    if (!dodoResponse.ok) {
      const errorData = await dodoResponse.json();
      console.error('Dodo Payments API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 400 }
      );
    }

    const subscriptionData = await dodoResponse.json();

    return NextResponse.json({
      subscription_id: subscriptionData.id,
      checkout_url: subscriptionData.checkout_url,
      status: subscriptionData.status
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
