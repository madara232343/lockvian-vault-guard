
import React, { useEffect, useState } from 'react';
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
  Star,
  ArrowRight,
  Crown,
  Lock,
  Infinity
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

  const [userPlan] = useState<'basic' | 'pro' | 'enterprise'>('pro');

  const planLimits = {
    basic: { passwords: 10, devices: 2, sharing: false, advanced: false },
    pro: { passwords: Infinity, devices: Infinity, sharing: true, advanced: true },
    enterprise: { passwords: Infinity, devices: Infinity, sharing: true, advanced: true }
  };

  const { data: vaultItems } = useQuery({
    queryKey: ['vault-items'],
    queryFn: async () => {
      const limit = userPlan === 'basic' ? 5 : 10;
      const { data, error } = await supabase
        .from('password_vault')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
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
      description: securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Good' : 'Needs Improvement',
      icon: Shield,
      color: securityScore >= 80 ? 'text-green-400' : securityScore >= 60 ? 'text-yellow-400' : 'text-red-400',
      bg: securityScore >= 80 ? 'from-green-500/20 to-emerald-500/20' : securityScore >= 60 ? 'from-yellow-500/20 to-orange-500/20' : 'from-red-500/20 to-pink-500/20',
      trend: '+5%'
    },
    {
      title: "Stored Passwords",
      value: userPlan === 'basic' ? `${stats.totalPasswords}/10` : stats.totalPasswords.toString(),
      description: userPlan === 'basic' ? `${10 - stats.totalPasswords} remaining` : "Unlimited storage",
      icon: Key,
      color: 'text-blue-400',
      bg: 'from-blue-500/20 to-cyan-500/20',
      trend: '+2'
    },
    {
      title: "Weak Passwords",
      value: stats.weakPasswords.toString(),
      description: "Need strengthening",
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'from-orange-500/20 to-yellow-500/20',
      trend: '-1'
    },
    {
      title: "Security Alerts",
      value: (breachAlerts?.length || 0).toString(),
      description: "Active threats",
      icon: Zap,
      color: 'text-purple-400',
      bg: 'from-purple-500/20 to-pink-500/20',
      trend: '0'
    }
  ];

  const quickActions = [
    {
      title: "Generate Password",
      description: "Create strong passwords",
      icon: Zap,
      color: "text-green-400",
      bg: "from-green-500/20 to-emerald-500/20",
      path: "/generator",
      restricted: false
    },
    {
      title: "Add Password",
      description: "Store new credentials",
      icon: Plus,
      color: "text-blue-400",
      bg: "from-blue-500/20 to-cyan-500/20",
      path: "/vault",
      restricted: userPlan === 'basic' && stats.totalPasswords >= 10
    },
    {
      title: "Security Check",
      description: "Analyze vulnerabilities",
      icon: Shield,
      color: "text-red-400",
      bg: "from-red-500/20 to-pink-500/20",
      path: "/security",
      restricted: userPlan === 'basic'
    },
    {
      title: "Share Passwords",
      description: "Collaborate safely",
      icon: Users,
      color: "text-purple-400",
      bg: "from-purple-500/20 to-pink-500/20",
      path: "/sharing",
      restricted: !planLimits[userPlan].sharing
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Manage your passwords securely with VaultVian's advanced protection
          </p>
        </div>
        
        {/* Plan Badge */}
        <div className="flex justify-center">
          <Badge className={`px-6 py-3 text-sm font-semibold rounded-full border ${
            userPlan === 'basic' ? 'bg-slate-700/50 text-white border-slate-600' :
            userPlan === 'pro' ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 border-emerald-500/30' :
            'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30'
          }`}>
            <Crown className="mr-2 h-4 w-4" />
            {userPlan === 'basic' ? 'Basic Plan' : userPlan === 'pro' ? 'Pro Plan' : 'Enterprise Plan'}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.description}</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.bg} rounded-xl flex items-center justify-center border border-white/10`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Passwords */}
        <Card className="xl:col-span-2 bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl flex items-center space-x-2">
                  <Key className="h-5 w-5 text-emerald-400" />
                  <span>Recent Passwords</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your latest stored credentials
                </CardDescription>
              </div>
              <Link to="/vault">
                <Button variant="outline" size="sm" className="border-slate-600 hover:border-emerald-500/50">
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
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <Key className="h-8 w-8 text-emerald-400" />
                  </div>
                  <p className="text-slate-400 mb-4">No passwords stored yet</p>
                  <Link to="/vault">
                    <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Password
                    </Button>
                  </Link>
                </div>
              ) : (
                vaultItems?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 transition-colors border border-slate-600/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-slate-400">{item.website_url || 'No website'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.password_strength >= 80 ? 'default' : item.password_strength >= 60 ? 'secondary' : 'destructive'}>
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
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-400" />
              <span>Security Alerts</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Recent security notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breachAlerts?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="text-green-400 font-semibold mb-1">All Secure!</p>
                  <p className="text-slate-400 text-sm">No security threats detected</p>
                </div>
              ) : (
                breachAlerts?.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        Breach detected: {alert.breach_source}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {alert.email} account compromised
                      </p>
                      <Badge variant="destructive" className="mt-2 text-xs">
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
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const isRestricted = action.restricted;
              return (
                <div key={action.title} className="relative">
                  {isRestricted ? (
                    <Card className="bg-slate-700/30 border-slate-600/30 opacity-50 cursor-not-allowed">
                      <CardContent className="p-4 text-center">
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg">
                          <Lock className="h-6 w-6 text-slate-400" />
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.bg} rounded-lg flex items-center justify-center mx-auto mb-3 opacity-50 border border-white/10`}>
                          <Icon className={`h-6 w-6 ${action.color}`} />
                        </div>
                        <h3 className="font-semibold text-slate-300 mb-1">{action.title}</h3>
                        <p className="text-sm text-slate-400">{action.description}</p>
                        <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30">
                          Upgrade Required
                        </Badge>
                      </CardContent>
                    </Card>
                  ) : (
                    <Link to={action.path}>
                      <Card className="bg-slate-700/50 border-slate-600/50 hover:border-slate-500/50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 bg-gradient-to-br ${action.bg} rounded-lg flex items-center justify-center mx-auto mb-3 border border-white/10 group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-6 w-6 ${action.color}`} />
                          </div>
                          <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                          <p className="text-sm text-slate-400">{action.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
