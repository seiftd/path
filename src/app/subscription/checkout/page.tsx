'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, CreditCard, Shield, Clock } from 'lucide-react';

export default function SubscriptionCheckout() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('pro');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  const plans = {
    free: {
      name: 'Free Trial',
      price: '$0',
      period: '7 days free trial',
      description: 'Perfect for trying out our platform',
      features: [
        '1 idea analysis',
        'Basic roadmap',
        '1 PDF download',
        'Email support'
      ],
      color: 'from-gray-500 to-gray-600'
    },
    pro: {
      name: 'Pro Monthly',
      price: '$17',
      period: 'per month',
      description: 'Full access to all features',
      features: [
        '50 idea analyses',
        'Advanced AI insights',
        '20 PDF downloads',
        'Priority support',
        'Team collaboration',
        'Export to Excel/CSV',
        'Advanced analytics'
      ],
      color: 'from-blue-600 to-purple-600'
    }
  };

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      if (selectedPlan === 'free') {
        // Redirect to dashboard for free trial
        router.push('/dashboard');
      } else {
        // Create subscription and redirect to payment
        const response = await fetch('/api/subscription/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_email: user.primaryEmailAddress?.emailAddress || '',
            customer_name: user.fullName || 'User'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          window.location.href = data.checkout_url;
        } else {
          // Fallback to direct checkout
          window.location.href = 'https://checkout.dodopayments.com/buy/pdt_gETIuWASgloYg0idOZFcE?quantity=1';
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      // Fallback to direct checkout
      window.location.href = 'https://checkout.dodopayments.com/buy/pdt_gETIuWASgloYg0idOZFcE?quantity=1';
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome, {user.firstName}! Select the plan that works best for you.
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {Object.entries(plans).map(([key, plan]) => (
            <Card
              key={key}
              className={`p-8 cursor-pointer transition-all duration-300 ${
                selectedPlan === key
                  ? 'ring-2 ring-blue-500 shadow-xl'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedPlan(key as 'free' | 'pro')}
            >
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {selectedPlan === key ? (
                    <Check className="w-8 h-8 text-white" />
                  ) : (
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {plan.price}
                </div>
                <div className="text-gray-600 mb-4">{plan.period}</div>
                <p className="text-gray-600 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  {plan.description}
                </p>
                
                <ul className="text-left space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Payment Info */}
        <Card className="p-6 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Secure payment processing</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span>SSL encrypted</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Instant activation</span>
            </div>
          </div>
        </Card>

        {/* Subscribe Button */}
        <div className="text-center">
          <Button
            size="lg"
            className={`w-full md:w-auto px-12 py-4 text-lg font-bold ${
              selectedPlan === 'pro'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
            }`}
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Start ${selectedPlan === 'free' ? 'Free Trial' : 'Pro Subscription'}`
            )}
          </Button>
          
          {selectedPlan === 'free' && (
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Cancel anytime
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
