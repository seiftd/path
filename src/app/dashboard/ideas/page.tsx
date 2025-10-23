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
  text: string;
  category: string;
  idea_type: string;
  created_at: string;
  field?: string;
  competitors?: string[];
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
      // Fetch real user ideas from database
      fetchUserIdeas();
    }
  }, [isLoaded, user, router]);

  const fetchUserIdeas = async () => {
    try {
      const response = await fetch('/api/ideas/user');
      if (response.ok) {
        const data = await response.json();
        setIdeas(data.ideas || []);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
      setIdeas([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleViewDetails = (idea: Idea) => {
    // Store idea in localStorage and navigate to path generation
    localStorage.setItem('currentIdea', JSON.stringify({
      id: idea.id,
      text: idea.text,
      analysis: {
        category: idea.category,
        idea_type: idea.idea_type,
        field: idea.field,
        competitors: idea.competitors
      }
    }));
    router.push('/path/generate');
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
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{idea.category}</Badge>
                      <Badge variant="secondary">{idea.idea_type}</Badge>
                      <Badge className="bg-green-100 text-green-800">Analyzed</Badge>
                    </div>
                    <p className="text-gray-900 font-medium mb-3">{idea.text}</p>
                    {idea.field && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Industry:</span> {idea.field}
                      </p>
                    )}
                    {idea.competitors && idea.competitors.length > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Competitors:</span> {idea.competitors.join(', ')}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Created {new Date(idea.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(idea)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to PDF preview
                        localStorage.setItem('currentIdea', JSON.stringify({
                          id: idea.id,
                          text: idea.text,
                          analysis: {
                            category: idea.category,
                            idea_type: idea.idea_type,
                            field: idea.field,
                            competitors: idea.competitors
                          }
                        }));
                        router.push('/pdf/preview');
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
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
