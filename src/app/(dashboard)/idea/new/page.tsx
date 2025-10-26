'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NewIdea() {
  const { t } = useTranslation();
  const router = useRouter();
  const [ideaText, setIdeaText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null);

  const handleSubmit = async () => {
    if (!ideaText.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaText,
          language: 'en', // Get from i18n
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else if (data.error) {
        console.error('API Error:', data.error);
        // Show user-friendly error message
        alert('Failed to analyze idea. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing idea:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    // Store idea in localStorage or state management
    localStorage.setItem('currentIdea', JSON.stringify({
      text: ideaText,
      analysis,
      timestamp: new Date().toISOString()
    }));
    
    router.push('/questions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('idea.title')}
          </h1>
          <p className="text-gray-600">
            Describe your business idea in detail. The more specific you are, the better we can help you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 shadow-lg">
            <div className="mb-6">
              <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                Your Business Idea
              </label>
              <Textarea
                id="idea"
                placeholder={t('idea.placeholder')}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                className="min-h-[200px] text-lg"
                disabled={isAnalyzing}
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific about your target market, unique value proposition, and business model.
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {ideaText.length} characters
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!ideaText.trim() || isAnalyzing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('idea.analyzing')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Analyze Idea
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                    <Badge variant="secondary" className="text-sm">
                      {analysis.category || 'General'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Market Potential</h4>
                    <Badge 
                      variant={analysis.market_potential === 'high' ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      {analysis.market_potential || 'Medium'}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {analysis.next_steps || analysis.challenges || 'Your idea shows potential. Let\'s refine it further with some targeted questions.'}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    Continue to Questions
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
