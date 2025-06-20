
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

  // Simulate user plan (in real app, this would come from user profile)
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
      title: "Quantum Security Score",
      value: `${securityScore}%`,
      description: securityScore >= 80 ? 'Reality Secured' : securityScore >= 60 ? 'Dimension Stable' : 'Portal Vulnerable',
      icon: Shield,
      gradient: securityScore >= 80 ? 'from-green-400 via-emerald-500 to-teal-600' : securityScore >= 60 ? 'from-yellow-400 via-orange-500 to-red-500' : 'from-red-400 via-pink-500 to-purple-600',
      trend: '+5%'
    },
    {
      title: "Neural Keys",
      value: userPlan === 'basic' ? `${stats.totalPasswords}/10` : stats.totalPasswords.toString(),
      description: userPlan === 'basic' ? `${10 - stats.totalPasswords} remaining` : "Unlimited storage",
      icon: Key,
      gradient: 'from-purple-400 via-cyan-500 to-blue-600',
      trend: '+2'
    },
    {
      title: "Weak Portals",
      value: stats.weakPasswords.toString(),
      description: "Need quantum enhancement",
      icon: AlertTriangle,
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      trend: '-1'
    },
    {
      title: "Breach Alerts",
      value: (breachAlerts?.length || 0).toString(),
      description: "Reality distortions",
      icon: Zap,
      gradient: 'from-pink-400 via-purple-500 to-indigo-600',
      trend: '0'
    }
  ];

  const quickActions = [
    {
      title: "Generate Key",
      description: "Create quantum passwords",
      icon: Zap,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      path: "/generator",
      restricted: false
    },
    {
      title: "Add Neural Key",
      description: "Store new credentials",
      icon: Plus,
      gradient: "from-purple-400 via-cyan-500 to-blue-600",
      path: "/vault",
      restricted: userPlan === 'basic' && stats.totalPasswords >= 10
    },
    {
      title: "Reality Check",
      description: "Analyze vulnerabilities",
      icon: Shield,
      gradient: "from-red-400 via-orange-500 to-yellow-600",
      path: "/security",
      restricted: userPlan === 'basic'
    },
    {
      title: "Cosmic Share",
      description: "Collaborate safely",
      icon: Users,
      gradient: "from-pink-400 via-purple-500 to-indigo-600",
      path: "/sharing",
      restricted: !planLimits[userPlan].sharing
    }
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Quantum Welcome Header */}
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Quantum Dashboard
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 blur-2xl -z-10"></div>
          </div>
          <p className="text-xl lg:text-2xl text-white/70">
            Welcome to your interdimensional security command center, {user?.email?.split('@')[0]}
          </p>
          
          {/* Plan Badge */}
          <div className="flex justify-center">
            <Badge className={`px-6 py-3 text-lg font-bold ${
              userPlan === 'basic' ? 'bg-gradient-to-r from-slate-500 to-gray-600' :
              userPlan === 'pro' ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500' :
              'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600'
            }`}>
              <Crown className="mr-2 h-5 w-5" />
              {userPlan === 'basic' ? 'Earthling Plan' : userPlan === 'pro' ? 'Cyborg Plan' : 'Alien Plan'}
            </Badge>
          </div>
        </div>

        {/* Quantum Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:rotate-1" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-white/60">{stat.title}</p>
                      <div className="space-y-2">
                        <p className="text-4xl font-black text-white">{stat.value}</p>
                        <p className="text-sm text-white/60">{stat.description}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-green-400">{stat.trend}</span>
                      </div>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative overflow-hidden`}>
                      <Icon className="h-8 w-8 text-white relative z-10" />
                      <div className="absolute inset-0 bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Neural Keys */}
          <Card className="xl:col-span-2 relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-pink-500/5"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl flex items-center space-x-3">
                    <Key className="h-6 w-6" />
                    <span>Recent Neural Keys</span>
                  </CardTitle>
                  <CardDescription className="text-white/60 text-lg">
                    Your latest quantum credentials
                  </CardDescription>
                </div>
                <Link to="/vault">
                  <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300 hover:scale-105">
                    <Eye className="mr-2 h-4 w-4" />
                    View Portal
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {vaultItems?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Key className="h-10 w-10 text-white/40" />
                    </div>
                    <p className="text-white/60 mb-6 text-xl">No neural keys stored yet</p>
                    <Link to="/vault">
                      <Button className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 transition-all duration-300 hover:scale-105">
                        <Plus className="mr-2 h-5 w-5" />
                        Create Your First Key
                      </Button>
                    </Link>
                  </div>
                ) : (
                  vaultItems?.map((item, index) => (
                    <div key={item.id} className="group flex items-center justify-between p-6 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02]" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center relative overflow-hidden">
                          <Key className="h-7 w-7 text-white relative z-10" />
                          <div className="absolute inset-0 bg-white/20 blur-xl"></div>
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-cyan-400 transition-colors text-lg">{item.title}</p>
                          <p className="text-white/60">{item.website_url || 'No quantum signature'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={item.password_strength >= 80 ? 'default' : item.password_strength >= 60 ? 'secondary' : 'destructive'} className="font-bold px-3 py-1">
                          {item.password_strength >= 80 ? 'Quantum' : item.password_strength >= 60 ? 'Enhanced' : 'Basic'}
                        </Badge>
                        {item.is_favorite && (
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reality Distortions */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-pink-500/5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-white text-2xl flex items-center space-x-3">
                <Activity className="h-6 w-6" />
                <span>Reality Distortions</span>
              </CardTitle>
              <CardDescription className="text-white/60 text-lg">
                Quantum threat monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {breachAlerts?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-green-400 font-bold mb-2 text-lg">Reality Secured!</p>
                    <p className="text-white/60">No quantum threats detected</p>
                  </div>
                ) : (
                  breachAlerts?.map((alert, index) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl" style={{ animationDelay: `${index * 0.1}s` }}>
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">
                          Reality breach: {alert.breach_source}
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          {alert.email} dimension compromised
                        </p>
                        <Badge variant="destructive" className="mt-2 font-bold">
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

        {/* Quantum Actions */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20" style={{ animationDelay: '0.6s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-pink-500/5"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-white text-2xl flex items-center space-x-3">
              <Zap className="h-6 w-6" />
              <span>Quantum Actions</span>
            </CardTitle>
            <CardDescription className="text-white/60 text-lg">
              Reality manipulation tools
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const isRestricted = action.restricted;
                return (
                  <div key={action.title} className="relative">
                    {isRestricted ? (
                      <Card className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/10 opacity-50 cursor-not-allowed" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardContent className="p-6 text-center relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-white/30" />
                          </div>
                          <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-30`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-bold text-white/50 mb-2 text-lg">{action.title}</h3>
                          <p className="text-white/30">{action.description}</p>
                          <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30">
                            Upgrade Required
                          </Badge>
                        </CardContent>
                      </Card>
                    ) : (
                      <Link to={action.path}>
                        <Card className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:rotate-1 cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                          <CardContent className="p-6 text-center relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative overflow-hidden`}>
                              <Icon className="h-8 w-8 text-white relative z-10" />
                              <div className="absolute inset-0 bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                            </div>
                            <h3 className="font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-cyan-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 text-lg">{action.title}</h3>
                            <p className="text-white/60">{action.description}</p>
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
    </Layout>
  );
};

export default Dashboard;
