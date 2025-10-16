'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Lightbulb, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ResourceManager } from '@/components/admin/ResourceManager';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const stats = {
    totalUsers: 1247,
    totalIdeas: 892,
    totalRevenue: 1784.00,
    completedPaths: 445,
    monthlyGrowth: 23.5
  };

  const recentIdeas = [
    {
      id: '1',
      title: 'AI-Powered Fitness App',
      category: 'Technology',
      user: 'John Doe',
      status: 'completed',
      createdAt: '2024-01-15',
      revenue: 2.00
    },
    {
      id: '2',
      title: 'Sustainable Agriculture Platform',
      category: 'Agriculture',
      user: 'Jane Smith',
      status: 'in_progress',
      createdAt: '2024-01-20',
      revenue: 0.00
    },
    {
      id: '3',
      title: 'Eco-Friendly Packaging',
      category: 'Manufacturing',
      user: 'Mike Johnson',
      status: 'completed',
      createdAt: '2024-01-18',
      revenue: 2.00
    }
  ];

  const resources = [
    {
      id: '1',
      title: 'Business Planning Course',
      type: 'course',
      category: 'Foundation',
      url: 'https://example.com',
      language: 'en'
    },
    {
      id: '2',
      title: 'Marketing Strategy Guide',
      type: 'article',
      category: 'Marketing',
      url: 'https://example.com',
      language: 'en'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.title')}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}! Here's your platform overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{stats.monthlyGrowth}% this month
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ideas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalIdeas.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Paths</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedPaths.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'ideas', label: 'Ideas', icon: Lightbulb },
                { id: 'resources', label: 'Resources', icon: BookOpen },
                { id: 'users', label: 'Users', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'analytics' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart would go here</p>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart would go here</p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'ideas' && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Ideas</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </div>
              <div className="space-y-4">
                {recentIdeas.map((idea) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium text-gray-900">{idea.title}</h4>
                        <Badge variant={idea.status === 'completed' ? 'default' : 'secondary'}>
                          {idea.status}
                        </Badge>
                        <Badge variant="outline">{idea.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        by {idea.user} • {new Date(idea.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">${idea.revenue}</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'resources' && (
            <ResourceManager />
          )}

          {activeTab === 'users' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">User management interface would go here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
