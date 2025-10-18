import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPayment } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaId, plan, amount, currency, description } = await request.json();

    // Handle different payment types
    let paymentData;
    
    if (plan === 'monthly') {
      // Monthly subscription
      paymentData = {
        amount: amount || 20.00,
        currency: currency || 'USD',
        description: description || 'Pro Monthly Subscription - Found Your Path',
        user_id: userId,
        plan: 'monthly',
        recurring: true
      };
    } else if (ideaId) {
      // PDF download payment
      paymentData = {
        amount: 2.00,
        currency: 'USD',
        description: 'Business Blueprint PDF Download',
        user_id: userId,
        idea_id: ideaId,
      };
    } else {
      return NextResponse.json({ error: 'Invalid payment request' }, { status: 400 });
    }

    const paymentResult = await createPayment(paymentData);

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment creation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      payment_url: paymentResult.payment_url,
      transaction_id: paymentResult.transaction_id,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
