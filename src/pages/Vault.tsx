
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useEncryption } from '@/contexts/EncryptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Key, 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  Copy, 
  Edit, 
  Trash2, 
  Star,
  Globe,
  Mail,
  Lock,
  Smartphone,
  CreditCard,
  Wifi,
  Database
} from 'lucide-react';

interface VaultItem {
  id: string;
  title: string;
  website_url: string;
  username: string;
  encrypted_password: string;
  encrypted_notes: string;
  category: string;
  is_favorite: boolean;
  password_strength: number;
  breach_detected: boolean;
  created_at: string;
  updated_at: string;
}

const Vault = () => {
  const { user } = useAuth();
  const { encrypt, decrypt, generateMasterKey } = useEncryption();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [masterKey] = useState(() => {
    let key = localStorage.getItem('vault_master_key');
    if (!key) {
      key = generateMasterKey();
      localStorage.setItem('vault_master_key', key);
    }
    return key;
  });

  const [formData, setFormData] = useState({
    title: '',
    website_url: '',
    username: '',
    password: '',
    notes: '',
    category: 'general'
  });

  const categories = [
    { value: 'all', label: 'All Categories', icon: Key },
    { value: 'general', label: 'General', icon: Key },
    { value: 'social', label: 'Social Media', icon: Globe },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'banking', label: 'Banking', icon: CreditCard },
    { value: 'work', label: 'Work', icon: Database },
    { value: 'mobile', label: 'Mobile Apps', icon: Smartphone },
    { value: 'wifi', label: 'Wi-Fi', icon: Wifi },
  ];

  const { data: vaultItems = [], isLoading } = useQuery({
    queryKey: ['vault-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('password_vault')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VaultItem[];
    }
  });

  const addItemMutation = useMutation({
    mutationFn: async (itemData: typeof formData) => {
      const encryptedPassword = await encrypt(itemData.password, masterKey);
      const encryptedNotes = itemData.notes ? await encrypt(itemData.notes, masterKey) : '';
      
      const { data, error } = await supabase
        .from('password_vault')
        .insert({
          user_id: user!.id,
          title: itemData.title,
          website_url: itemData.website_url,
          username: itemData.username,
          encrypted_password: encryptedPassword,
          encrypted_notes: encryptedNotes,
          category: itemData.category,
          password_strength: calculatePasswordStrength(itemData.password)
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-items'] });
      setShowAddDialog(false);
      resetForm();
      toast({
        title: "Password saved",
        description: "Your password has been securely encrypted and stored.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving password",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, itemData }: { id: string; itemData: typeof formData }) => {
      const encryptedPassword = await encrypt(itemData.password, masterKey);
      const encryptedNotes = itemData.notes ? await encrypt(itemData.notes, masterKey) : '';
      
      const { data, error } = await supabase
        .from('password_vault')
        .update({
          title: itemData.title,
          website_url: itemData.website_url,
          username: itemData.username,
          encrypted_password: encryptedPassword,
          encrypted_notes: encryptedNotes,
          category: itemData.category,
          password_strength: calculatePasswordStrength(itemData.password)
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-items'] });
      setEditingItem(null);
      resetForm();
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('password_vault')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-items'] });
      toast({
        title: "Password deleted",
        description: "The password has been permanently removed.",
      });
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      const { error } = await supabase
        .from('password_vault')
        .update({ is_favorite: !isFavorite })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-items'] });
    }
  });

  const calculatePasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    return Math.min(100, score);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} copied successfully.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const copyPassword = async (item: VaultItem) => {
    try {
      const decryptedPassword = await decrypt(item.encrypted_password, masterKey);
      copyToClipboard(decryptedPassword, 'Password');
    } catch (error) {
      toast({
        title: "Decryption failed",
        description: "Unable to decrypt password.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = async (itemId: string, item: VaultItem) => {
    if (showPassword[itemId]) {
      setShowPassword(prev => ({ ...prev, [itemId]: false }));
    } else {
      try {
        const decryptedPassword = await decrypt(item.encrypted_password, masterKey);
        setShowPassword(prev => ({ ...prev, [itemId]: decryptedPassword }));
      } catch (error) {
        toast({
          title: "Decryption failed",
          description: "Unable to decrypt password.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      website_url: '',
      username: '',
      password: '',
      notes: '',
      category: 'general'
    });
  };

  const handleEdit = async (item: VaultItem) => {
    try {
      const decryptedPassword = await decrypt(item.encrypted_password, masterKey);
      const decryptedNotes = item.encrypted_notes ? await decrypt(item.encrypted_notes, masterKey) : '';
      
      setFormData({
        title: item.title,
        website_url: item.website_url || '',
        username: item.username || '',
        password: decryptedPassword,
        notes: decryptedNotes,
        category: item.category
      });
      setEditingItem(item);
    } catch (error) {
      toast({
        title: "Decryption failed",
        description: "Unable to decrypt password for editing.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, itemData: formData });
    } else {
      addItemMutation.mutate(formData);
    }
  };

  const filteredItems = vaultItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.website_url?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Password Vault</h1>
            <p className="text-slate-400 mt-1">Securely store and manage your passwords</p>
          </div>
          <Dialog open={showAddDialog || !!editingItem} onOpenChange={(open) => {
            if (!open) {
              setShowAddDialog(false);
              setEditingItem(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Password
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Password' : 'Add New Password'}</DialogTitle>
                <DialogDescription className="text-slate-400">
                  {editingItem ? 'Update your password details' : 'Store a new password securely in your vault'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., Gmail Account"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username/Email</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-slate-700 border-slate-600 flex-1"
                      placeholder="Enter password"
                      required
                    />
                    <Button type="button" onClick={generatePassword} variant="outline" size="sm">
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Additional notes (optional)"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    disabled={addItemMutation.isPending || updateItemMutation.isPending}
                  >
                    {addItemMutation.isPending || updateItemMutation.isPending ? 
                      'Saving...' : 
                      editingItem ? 'Update Password' : 'Save Password'
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddDialog(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search passwords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vault Items */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading your vault...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Key className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {vaultItems.length === 0 ? 'Your vault is empty' : 'No passwords found'}
              </h3>
              <p className="text-slate-400 mb-6">
                {vaultItems.length === 0 
                  ? 'Start by adding your first password to secure your digital life'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {vaultItems.length === 0 && (
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Password
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => {
              const categoryInfo = categories.find(c => c.value === item.category) || categories[1];
              const CategoryIcon = categoryInfo.icon;
              
              return (
                <Card key={item.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                            {item.is_favorite && (
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            )}
                            <Badge variant={
                              item.password_strength >= 80 ? 'default' :
                              item.password_strength >= 60 ? 'secondary' : 'destructive'
                            }>
                              {item.password_strength >= 80 ? 'Strong' :
                               item.password_strength >= 60 ? 'Medium' : 'Weak'}
                            </Badge>
                            {item.breach_detected && (
                              <Badge variant="destructive">
                                Breach Detected
                              </Badge>
                            )}
                          </div>
                          
                          {item.website_url && (
                            <p className="text-sm text-slate-400">{item.website_url}</p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {item.username && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Username:</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-white font-mono">{item.username}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(item.username || '', 'Username')}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-400">Password:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-white font-mono">
                                  {showPassword[item.id] ? 
                                    showPassword[item.id] : 
                                    '••••••••••••'
                                  }
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => togglePasswordVisibility(item.id, item)}
                                >
                                  {showPassword[item.id] ? 
                                    <EyeOff className="h-3 w-3" /> : 
                                    <Eye className="h-3 w-3" />
                                  }
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyPassword(item)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavoriteMutation.mutate({ 
                            id: item.id, 
                            isFavorite: item.is_favorite 
                          })}
                        >
                          <Star className={`h-4 w-4 ${item.is_favorite ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this password?')) {
                              deleteItemMutation.mutate(item.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Vault;
