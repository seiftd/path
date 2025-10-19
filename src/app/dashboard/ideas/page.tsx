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
  Download, 
  Eye,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Plus
} from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  status: 'analyzed' | 'processing' | 'failed';
  createdAt: string;
  analysis?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    roadmap: string[];
  };
}

export default function IdeasPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    } else if (user) {
      // Simulate fetching user ideas
      // In real app, this would come from your database
      setTimeout(() => {
        setIdeas([
          {
            id: '1',
            title: 'AI-Powered Fitness App',
            description: 'A mobile app that uses AI to create personalized workout plans based on user goals and preferences.',
            status: 'analyzed',
            createdAt: '2024-01-15',
            analysis: {
              strengths: ['High market demand', 'Scalable technology'],
              weaknesses: ['High development costs', 'Competitive market'],
              opportunities: ['Growing fitness industry', 'AI advancement'],
              threats: ['Big tech competition', 'Regulatory changes'],
              roadmap: ['MVP development', 'User testing', 'Market launch']
            }
          },
          {
            id: '2',
            title: 'Sustainable Packaging Solution',
            description: 'Eco-friendly packaging materials for e-commerce businesses.',
            status: 'analyzed',
            createdAt: '2024-01-10',
            analysis: {
              strengths: ['Environmental benefits', 'Growing awareness'],
              weaknesses: ['Higher costs', 'Limited suppliers'],
              opportunities: ['Government incentives', 'Consumer demand'],
              threats: ['Economic downturns', 'Regulatory changes'],
              roadmap: ['Material research', 'Pilot program', 'Scale production']
            }
          }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [isLoaded, user, router]);

  const handleDownloadPDF = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/pdf/generate?ideaId=${ideaId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `idea-analysis-${ideaId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <Badge className="bg-green-100 text-green-800">Analyzed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
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
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                  My Ideas
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track your business ideas
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/idea/new')}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Idea
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {ideas.length === 0 ? (
          <Card className="p-12 text-center">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              No Ideas Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by analyzing your first business idea to see it here.
            </p>
            <Button
              onClick={() => router.push('/idea/new')}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Analyze Your First Idea
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {ideas.map((idea) => (
              <Card key={idea.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3" style={{ fontFamily: 'Georgia, serif' }}>
                        {idea.title}
                      </h3>
                      {getStatusBadge(idea.status)}
                    </div>
                    <p className="text-gray-600 mb-3">{idea.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Created {new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {idea.analysis && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {idea.analysis.strengths.map((strength, index) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Weaknesses</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {idea.analysis.weaknesses.map((weakness, index) => (
                          <li key={index}>• {weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/idea/${idea.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {idea.status === 'analyzed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(idea.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Analysis Complete</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
