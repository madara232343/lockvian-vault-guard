
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
  Eye,
  Zap,
  Users,
  Activity,
  Clock,
  Star,
  ArrowRight
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
          duplicatePasswords: 0,
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

  const statCards = [
    {
      title: "Security Score",
      value: `${securityScore}%`,
      description: securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Needs Attention',
      icon: Shield,
      gradient: securityScore >= 80 ? 'from-green-500 to-emerald-500' : securityScore >= 60 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-pink-500',
      trend: '+5%'
    },
    {
      title: "Total Passwords",
      value: stats.totalPasswords.toString(),
      description: "Stored securely",
      icon: Key,
      gradient: 'from-blue-500 to-cyan-500',
      trend: '+2'
    },
    {
      title: "Weak Passwords",
      value: stats.weakPasswords.toString(),
      description: "Need updating",
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-500',
      trend: '-1'
    },
    {
      title: "Breach Alerts",
      value: (breachAlerts?.length || 0).toString(),
      description: "Active alerts",
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      trend: '0'
    }
  ];

  const quickActions = [
    {
      title: "Generate Password",
      description: "Create strong passwords",
      icon: Zap,
      gradient: "from-green-500 to-emerald-500",
      path: "/generator"
    },
    {
      title: "Add Password",
      description: "Store new credentials",
      icon: Plus,
      gradient: "from-blue-500 to-cyan-500",
      path: "/vault"
    },
    {
      title: "Security Check",
      description: "Analyze vulnerabilities",
      icon: Shield,
      gradient: "from-red-500 to-orange-500",
      path: "/security"
    },
    {
      title: "Share Securely",
      description: "Collaborate safely",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      path: "/sharing"
    }
  ];

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-up">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-slate-400 text-lg">
              Your digital security command center
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/vault">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg h-12 px-6">
                <Plus className="mr-2 h-5 w-5" />
                Add Password
              </Button>
            </Link>
            <Link to="/generator">
              <Button variant="outline" className="h-12 px-6 border-slate-600 hover:bg-slate-800/50">
                <Zap className="mr-2 h-5 w-5" />
                Generate
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="group bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                      <div className="space-y-1">
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-slate-400">{stat.description}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-green-400">{stat.trend}</span>
                      </div>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative`}>
                      <Icon className="h-7 w-7 text-white" />
                      <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:blur-lg transition-all duration-300"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Passwords - Takes 2 columns */}
          <Card className="xl:col-span-2 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-xl flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>Recent Passwords</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Your latest saved credentials
                  </CardDescription>
                </div>
                <Link to="/vault">
                  <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300">
                    <Eye className="mr-2 h-4 w-4" />
                    View All
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vaultItems?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Key className="h-8 w-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400 mb-4 text-lg">No passwords saved yet</p>
                    <Link to="/vault">
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Password
                      </Button>
                    </Link>
                  </div>
                ) : (
                  vaultItems?.map((item, index) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02]" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center relative">
                          <Key className="h-6 w-6 text-white" />
                          <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm"></div>
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">{item.title}</p>
                          <p className="text-sm text-slate-400">{item.website_url || 'No URL'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={item.password_strength >= 80 ? 'default' : item.password_strength >= 60 ? 'secondary' : 'destructive'} className="font-medium">
                          {item.password_strength >= 80 ? 'Strong' : item.password_strength >= 60 ? 'Medium' : 'Weak'}
                        </Badge>
                        {item.is_favorite && (
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Alerts */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Security Alerts</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time threat monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {breachAlerts?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-green-400 font-medium mb-2">All Clear!</p>
                    <p className="text-slate-400 text-sm">No security threats detected</p>
                  </div>
                ) : (
                  breachAlerts?.map((alert, index) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl" style={{ animationDelay: `${index * 0.1}s` }}>
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
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
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Common tasks and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} to={action.path}>
                    <Card className="group bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CardContent className="p-6 text-center">
                        <div className={`w-14 h-14 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative`}>
                          <Icon className="h-7 w-7 text-white" />
                          <div className="absolute inset-0 bg-white/10 rounded-xl blur-sm group-hover:blur-lg transition-all duration-300"></div>
                        </div>
                        <h3 className="font-medium text-white mb-2 group-hover:text-cyan-400 transition-colors">{action.title}</h3>
                        <p className="text-sm text-slate-400">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
