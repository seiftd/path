'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowUp, Lightbulb, Shield, Menu, X } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ideaInput, setIdeaInput] = useState('');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl text-gray-900">foundyourpath.com</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.pricing')}
            </a>
            <a href="#story" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.ourStory')}
            </a>
            <LanguageSwitcher />
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton>
                  <Button variant="ghost">{t('nav.signIn')}</Button>
                </SignInButton>
                <SignUpButton>
                  <Button>{t('nav.getStarted')}</Button>
                </SignUpButton>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a 
              href="#pricing" 
              className="block text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.pricing')}
            </a>
            <a 
              href="#story" 
              className="block text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.ourStory')}
            </a>
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            {isSignedIn ? (
              <div className="py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex flex-col space-y-3 py-2">
                <SignInButton>
                  <Button variant="ghost" className="w-full justify-start">
                    {t('nav.signIn')}
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full">
                    {t('nav.getStarted')}
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {t('hero.tagline')}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={t('hero.inputPlaceholder')}
                    className="w-full text-lg bg-transparent border-none outline-none placeholder-gray-400"
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && ideaInput.trim()) {
                        if (!isSignedIn) {
                          localStorage.setItem('currentIdea', JSON.stringify({ text: ideaInput }));
                          router.push('/sign-in');
                        } else {
                          localStorage.setItem('currentIdea', JSON.stringify({ text: ideaInput }));
                          router.push('/idea/new');
                        }
                      }
                    }}
                  />
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    if (ideaInput.trim()) {
                      if (!isSignedIn) {
                        localStorage.setItem('currentIdea', JSON.stringify({ text: ideaInput }));
                        router.push('/sign-in');
                      } else {
                        localStorage.setItem('currentIdea', JSON.stringify({ text: ideaInput }));
                        router.push('/idea/new');
                      }
                    }
                  }}
                  disabled={!ideaInput.trim()}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span>{t('hero.brainstormIdeas')}</span>
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>{t('hero.privacyMode')}</span>
                <div className="w-10 h-5 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.aiAnalysis.title')}</h3>
              <p className="text-gray-600">
                {t('features.aiAnalysis.description')}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🌳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.visualPath.title')}</h3>
              <p className="text-gray-600">
                {t('features.visualPath.description')}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.professionalReport.title')}</h3>
              <p className="text-gray-600">
                {t('features.professionalReport.description')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              How Our Monthly Subscription Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              Transform your business ideas into actionable plans with our comprehensive monthly SaaS platform
            </p>
          </div>

          <div className="space-y-20">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="bg-white rounded-3xl p-10 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white mr-6">
                      <span className="text-3xl">💡</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-gray-400">Step 01</span>
                      <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                        Write Your Idea
                      </h3>
                    </div>
                  </div>
                  <p className="text-xl text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    Start with our 7-day free trial! Describe your business idea in detail. Our AI will analyze your concept and understand your vision to provide personalized guidance. No credit card required.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-10 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6">📝</div>
                    <p className="text-gray-600 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                      Idea Input Interface
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <div className="bg-white rounded-3xl p-10 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white mr-6">
                      <span className="text-3xl">🤖</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-gray-400">Step 02</span>
                      <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                        AI Analysis & Questions
                      </h3>
                    </div>
                  </div>
                  <p className="text-xl text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    With your Pro subscription, our advanced AI analyzes up to 50 ideas per month and asks strategic questions to refine your concepts, identify opportunities, and uncover potential challenges.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-10 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6">🧠</div>
                    <p className="text-gray-600 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                      AI Analysis Dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="bg-white rounded-3xl p-10 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white mr-6">
                      <span className="text-3xl">🗺️</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-gray-400">Step 03</span>
                      <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                        Interactive Roadmap
                      </h3>
                    </div>
                  </div>
                  <p className="text-xl text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    Get unlimited personalized, interactive roadmaps that visualize your path to success with clear milestones, timelines, and actionable steps. Export to Excel/CSV for team collaboration.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-10 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6">📊</div>
                    <p className="text-gray-600 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                      Visual Roadmap Interface
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <div className="bg-white rounded-3xl p-10 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white mr-6">
                      <span className="text-3xl">📄</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-gray-400">Step 04</span>
                      <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                        Professional Report
                      </h3>
                    </div>
                  </div>
                  <p className="text-xl text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    Download up to 20 professional PDF reports per month with your Pro subscription. Each report includes comprehensive business blueprints, market analysis, and financial projections. Perfect for investors, partners, and team members.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-10 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-6">📋</div>
                    <p className="text-gray-600 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                      Professional PDF Report
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Why Choose Our SaaS Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              Experience the power of AI-driven business planning with our comprehensive SaaS solution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
              <div className="text-center">
                <div className="text-6xl mb-6">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Instant Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  Get immediate insights and recommendations powered by advanced AI algorithms
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Personalized Results
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  Every roadmap is tailored to your specific industry, market, and business goals
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
              <div className="text-center">
                <div className="text-6xl mb-6">📈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Scalable Solution
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  From startup ideas to enterprise projects, our platform scales with your needs
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
            Unlock the full potential of your business ideas with our comprehensive monthly subscription
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 bg-white shadow-lg border-2 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Free Trial
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <div className="text-gray-600">7 days free trial</div>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>1 idea analysis</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Basic roadmap</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>1 PDF download</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Email support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Start Free Trial
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl border-0 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Pro Monthly
                </h3>
                <div className="text-4xl font-bold mb-2">$20</div>
                <div className="text-blue-100">per month</div>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>50 idea analyses</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Advanced AI insights</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>20 PDF downloads</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Export to Excel/CSV</span>
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  <span>Advanced analytics</span>
                </li>
              </ul>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold">
                Get Started Now
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Found Your Path. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
