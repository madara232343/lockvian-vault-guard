
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Eye, EyeOff, Mail, User, ArrowLeft, Zap, Brain, Key } from 'lucide-react';

const Auth = () => {
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  
  const [resetEmail, setResetEmail] = useState('');
  const [activeTab, setActiveTab] = useState('signin');

  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setActiveTab('reset');
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(signInData.email, signInData.password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (signUpData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(signUpData.email, signUpData.password, signUpData.fullName);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(resetEmail);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, text: "Zero-knowledge encryption" },
    { icon: Brain, text: "AI-powered security" },
    { icon: Zap, text: "Instant synchronization" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-cyber-grid bg-cyber-grid opacity-10 animate-pulse-slow"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-gradient-shift bg-[length:400%_400%]"></div>
      
      <div className="relative flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900/50 to-blue-900/50 backdrop-blur-sm">
          <div className="flex flex-col justify-center px-12 xl:px-20">
            <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-12 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            
            <div className="mb-8 animate-slide-in-left">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
                    alt="Lockvian Logo" 
                    className="w-16 h-16 animate-float"
                  />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-glow"></div>
                </div>
                <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Lockvian
                </span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                Secure Your Digital Life
                <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Join thousands of users who trust Lockvian with their most sensitive data. 
                Experience next-generation password security today.
              </p>
            </div>

            <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="text-lg text-slate-300 group-hover:text-white transition-colors duration-300">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-slide-in-right">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors duration-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
                  alt="Lockvian Logo" 
                  className="w-10 h-10"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Lockvian
                </span>
              </div>
            </div>

            <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in shadow-2xl shadow-cyan-500/25">
                  <Key className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-white text-2xl lg:text-3xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-slate-400 text-lg">
                  Secure access to your digital vault
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
                    <TabsTrigger 
                      value="signin" 
                      className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 transition-all duration-300"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 transition-all duration-300"
                    >
                      Sign Up
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reset" 
                      className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 transition-all duration-300"
                    >
                      Reset
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-6 mt-8">
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-slate-300 font-medium">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signInData.email}
                            onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                            className="pl-11 h-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-slate-300 font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={signInData.password}
                            onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                            className="pl-11 pr-11 h-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-[1.02] shadow-lg text-base font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Signing In...
                          </>
                        ) : (
                          'Sign In to Your Vault'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6 mt-8">
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-slate-300 font-medium">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={signUpData.fullName}
                            onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})}
                            className="pl-11 h-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-slate-300 font-medium">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                            className="pl-11 h-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-slate-300 font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                            className="pl-11 pr-11 h-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm" className="text-slate-300 font-medium">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                          <Input
                            id="signup-confirm"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={signUpData.confirmPassword}
                            onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                            className="pl-11 h-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        variant="premium"
                        className="w-full h-12 transition-all duration-300 hover:scale-[1.02] shadow-lg text-base font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Account...
                          </>
                        ) : (
                          'Create Your Secure Vault'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="reset" className="space-y-6 mt-8">
                    <form onSubmit={handleReset} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email" className="text-slate-300 font-medium">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pl-11 h-12 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        variant="success"
                        className="w-full h-12 transition-all duration-300 hover:scale-[1.02] shadow-lg text-base font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending Reset Email...
                          </>
                        ) : (
                          'Send Reset Instructions'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <p className="text-center text-slate-500 text-sm mt-6">
              By continuing, you agree to our{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
