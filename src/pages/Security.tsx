
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Clock, 
  Globe, 
  RefreshCw,
  Eye,
  TrendingUp,
  Database,
  Lock
} from 'lucide-react';

const Security = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [scanningBreaches, setScanningBreaches] = useState(false);

  const { data: vaultItems = [] } = useQuery({
    queryKey: ['vault-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('password_vault')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: breachAlerts = [] } = useQuery({
    queryKey: ['breach-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breach_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: securityLogs = [] } = useQuery({
    queryKey: ['security-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const acknowledgeBreachMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('breach_alerts')
        .update({ is_acknowledged: true })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breach-alerts'] });
      toast({
        title: "Alert acknowledged",
        description: "The breach alert has been marked as resolved.",
      });
    }
  });

  // Calculate security metrics
  const securityMetrics = React.useMemo(() => {
    const total = vaultItems.length;
    const weak = vaultItems.filter(item => item.password_strength < 60).length;
    const medium = vaultItems.filter(item => item.password_strength >= 60 && item.password_strength < 80).length;
    const strong = vaultItems.filter(item => item.password_strength >= 80).length;
    const breached = vaultItems.filter(item => item.breach_detected).length;
    const reused = 0; // Would need duplicate detection logic
    const old = vaultItems.filter(item => {
      const monthsOld = (new Date().getTime() - new Date(item.updated_at).getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsOld > 6;
    }).length;

    const overallScore = Math.max(0, 100 - (weak * 20) - (breached * 30) - (reused * 15) - (old * 5));

    return {
      total,
      weak,
      medium,
      strong,
      breached,
      reused,
      old,
      overallScore
    };
  }, [vaultItems]);

  const simulateBreachScan = async () => {
    setScanningBreaches(true);
    
    // Simulate API call to breach detection service
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate finding a breach for demo purposes
    if (Math.random() > 0.7 && vaultItems.length > 0) {
      const randomItem = vaultItems[Math.floor(Math.random() * vaultItems.length)];
      
      await supabase.from('breach_alerts').insert({
        user_id: user!.id,
        email: randomItem.username || user!.email!,
        breach_source: 'LinkedIn Data Breach 2023',
        breach_date: new Date().toISOString(),
        severity: 'high'
      });
      
      queryClient.invalidateQueries({ queryKey: ['breach-alerts'] });
      
      toast({
        title: "Breach detected!",
        description: "We found your credentials in a recent data breach.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "No breaches found",
        description: "Your credentials are safe from known breaches.",
      });
    }
    
    setScanningBreaches(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Security Center</h1>
            <p className="text-slate-400 mt-1">Monitor and improve your digital security posture</p>
          </div>
          <Button 
            onClick={simulateBreachScan}
            disabled={scanningBreaches}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            {scanningBreaches ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Scan for Breaches
              </>
            )}
          </Button>
        </div>

        {/* Security Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Security Score</CardTitle>
              <CardDescription className="text-slate-400">
                Overall security health
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>
                <div 
                  className={`absolute inset-0 rounded-full border-8 border-transparent ${getScoreBg(securityMetrics.overallScore)}`}
                  style={{
                    background: `conic-gradient(from 0deg, currentColor ${securityMetrics.overallScore * 3.6}deg, transparent ${securityMetrics.overallScore * 3.6}deg)`
                  }}
                ></div>
                <div className="absolute inset-4 bg-slate-800 rounded-full flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(securityMetrics.overallScore)}`}>
                    {securityMetrics.overallScore}
                  </span>
                </div>
              </div>
              <div>
                <p className={`text-lg font-semibold ${getScoreColor(securityMetrics.overallScore)}`}>
                  {securityMetrics.overallScore >= 80 ? 'Excellent' : 
                   securityMetrics.overallScore >= 60 ? 'Good' : 'Needs Attention'}
                </p>
                <p className="text-sm text-slate-400">
                  Based on {securityMetrics.total} passwords
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Security Breakdown</CardTitle>
              <CardDescription className="text-slate-400">
                Detailed analysis of your password security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">{securityMetrics.strong}</div>
                  <div className="text-sm text-slate-400">Strong</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-400">{securityMetrics.medium}</div>
                  <div className="text-sm text-slate-400">Medium</div>
                </div>
                
                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="text-2xl font-bold text-red-400">{securityMetrics.weak}</div>
                  <div className="text-sm text-slate-400">Weak</div>
                </div>
                
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">{securityMetrics.breached}</div>
                  <div className="text-sm text-slate-400">Breached</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Issues */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                <span>Security Issues</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Items requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityMetrics.weak > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-white font-medium">Weak Passwords</p>
                      <p className="text-sm text-slate-400">{securityMetrics.weak} passwords need strengthening</p>
                    </div>
                  </div>
                  <Badge variant="destructive">High</Badge>
                </div>
              )}

              {securityMetrics.breached > 0 && (
                <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">Breached Passwords</p>
                      <p className="text-sm text-slate-400">{securityMetrics.breached} passwords found in breaches</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
              )}

              {securityMetrics.old > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">Old Passwords</p>
                      <p className="text-sm text-slate-400">{securityMetrics.old} passwords haven't been changed in 6+ months</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
              )}

              {securityMetrics.weak === 0 && securityMetrics.breached === 0 && securityMetrics.old === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 font-medium mb-2">All Clear!</p>
                  <p className="text-slate-400 text-sm">No security issues detected</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Breach Alerts */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="h-5 w-5 text-red-400" />
                <span>Breach Alerts</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time monitoring results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {breachAlerts.filter(alert => !alert.is_acknowledged).length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 font-medium mb-2">No Active Alerts</p>
                  <p className="text-slate-400 text-sm">Your credentials are secure</p>
                </div>
              ) : (
                breachAlerts
                  .filter(alert => !alert.is_acknowledged)
                  .slice(0, 3)
                  .map((alert) => (
                    <div key={alert.id} className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium">{alert.breach_source}</p>
                          <p className="text-sm text-slate-400 mt-1">
                            {alert.email} may be compromised
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive">
                            {alert.severity}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeBreachMutation.mutate(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Activity Log */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span>Recent Security Activity</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monitor access and security events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {securityLogs.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No security events recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {securityLogs.map((log) => {
                  // Type assertion for details object
                  const details = log.details as { ip_address?: string } | null;
                  
                  return (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <div>
                          <p className="text-white font-medium">
                            {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">
                          {details?.ip_address || 'Unknown IP'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Security;
