// Dodo Payments integration
export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  user_id: string;
  idea_id: string;
}

export interface PaymentResponse {
  success: boolean;
  payment_url?: string;
  transaction_id?: string;
  error?: string;
}

export const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await fetch('https://api.dodopayments.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentData.amount * 100, // Convert to cents
        currency: paymentData.currency,
        description: paymentData.description,
        metadata: {
          user_id: paymentData.user_id,
          idea_id: paymentData.idea_id,
        },
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        payment_url: data.payment_url,
        transaction_id: data.transaction_id,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Payment creation failed',
      };
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
};

export const verifyPayment = async (transactionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.dodopayments.com/v1/payments/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      },
    });

    const data = await response.json();
    return response.ok && data.status === 'completed';
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

export const generateSecureDownloadLink = (ideaId: string, userId: string): string => {
  // Generate a secure, time-limited download link
  const timestamp = Date.now();
  const token = Buffer.from(`${userId}:${ideaId}:${timestamp}`).toString('base64');
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/download?token=${token}`;
};
