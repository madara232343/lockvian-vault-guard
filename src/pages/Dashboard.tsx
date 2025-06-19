
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  Plus, 
  TrendingUp, 
  Clock,
  Users,
  Eye,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPasswords: 0,
    weakPasswords: 0,
    duplicatePasswords: 0,
    breachAlerts: 0,
    recentActivity: 0
  });

  const { data: vaultItems } = useQuery({
    queryKey: ['vault-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('password_vault')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: breachAlerts } = useQuery({
    queryKey: ['breach-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breach_alerts')
        .select('*')
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: passwords, error } = await supabase
          .from('password_vault')
          .select('password_strength, breach_detected');

        if (error) throw error;

        const weakCount = passwords?.filter(p => p.password_strength < 60).length || 0;
        const breachCount = passwords?.filter(p => p.breach_detected).length || 0;

        setStats({
          totalPasswords: passwords?.length || 0,
          weakPasswords: weakCount,
          duplicatePasswords: 0, // Would need additional logic to detect duplicates
          breachAlerts: breachCount,
          recentActivity: 5
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const securityScore = Math.max(0, 100 - (stats.weakPasswords * 10) - (stats.breachAlerts * 20));

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-slate-400 mt-1">
              Your digital security command center
            </p>
          </div>
          <Link to="/vault">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Password
            </Button>
          </Link>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Security Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  securityScore >= 80 ? 'bg-green-500/20 text-green-400' :
                  securityScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{securityScore}%</div>
                  <p className="text-xs text-slate-400">
                    {securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Needs Attention'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Total Passwords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Key className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.totalPasswords}</div>
                  <p className="text-xs text-slate-400">Stored securely</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Weak Passwords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.weakPasswords}</div>
                  <p className="text-xs text-slate-400">Need updating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Breach Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{breachAlerts?.length || 0}</div>
                  <p className="text-xs text-slate-400">Active alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Passwords */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Recent Passwords</CardTitle>
                  <CardDescription className="text-slate-400">
                    Your latest saved credentials
                  </CardDescription>
                </div>
                <Link to="/vault">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    <Eye className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vaultItems?.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No passwords saved yet</p>
                    <Link to="/vault">
                      <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Password
                      </Button>
                    </Link>
                  </div>
                ) : (
                  vaultItems?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Key className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.website_url || 'No URL'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.password_strength >= 80 ? 'default' : item.password_strength >= 60 ? 'secondary' : 'destructive'}>
                          {item.password_strength >= 80 ? 'Strong' : item.password_strength >= 60 ? 'Medium' : 'Weak'}
                        </Badge>
                        {item.is_favorite && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Alerts */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Security Alerts</CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time breach monitoring
                  </CardDescription>
                </div>
                <Link to="/security">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {breachAlerts?.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-green-400 font-medium mb-2">All Clear!</p>
                    <p className="text-slate-400 text-sm">No security threats detected</p>
                  </div>
                ) : (
                  breachAlerts?.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Breach detected: {alert.breach_source}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {alert.email} may be compromised
                        </p>
                        <Badge variant="destructive" className="mt-2">
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">
              Common tasks and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/generator">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-slate-600 hover:bg-slate-700/50">
                  <Zap className="h-6 w-6 text-cyan-400" />
                  <span className="text-sm">Generate Password</span>
                </Button>
              </Link>
              
              <Link to="/vault">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-slate-600 hover:bg-slate-700/50">
                  <Plus className="h-6 w-6 text-blue-400" />
                  <span className="text-sm">Add Password</span>
                </Button>
              </Link>
              
              <Link to="/security">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-slate-600 hover:bg-slate-700/50">
                  <Shield className="h-6 w-6 text-green-400" />
                  <span className="text-sm">Security Check</span>
                </Button>
              </Link>
              
              <Link to="/sharing">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-slate-600 hover:bg-slate-700/50">
                  <Users className="h-6 w-6 text-purple-400" />
                  <span className="text-sm">Share Securely</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
