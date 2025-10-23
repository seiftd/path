'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Globe, MapPin, ArrowLeft, Lightbulb, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface BrainstormIdea {
  name: string;
  category: string;
  description: string;
  why_it_works: string;
  local_advantage?: string;
}

export default function BrainstormPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'country' | 'global'>('country');
  const [country, setCountry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);

  const popularCountries = [
    'Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar',
    'Jordan', 'Lebanon', 'Morocco', 'Tunisia', 'Algeria',
    'United States', 'United Kingdom', 'Germany', 'France', 'Canada'
  ];

  const handleGenerate = async () => {
    if (mode === 'country' && !country.trim()) {
      alert('Please select or enter a country');
      return;
    }

    setIsGenerating(true);
    setIdeas([]);

    try {
      const response = await fetch('/api/ai/brainstorm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: country || 'Global',
          mode: mode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIdeas(data.ideas || []);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to generate ideas'}`);
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      alert('Failed to generate ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectIdea = (idea: BrainstormIdea) => {
    // Store the idea in localStorage and navigate to analysis page
    localStorage.setItem('selectedBrainstormIdea', JSON.stringify({
      text: `${idea.name}: ${idea.description}`,
      name: idea.name,
      category: idea.category
    }));
    router.push('/idea/new');
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
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              Brainstorm Business Ideas
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Get AI-powered business ideas tailored to your country or explore global opportunities
          </p>
          <Badge className="mt-2 bg-purple-600">Premium Feature</Badge>
        </div>

        {/* Mode Selection */}
        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose Your Mode</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setMode('country')}
              className={`p-6 rounded-lg border-2 transition-all ${
                mode === 'country'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <MapPin className={`w-8 h-8 mb-2 ${mode === 'country' ? 'text-purple-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-lg mb-1">Country-Specific</h3>
              <p className="text-sm text-gray-600">
                Get ideas tailored to your country's market, regulations, and opportunities
              </p>
            </button>

            <button
              onClick={() => setMode('global')}
              className={`p-6 rounded-lg border-2 transition-all ${
                mode === 'global'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Globe className={`w-8 h-8 mb-2 ${mode === 'global' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-lg mb-1">Global Mode</h3>
              <p className="text-sm text-gray-600">
                Explore business ideas that work anywhere in the world
              </p>
            </button>
          </div>

          {/* Country Selection */}
          {mode === 'country' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select or Enter Your Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">-- Select a Country --</option>
                  {popularCountries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="custom">Other (type below)</option>
                </select>
              </div>

              {country === 'custom' && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter your country name"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || (mode === 'country' && !country)}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5 mr-2" />
                Generate 5 Business Ideas
              </>
            )}
          </Button>
        </Card>

        {/* Generated Ideas */}
        {ideas.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                Your Personalized Ideas
              </h2>
            </div>

            {ideas.map((idea, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{idea.name}</h3>
                      <Badge variant="secondary">{idea.category}</Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSelectIdea(idea)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Analyze This Idea
                  </Button>
                </div>

                <p className="text-gray-700 mb-4">{idea.description}</p>

                <div className="space-y-3">
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <p className="text-sm font-semibold text-green-900 mb-1">Why It Works:</p>
                    <p className="text-sm text-green-800">{idea.why_it_works}</p>
                  </div>

                  {idea.local_advantage && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Local Advantage:</p>
                      <p className="text-sm text-blue-800">{idea.local_advantage}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

