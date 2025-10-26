'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Filter, Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  category: string;
  type: 'course' | 'article' | 'book' | 'tool';
  title: string;
  url: string;
  description: string;
  language: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export function ResourceManager() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, categoryFilter, typeFilter]);

  const loadResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(resource => resource.category === categoryFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(resource => resource.type === typeFilter);
    }

    setFilteredResources(filtered);
  };

  const handleCreateResource = async (resourceData: Partial<Resource>) => {
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData)
      });

      if (response.ok) {
        await loadResources();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const handleUpdateResource = async (id: string, resourceData: Partial<Resource>) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData)
      });

      if (response.ok) {
        await loadResources();
        setEditingResource(null);
      }
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadResources();
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      course: 'bg-blue-100 text-blue-800',
      article: 'bg-green-100 text-green-800',
      book: 'bg-purple-100 text-purple-800',
      tool: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <ResourceForm
              onSubmit={handleCreateResource}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Foundation">Foundation</SelectItem>
              <SelectItem value="Product Development">Product Development</SelectItem>
              <SelectItem value="Marketing & Sales">Marketing & Sales</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                    {resource.is_featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    <Badge className={getTypeColor(resource.type)}>
                      {resource.type}
                    </Badge>
                    <Badge variant="outline">{resource.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{resource.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Language: {resource.language.toUpperCase()}</span>
                    <span>Order: {resource.sort_order}</span>
                    <span>Created: {new Date(resource.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {resource.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingResource(resource)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteResource(resource.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingResource && (
        <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
            </DialogHeader>
            <ResourceForm
              resource={editingResource}
              onSubmit={(data) => handleUpdateResource(editingResource.id, data)}
              onCancel={() => setEditingResource(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ResourceForm({ 
  resource, 
  onSubmit, 
  onCancel 
}: { 
  resource?: Resource | null; 
  onSubmit: (data: Partial<Resource>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    category: resource?.category || '',
    type: resource?.type || 'course',
    title: resource?.title || '',
    url: resource?.url || '',
    description: resource?.description || '',
    language: resource?.language || 'en',
    is_featured: resource?.is_featured || false,
    sort_order: resource?.sort_order || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Foundation">Foundation</SelectItem>
              <SelectItem value="Product Development">Product Development</SelectItem>
              <SelectItem value="Marketing & Sales">Marketing & Sales</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Resource title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData({...formData, url: e.target.value})}
          placeholder="https://example.com"
          type="url"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Resource description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <Input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.is_featured}
          onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
          className="rounded"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Featured Resource
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {resource ? 'Update' : 'Create'} Resource
        </Button>
      </div>
    </form>
  );
}
