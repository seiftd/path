'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowUp, Lightbulb, Shield, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-4">
              {t('hero.tagline')}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={t('hero.inputPlaceholder')}
                    className="w-full text-lg bg-transparent border-none outline-none placeholder-gray-400"
                  />
                </div>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transform Your Idea Into Action
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform guides you through every step of turning your idea into a structured business plan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your idea and asks intelligent questions to refine your vision.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🌳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Path</h3>
              <p className="text-gray-600">
                Follow your personalized roadmap with interactive visualizations that adapt to your idea.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Report</h3>
              <p className="text-gray-600">
                Download your complete business blueprint as a professional PDF for just $2.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-gray-600 mb-8">Get your complete business blueprint for just $2</p>
          
          <Card className="max-w-md mx-auto p-8 bg-white shadow-lg">
            <div className="text-4xl font-bold text-gray-900 mb-2">$2</div>
            <div className="text-gray-600 mb-6">One-time payment</div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Complete business analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Personalized roadmap
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Resource recommendations
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Professional PDF report
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              Start Your Journey
            </Button>
          </Card>
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
