'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TreePath } from '@/components/path-visualizations/TreePath';
import { AssemblyPath } from '@/components/path-visualizations/AssemblyPath';
import { CircuitPath } from '@/components/path-visualizations/CircuitPath';
import { ResourceRecommendations } from '@/components/ResourceRecommendations';

interface PathNode {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  steps: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'course' | 'article' | 'book' | 'tool';
  }>;
}

interface PathData {
  nodes: PathNode[];
  theme?: string;
  category?: string;
  [key: string]: unknown;
}

export default function GeneratePath() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(true);
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);

  useEffect(() => {
    generatePath();
  }, []);

  const generatePath = async () => {
    try {
      // Get idea and answers from localStorage
      const ideaData = JSON.parse(localStorage.getItem('currentIdea') || '{}');
      const answers = JSON.parse(localStorage.getItem('questionAnswers') || '[]');

      // Simulate path generation (in real app, this would call API)
      setTimeout(() => {
        const mockPathData = {
          theme: getThemeFromCategory(ideaData.analysis?.category || 'general'),
          nodes: generateMockNodes(ideaData.analysis?.category || 'general'),
          idea: ideaData.text,
          category: ideaData.analysis?.category || 'general'
        };
        setPathData(mockPathData);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating path:', error);
      setIsGenerating(false);
    }
  };

  const getThemeFromCategory = (category: string) => {
    if (category.toLowerCase().includes('agriculture') || category.toLowerCase().includes('farming')) {
      return 'tree';
    } else if (category.toLowerCase().includes('automotive') || category.toLowerCase().includes('manufacturing')) {
      return 'assembly';
    } else {
      return 'circuit';
    }
  };

  const generateMockNodes = (category: string): PathNode[] => {
    const baseNodes = [
      {
        id: 'foundation',
        title: 'Foundation',
        description: 'Set up the legal and business foundation',
        status: 'not_started' as const,
        steps: [
          'Choose business structure (LLC, Corporation, etc.)',
          'Register your business name',
          'Obtain necessary licenses and permits',
          'Set up business bank account'
        ],
        resources: [
          { title: 'Business Structure Guide', url: '#', type: 'article' as const },
          { title: 'Legal Requirements Course', url: '#', type: 'course' as const }
        ]
      },
      {
        id: 'product',
        title: 'Product Development',
        description: 'Develop your core product or service',
        status: 'not_started' as const,
        steps: [
          'Define your MVP (Minimum Viable Product)',
          'Create product specifications',
          'Develop prototype or beta version',
          'Test with initial users'
        ],
        resources: [
          { title: 'MVP Development Guide', url: '#', type: 'article' as const },
          { title: 'Product Management Course', url: '#', type: 'course' as const }
        ]
      },
      {
        id: 'marketing',
        title: 'Marketing & Sales',
        description: 'Build your customer base and sales process',
        status: 'not_started' as const,
        steps: [
          'Identify your target market',
          'Create marketing strategy',
          'Build brand identity',
          'Launch marketing campaigns'
        ],
        resources: [
          { title: 'Digital Marketing Course', url: '#', type: 'course' as const },
          { title: 'Brand Building Guide', url: '#', type: 'book' as const }
        ]
      },
      {
        id: 'operations',
        title: 'Operations',
        description: 'Set up day-to-day business operations',
        status: 'not_started' as const,
        steps: [
          'Set up operational processes',
          'Hire and train team members',
          'Implement quality control',
          'Establish customer service'
        ],
        resources: [
          { title: 'Operations Management', url: '#', type: 'course' as const },
          { title: 'Team Building Guide', url: '#', type: 'article' as const }
        ]
      },
      {
        id: 'finance',
        title: 'Finance',
        description: 'Manage finances and secure funding',
        status: 'not_started' as const,
        steps: [
          'Create financial projections',
          'Set up accounting system',
          'Secure initial funding',
          'Monitor cash flow'
        ],
        resources: [
          { title: 'Financial Planning Course', url: '#', type: 'course' as const },
          { title: 'Funding Options Guide', url: '#', type: 'article' as const }
        ]
      }
    ];

    return baseNodes;
  };

  const handleNodeClick = (node: PathNode) => {
    setSelectedNode(node);
  };

  const handleNodeComplete = (nodeId: string) => {
    setCompletedNodes(prev => [...prev, nodeId]);
    setPathData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((node: PathNode) => 
          node.id === nodeId ? { ...node, status: 'completed' as const } : node
        )
      };
    });
  };

  const renderPathVisualization = () => {
    if (!pathData) return null;

    switch (pathData.theme) {
      case 'tree':
        return <TreePath nodes={pathData.nodes} onNodeClick={handleNodeClick} completedNodes={completedNodes} />;
      case 'assembly':
        return <AssemblyPath nodes={pathData.nodes} onNodeClick={handleNodeClick} completedNodes={completedNodes} />;
      case 'circuit':
        return <CircuitPath nodes={pathData.nodes} onNodeClick={handleNodeClick} completedNodes={completedNodes} />;
      default:
        return <TreePath nodes={pathData.nodes} onNodeClick={handleNodeClick} completedNodes={completedNodes} />;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Path</h2>
          <p className="text-gray-600">Creating your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('path.title')}
          </h1>
          <p className="text-gray-600">
            {t('path.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Path Visualization */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {pathData?.category} • {pathData?.theme} theme
                </Badge>
                <h2 className="text-xl font-semibold">Your Business Journey</h2>
              </div>
              
              <div className="min-h-[500px] flex items-center justify-center">
                {renderPathVisualization()}
              </div>
            </Card>
          </div>

          {/* Node Details */}
          <div className="lg:col-span-1">
            {selectedNode ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedNode.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedNode.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Action Steps:</h4>
                    <ul className="space-y-2">
                      {selectedNode.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <ResourceRecommendations 
                      category={selectedNode.title}
                      language="en"
                      maxResources={3}
                    />
                  </div>

                  <Button
                    onClick={() => handleNodeComplete(selectedNode.id)}
                    disabled={completedNodes.includes(selectedNode.id)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    {completedNodes.includes(selectedNode.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <Card className="p-6 shadow-lg">
                <div className="text-center text-gray-500">
                  <Circle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Click on a node to see details and resources</p>
                </div>
              </Card>
            )}

            {/* Progress Summary */}
            <Card className="p-6 shadow-lg mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-3">
                {pathData?.nodes.map((node: PathNode) => (
                  <div key={node.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{node.title}</span>
                    {completedNodes.includes(node.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={() => router.push('/pdf/preview')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Generate Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
