'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Video, FileText, Wrench, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'course' | 'article' | 'book' | 'tool';
  category: string;
  description: string;
  is_featured: boolean;
  relevanceScore: number;
  reason: string;
}

interface ResourceRecommendationsProps {
  category: string;
  language?: string;
  maxResources?: number;
}

export function ResourceRecommendations({ 
  category, 
  language = 'en', 
  maxResources = 5 
}: ResourceRecommendationsProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [category, language]);

  const loadRecommendations = async () => {
    try {
      const response = await fetch(
        `/api/resources/recommend?type=node&nodeCategory=${category}&language=${language}&limit=${maxResources}`
      );
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error loading resource recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ComponentType> = {
      course: Video,
      article: FileText,
      book: BookOpen,
      tool: Wrench
    };
    return icons[type] || BookOpen;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      course: 'bg-blue-100 text-blue-800 border-blue-200',
      article: 'bg-green-100 text-green-800 border-green-200',
      book: 'bg-purple-100 text-purple-800 border-purple-200',
      tool: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Recommended Resources</h3>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No resources available for this category</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Recommended Resources</h3>
      <p className="text-sm text-gray-600">
        Essential resources to help you with {category}
      </p>
      
      <div className="space-y-3">
        {resources.map((resource, index) => {
          const IconComponent = getTypeIcon(resource.type);
          
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {resource.title}
                      </h4>
                      {resource.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {resource.reason}
                      </span>
                    </div>
                  </div>
                  
                  {resource.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-shrink-0"
                    >
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-xs">Open</span>
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          View All Resources
        </Button>
      </div>
    </div>
  );
}
