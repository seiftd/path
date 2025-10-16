'use client';

import { useTranslation } from 'react-i18next';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useUser();

  // Mock data - in real app, this would come from API
  const ideas = [
    {
      id: '1',
      title: 'AI-Powered Fitness App',
      category: 'Technology',
      status: 'completed',
      createdAt: '2024-01-15',
      progress: 100
    },
    {
      id: '2',
      title: 'Sustainable Agriculture Platform',
      category: 'Agriculture',
      status: 'in_progress',
      createdAt: '2024-01-20',
      progress: 60
    }
  ];

  const stats = {
    totalIdeas: 2,
    completedPaths: 1,
    totalRevenue: 2.00
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Continue building your ideas into successful businesses.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ideas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalIdeas}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Paths</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedPaths}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/idea/new">
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Start New Idea</span>
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>View Templates</span>
            </Button>
          </div>
        </div>

        {/* Recent Ideas */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Ideas</h2>
          <div className="space-y-4">
            {ideas.map((idea) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                        <Badge variant={idea.status === 'completed' ? 'default' : 'secondary'}>
                          {idea.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Category: {idea.category} • Created: {new Date(idea.createdAt).toLocaleDateString()}
                      </p>
                      {idea.status === 'in_progress' && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${idea.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/path/${idea.id}`}>
                        <Button variant="outline" size="sm">
                          {idea.status === 'completed' ? 'View Report' : 'Continue'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {ideas.length === 0 && (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No ideas yet</h3>
              <p className="text-gray-600 mb-6">
                Start your journey by describing your first business idea.
              </p>
              <Link href="/idea/new">
                <Button>Create Your First Idea</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
