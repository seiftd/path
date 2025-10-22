'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Crown,
  LogOut
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface Subscription {
  id: string;
  user_email: string;
  plan: string;
  status: string;
  ideas_limit: number;
  pdfs_limit: number;
  ideas_used: number;
  pdfs_used: number;
  end_date: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subscriptions' | 'activate'>('overview');
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalRevenue: 0
  });
  
  // Activation form
  const [activateEmail, setActivateEmail] = useState('');
  const [activateMonths, setActivateMonths] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'seif0662' && password === 'letmein') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      loadData();
    } else {
      alert('Invalid credentials!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setUsername('');
    setPassword('');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load users
      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);

      // Load subscriptions
      const subsRes = await fetch('/api/admin/subscriptions');
      const subsData = await subsRes.json();
      setSubscriptions(subsData.subscriptions || []);

      // Calculate stats
      const activeSubs = subsData.subscriptions?.filter((s: Subscription) => s.status === 'active') || [];
      setStats({
        totalUsers: usersData.users?.length || 0,
        totalSubscriptions: subsData.subscriptions?.length || 0,
        activeSubscriptions: activeSubs.length,
        totalRevenue: activeSubs.length * 20 // $20 per subscription
      });

    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleActivateSubscription = async () => {
    if (!activateEmail) {
      alert('Please enter an email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/grant-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: activateEmail,
          plan: 'pro',
          months: activateMonths
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`✅ Subscription activated for ${activateEmail}!`);
        setActivateEmail('');
        setActivateMonths(1);
        loadData();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert('❌ Failed to activate subscription');
    }
    setLoading(false);
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('✅ Subscription deleted');
        loadData();
      } else {
        alert('❌ Failed to delete');
      }
    } catch (error) {
      alert('❌ Error deleting subscription');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Found Your Path Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscriptions = subscriptions.filter(s =>
    s.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Found Your Path</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'subscriptions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Subscriptions ({subscriptions.length})
            </button>
            <button
              onClick={() => setActiveTab('activate')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'activate'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Activate Pro
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Subs</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeSubscriptions}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-600" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Subs</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalSubscriptions}</p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-600" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue/Month</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">${stats.totalRevenue}</p>
                  </div>
                  <DollarSign className="w-12 h-12 text-yellow-600" />
                </div>
              </Card>
            </div>

            {/* Recent Subscriptions */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Subscriptions</h2>
              <div className="space-y-3">
                {subscriptions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{sub.user_email}</p>
                      <p className="text-sm text-gray-600">
                        {sub.plan} • {sub.ideas_used}/{sub.ideas_limit} ideas • {sub.pdfs_used}/{sub.pdfs_limit} PDFs
                      </p>
                    </div>
                    <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                      {sub.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={loadData}>
                Refresh
              </Button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{user.id.substring(0, 16)}...</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={loadData}>
                Refresh
              </Button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{sub.user_email}</td>
                        <td className="px-6 py-4">
                          <Badge variant={sub.plan === 'pro' ? 'default' : 'secondary'}>
                            {sub.plan}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {sub.ideas_used}/{sub.ideas_limit} ideas • {sub.pdfs_used}/{sub.pdfs_limit} PDFs
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubscription(sub.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Activate Tab */}
        {activeTab === 'activate' && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activate Pro Subscription</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Email
                  </label>
                  <Input
                    type="email"
                    value={activateEmail}
                    onChange={(e) => setActivateEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (months)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={activateMonths}
                    onChange={(e) => setActivateMonths(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Pro Plan Features:</h3>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>✅ 50 AI idea analyses per month</li>
                    <li>✅ 20 PDF downloads</li>
                    <li>✅ Business Model Canvas integration</li>
                    <li>✅ Priority support</li>
                  </ul>
                </div>

                <Button
                  onClick={handleActivateSubscription}
                  disabled={loading || !activateEmail}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Activating...' : 'Activate Subscription'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

