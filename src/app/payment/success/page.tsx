'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const [countdown, setCountdown] = useState(5);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    // Simulate processing time
    const processingTimer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(processingTimer);
  }, [isLoaded]);

  useEffect(() => {
    if (isProcessing) return;

    // Countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isProcessing, router]);

  if (!isLoaded || isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="p-8 max-w-md w-full mx-4 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Your Payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we activate your subscription
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for subscribing to Found Your Path Pro!
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Your Pro Plan includes:
          </h3>
          <ul className="text-left space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
              50 AI-powered idea analyses per month
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
              20 professional PDF downloads
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
              Business Model Canvas integration
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
              Priority support
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
              Advanced analytics and insights
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Redirecting to your dashboard in {countdown} seconds...
        </p>

        <Button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          Go to Dashboard Now
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          A confirmation email has been sent to {user?.emailAddresses[0]?.emailAddress}
        </p>
      </Card>
    </div>
  );
}

