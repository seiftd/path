import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('dodo-signature');

    // Verify webhook signature (implement proper verification)
    // For now, we'll process the webhook
    const event = JSON.parse(body);

    console.log('Dodo subscription webhook received:', event);

    switch (event.type) {
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      case 'subscription.renewed':
        await handleSubscriptionRenewed(event.data);
        break;
      case 'subscription.canceled':
        await handleSubscriptionCanceled(event.data);
        break;
      case 'subscription.payment_failed':
        await handlePaymentFailed(event.data);
        break;
      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(data: any) {
  console.log('Subscription created:', data);
  // Update user subscription status in your database
  // Grant access to Pro features
}

async function handleSubscriptionRenewed(data: any) {
  console.log('Subscription renewed:', data);
  // Extend user subscription period
}

async function handleSubscriptionCanceled(data: any) {
  console.log('Subscription canceled:', data);
  // Revoke Pro access at period end
}

async function handlePaymentFailed(data: any) {
  console.log('Payment failed:', data);
  // Notify user about failed payment
  // Implement retry logic
}
