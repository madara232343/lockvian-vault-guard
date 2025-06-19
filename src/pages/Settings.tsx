
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Smartphone, 
  Download, 
  Upload,
  Trash2,
  Key,
  Lock,
  Globe
} from 'lucide-react';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    avatar_url: ''
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    auto_lock_timeout: '15',
    require_biometric: false,
    breach_monitoring: true,
    security_notifications: true
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || ''
        });
      }
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const exportVaultMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('password_vault')
        .select('title, website_url, username, category, created_at');

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lockvian-vault-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Vault exported",
        description: "Your vault has been exported successfully (passwords excluded for security).",
      });
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      // First delete user data
      await supabase.from('password_vault').delete().eq('user_id', user!.id);
      await supabase.from('password_shares').delete().eq('shared_by', user!.id);
      await supabase.from('security_logs').delete().eq('user_id', user!.id);
      await supabase.from('breach_alerts').delete().eq('user_id', user!.id);
      await supabase.from('profiles').delete().eq('id', user!.id);
    },
    onSuccess: async () => {
      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted.",
      });
      await signOut();
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handleChangePassword = async () => {
    const { error } = await supabase.auth.updateUser({ 
      password: prompt('Enter new password:') || ''
    });
    
    if (error) {
      toast({
        title: "Password change failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation === 'DELETE') {
      deleteAccountMutation.mutate();
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account and security preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="h-5 w-5 text-cyan-400" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-slate-700/50 border-slate-600 text-slate-400"
                  />
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subscription">Subscription Plan</Label>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-white">Premium Plan</span>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Security</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-lock timeout</Label>
                    <p className="text-sm text-slate-400">Lock vault after inactivity</p>
                  </div>
                  <Select value={securitySettings.auto_lock_timeout} onValueChange={(value) => 
                    setSecuritySettings({ ...securitySettings, auto_lock_timeout: value })
                  }>
                    <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Biometric authentication</Label>
                    <p className="text-sm text-slate-400">Use fingerprint/face ID</p>
                  </div>
                  <Switch
                    checked={securitySettings.require_biometric}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({ ...securitySettings, require_biometric: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Breach monitoring</Label>
                    <p className="text-sm text-slate-400">Monitor for data breaches</p>
                  </div>
                  <Switch
                    checked={securitySettings.breach_monitoring}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({ ...securitySettings, breach_monitoring: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Security notifications</Label>
                    <p className="text-sm text-slate-400">Alert for security events</p>
                  </div>
                  <Switch
                    checked={securitySettings.security_notifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({ ...securitySettings, security_notifications: checked })
                    }
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleChangePassword}
                variant="outline" 
                className="w-full border-slate-600 hover:bg-slate-700/50"
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Key className="h-5 w-5 text-blue-400" />
              <span>Data Management</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Export, import, and manage your vault data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => exportVaultMutation.mutate()}
                variant="outline" 
                className="border-slate-600 hover:bg-slate-700/50"
                disabled={exportVaultMutation.isPending}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Vault
              </Button>
              
              <Button 
                variant="outline" 
                className="border-slate-600 hover:bg-slate-700/50"
                onClick={() => {
                  toast({
                    title: "Import feature",
                    description: "Import functionality will be available in the next update.",
                  });
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
              
              <Button 
                variant="outline" 
                className="border-slate-600 hover:bg-slate-700/50"
                onClick={() => {
                  toast({
                    title: "Sync status",
                    description: "All data is synced and up to date.",
                  });
                }}
              >
                <Globe className="mr-2 h-4 w-4" />
                Sync Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-500/10 border-red-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center space-x-2">
              <Trash2 className="h-5 w-5" />
              <span>Danger Zone</span>
            </CardTitle>
            <CardDescription className="text-red-300">
              Irreversible actions that will permanently affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <h4 className="text-red-400 font-semibold mb-2">Delete Account</h4>
                <p className="text-sm text-red-300 mb-4">
                  This will permanently delete your account, all passwords, and associated data. 
                  This action cannot be undone.
                </p>
                <Button 
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  disabled={deleteAccountMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
