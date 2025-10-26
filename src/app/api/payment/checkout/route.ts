import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createPayment } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ideaId } = await request.json();

    if (!ideaId) {
      return NextResponse.json({ error: 'Idea ID is required' }, { status: 400 });
    }

    const paymentData = {
      amount: 2.00,
      currency: 'USD',
      description: 'Business Blueprint PDF Download',
      user_id: userId,
      idea_id: ideaId,
    };

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
