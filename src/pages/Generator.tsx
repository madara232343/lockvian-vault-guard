
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Wand2, 
  Copy, 
  RefreshCw, 
  Shield, 
  Eye, 
  EyeOff,
  Download,
  Share2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Generator = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [options, setOptions] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    pronounceable: false
  });

  const generatePassword = () => {
    let charset = '';
    
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[0oO1lI]/g, '');
    }

    if (charset === '') {
      toast({
        title: "Invalid options",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
      return;
    }

    let newPassword = '';
    
    if (options.pronounceable) {
      // Generate a more pronounceable password
      const consonants = 'bcdfghjklmnpqrstvwxyz';
      const vowels = 'aeiou';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*';
      
      for (let i = 0; i < options.length; i++) {
        if (i % 4 === 0 && options.includeNumbers && Math.random() > 0.7) {
          newPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
        } else if (i % 6 === 0 && options.includeSymbols && Math.random() > 0.8) {
          newPassword += symbols.charAt(Math.floor(Math.random() * symbols.length));
        } else if (i % 2 === 0) {
          let char = consonants.charAt(Math.floor(Math.random() * consonants.length));
          if (options.includeUppercase && Math.random() > 0.7) {
            char = char.toUpperCase();
          }
          newPassword += char;
        } else {
          newPassword += vowels.charAt(Math.floor(Math.random() * vowels.length));
        }
      }
    } else {
      // Generate random password
      for (let i = 0; i < options.length; i++) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }

    setPassword(newPassword);
  };

  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 25;
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/[0-9]/.test(pwd)) score += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    
    if (score >= 90) return { score, label: 'Excellent', color: 'bg-green-500' };
    if (score >= 70) return { score, label: 'Strong', color: 'bg-blue-500' };
    if (score >= 50) return { score, label: 'Medium', color: 'bg-yellow-500' };
    return { score, label: 'Weak', color: 'bg-red-500' };
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied to clipboard",
        description: "Password copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = () => {
    const blob = new Blob([password], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-password.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Password downloaded",
      description: "Password saved as text file.",
    });
  };

  const sharePassword = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Generated Password',
          text: password,
        });
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const strength = password ? calculateStrength(password) : null;

  // Generate initial password
  React.useEffect(() => {
    generatePassword();
  }, []);

  const passwordAnalysis = password ? {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSymbols: /[^A-Za-z0-9]/.test(password),
    length: password.length,
    entropy: Math.log2(Math.pow(
      (options.includeLowercase ? 26 : 0) +
      (options.includeUppercase ? 26 : 0) +
      (options.includeNumbers ? 10 : 0) +
      (options.includeSymbols ? 32 : 0),
      password.length
    ))
  } : null;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Password Generator</h1>
          <p className="text-slate-400 mt-1">Create strong, secure passwords with advanced options</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generated Password */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Wand2 className="h-5 w-5 text-cyan-400" />
                  <span>Generated Password</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your secure password is ready to use
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white font-mono text-lg pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {strength && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Strength</span>
                      <Badge className={`${strength.color} text-white`}>
                        {strength.label} ({strength.score}%)
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button 
                    onClick={generatePassword}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New
                  </Button>
                  <Button variant="outline" onClick={downloadAsFile}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={sharePassword}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Generator Options</CardTitle>
                <CardDescription className="text-slate-400">
                  Customize your password requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Length */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Password Length</Label>
                    <span className="text-cyan-400 font-medium">{options.length}</span>
                  </div>
                  <Slider
                    value={[options.length]}
                    onValueChange={([value]) => setOptions({ ...options, length: value })}
                    min={4}
                    max={128}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                {/* Character Types */}
                <div className="space-y-4">
                  <Label className="text-slate-300">Character Types</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="uppercase" className="text-slate-300">Uppercase (A-Z)</Label>
                      <Switch
                        id="uppercase"
                        checked={options.includeUppercase}
                        onCheckedChange={(checked) => setOptions({ ...options, includeUppercase: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lowercase" className="text-slate-300">Lowercase (a-z)</Label>
                      <Switch
                        id="lowercase"
                        checked={options.includeLowercase}
                        onCheckedChange={(checked) => setOptions({ ...options, includeLowercase: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="numbers" className="text-slate-300">Numbers (0-9)</Label>
                      <Switch
                        id="numbers"
                        checked={options.includeNumbers}
                        onCheckedChange={(checked) => setOptions({ ...options, includeNumbers: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="symbols" className="text-slate-300">Symbols (!@#$)</Label>
                      <Switch
                        id="symbols"
                        checked={options.includeSymbols}
                        onCheckedChange={(checked) => setOptions({ ...options, includeSymbols: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4">
                  <Label className="text-slate-300">Advanced Options</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="exclude-similar" className="text-slate-300">Exclude Similar</Label>
                        <p className="text-xs text-slate-500">Avoid 0, O, 1, l, I</p>
                      </div>
                      <Switch
                        id="exclude-similar"
                        checked={options.excludeSimilar}
                        onCheckedChange={(checked) => setOptions({ ...options, excludeSimilar: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pronounceable" className="text-slate-300">Pronounceable</Label>
                        <p className="text-xs text-slate-500">Easier to remember</p>
                      </div>
                      <Switch
                        id="pronounceable"
                        checked={options.pronounceable}
                        onCheckedChange={(checked) => setOptions({ ...options, pronounceable: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Password Analysis */}
            {passwordAnalysis && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span>Security Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Length</span>
                      <span className="text-white">{passwordAnalysis.length} chars</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Entropy</span>
                      <span className="text-white">{passwordAnalysis.entropy.toFixed(1)} bits</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Character Types Used</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {passwordAnalysis.hasUppercase ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertTriangle className="h-4 w-4 text-slate-500" />
                        }
                        <span className={passwordAnalysis.hasUppercase ? 'text-green-400' : 'text-slate-500'}>
                          Uppercase letters
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {passwordAnalysis.hasLowercase ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertTriangle className="h-4 w-4 text-slate-500" />
                        }
                        <span className={passwordAnalysis.hasLowercase ? 'text-green-400' : 'text-slate-500'}>
                          Lowercase letters
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {passwordAnalysis.hasNumbers ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertTriangle className="h-4 w-4 text-slate-500" />
                        }
                        <span className={passwordAnalysis.hasNumbers ? 'text-green-400' : 'text-slate-500'}>
                          Numbers
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {passwordAnalysis.hasSymbols ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertTriangle className="h-4 w-4 text-slate-500" />
                        }
                        <span className={passwordAnalysis.hasSymbols ? 'text-green-400' : 'text-slate-500'}>
                          Special symbols
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Tips */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Security Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Use unique passwords for every account</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Longer passwords are exponentially stronger</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Mix different character types</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Enable two-factor authentication</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Store passwords in a secure manager</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Generator;
