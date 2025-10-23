'use client';

import { useState, useEffect } from 'react';
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
  const [projectName, setProjectName] = useState('');
  const [country, setCountry] = useState('');
  const [founderName, setFounderName] = useState('');
  const [email, setEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    // Check if there's a brainstorm idea in localStorage
    const brainstormIdea = localStorage.getItem('selectedBrainstormIdea');
    if (brainstormIdea) {
      try {
        const idea = JSON.parse(brainstormIdea);
        setIdeaText(idea.text || '');
        setProjectName(idea.name || '');
        // Clear it after loading
        localStorage.removeItem('selectedBrainstormIdea');
      } catch (error) {
        console.error('Error loading brainstorm idea:', error);
      }
    }
  }, []);

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else if (data.error) {
        console.error('API Error:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error analyzing idea:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('Google AI API key is not configured')) {
        alert('AI service is not configured. Please contact support or try again later.');
      } else if (errorMessage.includes('Failed to analyze idea')) {
        alert('AI analysis failed. Please try again with a different idea.');
      } else {
        alert(`Error: ${errorMessage}. Please try again.`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    // Store idea in localStorage or state management
    const teamMembersFiltered = teamMembers.filter(member => member.trim() !== '');
    
    localStorage.setItem('currentIdea', JSON.stringify({
      text: ideaText,
      name: projectName,
      country: country,
      founderName: founderName,
      email: email,
      founders: teamMembersFiltered.length > 0 ? teamMembersFiltered : [founderName],
      analysis,
      timestamp: new Date().toISOString(),
      category: analysis?.category || 'General',
      idea_type: analysis?.idea_type || 'General',
      field: analysis?.field || 'General'
    }));
    
    router.push('/questions');
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const updateTeamMember = (index: number, value: string) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
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
            {/* Project Information */}
            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
              
              {/* Project Name */}
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="e.g., Smart Farm Solutions"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isAnalyzing}
                />
              </div>

              {/* Founder Name */}
              <div>
                <label htmlFor="founderName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  id="founderName"
                  type="text"
                  placeholder="Your full name"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isAnalyzing}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isAnalyzing}
                />
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  id="country"
                  type="text"
                  placeholder="e.g., Egypt, UAE, Saudi Arabia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isAnalyzing}
                />
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members (Optional)
                </label>
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Team member ${index + 1}`}
                      value={member}
                      onChange={(e) => updateTeamMember(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isAnalyzing}
                    />
                    {teamMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeTeamMember(index)}
                        disabled={isAnalyzing}
                        className="px-3"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTeamMember}
                  disabled={isAnalyzing}
                  className="mt-2"
                >
                  + Add Team Member
                </Button>
              </div>
            </div>

            {/* Business Idea */}
            <div className="mb-6">
              <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
                Your Business Idea *
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
                disabled={!ideaText.trim() || !projectName.trim() || !founderName.trim() || !email.trim() || !country.trim() || isAnalyzing}
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
                    <h4 className="font-medium text-gray-900 mb-2">Idea Type</h4>
                    <Badge variant="secondary" className="text-sm">
                      {analysis.idea_type || analysis.category || 'General'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Field/Industry</h4>
                    <Badge variant="outline" className="text-sm">
                      {analysis.field || 'Technology'}
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
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                    <Badge variant="secondary" className="text-sm">
                      {analysis.category || 'General'}
                    </Badge>
                  </div>
                </div>

                {(analysis.competitors && analysis.competitors.length > 0) && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Potential Competitors</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.competitors.map((competitor: string, index: number) => (
                        <Badge key={index} variant="destructive" className="text-sm">
                          {competitor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

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
