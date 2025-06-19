
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useEncryption } from '@/contexts/EncryptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Plus, 
  Copy, 
  QrCode, 
  Clock, 
  Eye, 
  Users,
  Mail,
  Key,
  Calendar,
  Trash2,
  ExternalLink
} from 'lucide-react';

const Sharing = () => {
  const { user } = useAuth();
  const { encrypt } = useEncryption();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedVaultItem, setSelectedVaultItem] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [expirationHours, setExpirationHours] = useState('24');
  const [maxAccess, setMaxAccess] = useState('1');

  const { data: vaultItems = [] } = useQuery({
    queryKey: ['vault-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('password_vault')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: sharedItems = [] } = useQuery({
    queryKey: ['shared-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('password_shares')
        .select(`
          *,
          password_vault:vault_id (
            title,
            website_url,
            username
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const createShareMutation = useMutation({
    mutationFn: async ({
      vaultId,
      email,
      expirationHours,
      maxAccessCount
    }: {
      vaultId: string;
      email: string;
      expirationHours: number;
      maxAccessCount: number;
    }) => {
      const accessToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expirationHours);

      const { data, error } = await supabase
        .from('password_shares')
        .insert({
          vault_id: vaultId,
          shared_by: user!.id,
          shared_with_email: email,
          access_token: accessToken,
          expires_at: expiresAt.toISOString(),
          max_access_count: maxAccessCount
        })
        .select(`
          *,
          password_vault:vault_id (
            title,
            website_url,
            username
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shared-items'] });
      setShowShareDialog(false);
      resetForm();
      
      const shareUrl = `${window.location.origin}/share/${data.access_token}`;
      
      toast({
        title: "Password shared successfully!",
        description: "Share link has been created and copied to clipboard.",
      });

      navigator.clipboard.writeText(shareUrl);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to share password",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteShareMutation = useMutation({
    mutationFn: async (shareId: string) => {
      const { error } = await supabase
        .from('password_shares')
        .delete()
        .eq('id', shareId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-items'] });
      toast({
        title: "Share link deleted",
        description: "The shared password link has been revoked.",
      });
    }
  });

  const resetForm = () => {
    setSelectedVaultItem('');
    setShareEmail('');
    setExpirationHours('24');
    setMaxAccess('1');
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVaultItem || !shareEmail) {
      toast({
        title: "Missing information",
        description: "Please select a password and enter an email address.",
        variant: "destructive",
      });
      return;
    }

    createShareMutation.mutate({
      vaultId: selectedVaultItem,
      email: shareEmail,
      expirationHours: parseInt(expirationHours),
      maxAccessCount: parseInt(maxAccess)
    });
  };

  const copyShareLink = (token: string) => {
    const shareUrl = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard.",
    });
  };

  const generateQRCode = (token: string) => {
    const shareUrl = `${window.location.origin}/share/${token}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>QR Code - Lockvian</title></head>
          <body style="display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #1e293b; color: white; font-family: system-ui;">
            <div style="text-align: center;">
              <h2 style="margin-bottom: 20px;">Scan to Access Shared Password</h2>
              <img src="${qrUrl}" alt="QR Code" style="border-radius: 8px;" />
              <p style="margin-top: 20px; font-size: 14px; color: #94a3b8;">Scan this code with your mobile device</p>
            </div>
          </body>
        </html>
      `);
    }
  };

  const getStatusBadge = (share: any) => {
    const now = new Date();
    const expiresAt = new Date(share.expires_at);
    
    if (share.access_count >= share.max_access_count) {
      return <Badge variant="secondary">Used</Badge>;
    }
    
    if (now > expiresAt) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    return <Badge className="bg-green-500">Active</Badge>;
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Secure Sharing</h1>
            <p className="text-slate-400 mt-1">Share passwords securely with time-limited access</p>
          </div>
          <Dialog open={showShareDialog} onOpenChange={(open) => {
            setShowShareDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Share Password
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Share Password Securely</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Create a secure, time-limited link to share a password
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleShare} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vault-item">Select Password *</Label>
                  <Select value={selectedVaultItem} onValueChange={setSelectedVaultItem}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Choose a password to share" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {vaultItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center space-x-2">
                            <Key className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="share-email">Recipient Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="share-email"
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600"
                      placeholder="recipient@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiration">Expires in</Label>
                    <Select value={expirationHours} onValueChange={setExpirationHours}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="72">3 days</SelectItem>
                        <SelectItem value="168">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-access">Max uses</Label>
                    <Select value={maxAccess} onValueChange={setMaxAccess}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1">1 time</SelectItem>
                        <SelectItem value="3">3 times</SelectItem>
                        <SelectItem value="5">5 times</SelectItem>
                        <SelectItem value="10">10 times</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    disabled={createShareMutation.isPending}
                  >
                    {createShareMutation.isPending ? 'Creating...' : 'Create Share Link'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowShareDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Share Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Time-Limited</p>
                  <p className="text-lg font-semibold text-white">Auto-Expires</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">QR Codes</p>
                  <p className="text-lg font-semibold text-white">Mobile Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Zero-Knowledge</p>
                  <p className="text-lg font-semibold text-white">End-to-End</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shared Items */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-cyan-400" />
              <span>Active Shares</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage your shared password links
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sharedItems.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No shared passwords</h3>
                <p className="text-slate-400 mb-6">
                  Start sharing passwords securely with team members or family
                </p>
                <Button 
                  onClick={() => setShowShareDialog(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Share Your First Password
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sharedItems.map((share) => (
                  <div key={share.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-white">
                            {share.password_vault?.title || 'Unknown Password'}
                          </h3>
                          {getStatusBadge(share)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Shared with:</span>
                            <span className="text-white ml-2">{share.shared_with_email}</span>
                          </div>
                          
                          <div>
                            <span className="text-slate-400">Website:</span>
                            <span className="text-white ml-2">
                              {share.password_vault?.website_url || 'N/A'}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-slate-400">Expires:</span>
                            <span className="text-white ml-2">
                              {new Date(share.expires_at).toLocaleString()}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-slate-400">Used:</span>
                            <span className="text-white ml-2">
                              {share.access_count} / {share.max_access_count}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          Created: {new Date(share.created_at).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyShareLink(share.access_token)}
                          title="Copy share link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => generateQRCode(share.access_token)}
                          title="Generate QR code"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Are you sure you want to revoke this share link?')) {
                              deleteShareMutation.mutate(share.id);
                            }
                          }}
                          title="Delete share"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sharing Guidelines */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Secure Sharing Guidelines</CardTitle>
            <CardDescription className="text-slate-400">
              Best practices for sharing passwords safely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-white font-semibold">✅ Do:</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Use short expiration times (1-24 hours)</li>
                  <li>• Limit access to 1-3 uses maximum</li>
                  <li>• Verify the recipient's email address</li>
                  <li>• Revoke links after use</li>
                  <li>• Use QR codes for mobile sharing</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-white font-semibold">❌ Don't:</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Share sensitive business passwords</li>
                  <li>• Use long expiration times</li>
                  <li>• Send links through unsecured channels</li>
                  <li>• Share the same password multiple times</li>
                  <li>• Forget to monitor share usage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sharing;
