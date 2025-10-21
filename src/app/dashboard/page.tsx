'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  FileText, 
  BarChart3, 
  Users, 
  Download, 
  Plus, 
  Crown,
  CheckCircle,
  Clock,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

interface UserSubscription {
  plan: 'free' | 'pro';
  ideasUsed: number;
  pdfsDownloaded: number;
  ideasLimit: number;
  pdfsLimit: number;
  expiresAt?: string;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    ideasUsed: 0,
    pdfsDownloaded: 0,
    ideasLimit: 1,
    pdfsLimit: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    } else if (user) {
      // Fetch real subscription data from database
      fetchSubscription();
    }
  }, [isLoaded, user, router]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/check');
      if (response.ok) {
        const data = await response.json();
        setSubscription({
          plan: data.plan,
          ideasUsed: data.ideas_used || 0,
          pdfsDownloaded: data.pdfs_used || 0,
          ideasLimit: data.ideas_limit || 1,
          pdfsLimit: data.pdfs_limit || 1,
          expiresAt: data.end_date
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Fallback to free plan
      setSubscription({
        plan: 'free',
        ideasUsed: 0,
        pdfsDownloaded: 0,
        ideasLimit: 1,
        pdfsLimit: 1
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isPro = subscription.plan === 'pro';
  const ideasRemaining = subscription.ideasLimit - subscription.ideasUsed;
  const pdfsRemaining = subscription.pdfsLimit - subscription.pdfsDownloaded;

  const features = {
    free: [
      { name: 'Basic AI Analysis', icon: Lightbulb, available: true },
      { name: 'Simple Roadmap', icon: Target, available: true },
      { name: '1 PDF Download', icon: FileText, available: true },
      { name: 'Email Support', icon: Users, available: true },
      { name: 'Advanced Analytics', icon: BarChart3, available: false },
      { name: 'Team Collaboration', icon: Users, available: false },
      { name: 'Export to Excel', icon: Download, available: false },
      { name: 'Priority Support', icon: Zap, available: false }
    ],
    pro: [
      { name: 'Advanced AI Analysis', icon: Lightbulb, available: true },
      { name: 'Interactive Roadmap', icon: Target, available: true },
      { name: '20 PDF Downloads', icon: FileText, available: true },
      { name: 'Priority Support', icon: Users, available: true },
      { name: 'Advanced Analytics', icon: BarChart3, available: true },
      { name: 'Team Collaboration', icon: Users, available: true },
      { name: 'Export to Excel', icon: Download, available: true },
      { name: 'API Access', icon: Zap, available: true }
    ]
  };

  if (!isLoaded || isLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                {isPro ? 'Pro Member' : 'Free Trial'} • Manage your business ideas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant={isPro ? 'default' : 'secondary'}
                className={isPro ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                {isPro ? (
                  <>
                    <Crown className="w-4 h-4 mr-1" />
                    Pro Plan
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-1" />
                    Free Trial
                  </>
                )}
              </Badge>
              {!isPro && (
                <Button 
                  onClick={() => router.push('/subscription/checkout')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Usage Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ideas Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription.ideasUsed}/{subscription.ideasLimit}
                </p>
                <p className="text-xs text-gray-500">
                  {ideasRemaining} remaining
                </p>
              </div>
              <Lightbulb className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">PDFs Downloaded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription.pdfsDownloaded}/{subscription.pdfsLimit}
                </p>
                <p className="text-xs text-gray-500">
                  {pdfsRemaining} remaining
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plan Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isPro ? 'Active' : 'Trial'}
                </p>
                <p className="text-xs text-gray-500">
                  {isPro ? 'Renews monthly' : '7 days left'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              size="lg"
              className="h-20 text-left justify-start"
              onClick={() => router.push('/idea/new')}
              disabled={!isPro && ideasRemaining <= 0}
            >
              <div className="flex items-center">
                <Plus className="w-6 h-6 mr-4" />
                <div>
                  <div className="font-semibold">Analyze New Idea</div>
                  <div className="text-sm opacity-80">
                    {!isPro && ideasRemaining <= 0 
                      ? 'Upgrade to analyze more ideas'
                      : 'Get AI-powered business insights'
                    }
                  </div>
                </div>
              </div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-20 text-left justify-start"
              onClick={() => router.push('/dashboard/ideas')}
            >
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 mr-4" />
                <div>
                  <div className="font-semibold">View All Ideas</div>
                  <div className="text-sm opacity-80">
                    Manage your analyzed ideas
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Your Features
          </h2>
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {features[subscription.plan].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    feature.available 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {feature.available ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium ${
                      feature.available ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {feature.name}
                    </span>
                  </div>
                  <feature.icon className={`w-5 h-5 ${
                    feature.available ? 'text-gray-600' : 'text-gray-300'
                  }`} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upgrade Prompt for Free Users */}
        {!isPro && (
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center">
              <Crown className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Unlock Pro Features
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get unlimited idea analyses, advanced AI insights, team collaboration, 
                and much more with our Pro subscription.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => router.push('/subscription/checkout')}
              >
                Upgrade to Pro - $17/month
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
