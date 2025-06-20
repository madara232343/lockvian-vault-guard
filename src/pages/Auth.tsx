
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-cyan-950 flex items-center justify-center">
        <div className="flex items-center space-x-4 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <span className="text-xl">Accessing Quantum Dimension...</span>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-cyan-950 overflow-hidden relative">
      {/* Revolutionary Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 animate-gradient-x"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative flex min-h-screen">
        {/* Left Side - Revolutionary Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-12 transition-all duration-300 hover:scale-105 group">
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Return to Reality
            </Link>
            
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <Shield className="h-10 w-10 text-white relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-2xl animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Enter The
                <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  Quantum Realm
                </span>
              </h1>
              
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Transcend digital boundaries and access security beyond human comprehension.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Brain, text: "Neural-linked Authentication", gradient: "from-purple-500 to-pink-500" },
                { icon: Zap, text: "Quantum Speed Access", gradient: "from-cyan-500 to-blue-500" },
                { icon: Shield, text: "Interdimensional Security", gradient: "from-green-500 to-emerald-500" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 relative overflow-hidden`}>
                      <Icon className="h-7 w-7 text-white" />
                      <div className="absolute inset-0 bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    </div>
                    <span className="text-lg text-white/80 group-hover:text-white transition-colors duration-300">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Portal */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors duration-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Reality
              </Link>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  QuantumVault
                </span>
              </div>
            </div>

            <Card className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-pink-500/10"></div>
              
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 relative overflow-hidden group">
                  <Key className="h-12 w-12 text-white group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                </div>
                <CardTitle className="text-white text-3xl font-black mb-3">Access Portal</CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  Enter your quantum credentials
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
                    <TabsTrigger 
                      value="signin" 
                      className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/30 data-[state=active]:to-cyan-500/30 transition-all duration-300 rounded-lg"
                    >
                      Portal Entry
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/30 data-[state=active]:to-pink-500/30 transition-all duration-300 rounded-lg"
                    >
                      Join Realm
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reset" 
                      className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/30 data-[state=active]:to-purple-500/30 transition-all duration-300 rounded-lg"
                    >
                      Recovery
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-6 mt-8">
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="signin-email" className="text-white/90 font-medium text-lg">Quantum Email</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="your@quantum.email"
                            value={signInData.email}
                            onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                            className="pl-12 h-14 bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 rounded-xl text-lg"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="signin-password" className="text-white/90 font-medium text-lg">Neural Key</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your neural key"
                            value={signInData.password}
                            onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                            className="pl-12 pr-12 h-14 bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 rounded-xl text-lg"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-white/40 hover:text-white/80 transition-colors duration-300"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-14 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-purple-500/50 text-lg font-semibold rounded-xl"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                            Accessing Portal...
                          </>
                        ) : (
                          'Enter Quantum Realm'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6 mt-8">
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="signup-name" className="text-white/90 font-medium text-lg">Human Identity</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-4 h-5 w-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Your earthly name"
                            value={signUpData.fullName}
                            onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})}
                            className="pl-12 h-14 bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 rounded-xl text-lg"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="signup-email" className="text-white/90 font-medium text-lg">Quantum Email</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your@quantum.email"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                            className="pl-12 h-14 bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 rounded-xl text-lg"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="signup-password" className="text-white/90 font-medium text-lg">Neural Key</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create your neural key"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                            className="pl-12 pr-12 h-14 bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 rounded-xl text-lg"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-white/40 hover:text-white/80 transition-colors duration-300"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="signup-confirm" className="text-white/90 font-medium text-lg">Confirm Neural Key</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                          <Input
                            id="signup-confirm"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your neural key"
                            value={signUpData.confirmPassword}
                            onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                            className="pl-12 h-14 bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 rounded-xl text-lg"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-14 bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 hover:from-cyan-600 hover:via-pink-600 hover:to-purple-600 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-cyan-500/50 text-lg font-semibold rounded-xl"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                            Creating Portal...
                          </>
                        ) : (
                          'Join Quantum Dimension'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="reset" className="space-y-6 mt-8">
                    <form onSubmit={handleReset} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="reset-email" className="text-white/90 font-medium text-lg">Quantum Email</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-white/40 group-focus-within:text-pink-400 transition-colors" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="your@quantum.email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pl-12 h-14 bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 rounded-xl text-lg"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-pink-500/50 text-lg font-semibold rounded-xl"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                            Sending Portal Key...
                          </>
                        ) : (
                          'Send Recovery Portal'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <p className="text-center text-white/50 text-sm mt-6">
              By entering the quantum realm, you agree to transcend{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">reality</a>
              {' '}and accept{' '}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">cosmic responsibility</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
