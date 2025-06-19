import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Brain, Zap, Eye, Users, Smartphone, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
              alt="Lockvian Logo" 
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Lockvian
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Security</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <Link to="/auth">
              <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2">
            🚀 Next-Generation Security
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Password Security
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Redefined
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            Experience zero-knowledge architecture with AI-powered breach anticipation. 
            Your passwords, secured by tomorrow's technology today.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 text-lg">
                <Shield className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
              <Eye className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Revolutionary Features
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Built with cutting-edge technology to provide unparalleled security and user experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">AI Security Intelligence</CardTitle>
              <CardDescription className="text-slate-400">
                SRI technology monitors breach databases and dark web activity to predict threats before they happen
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Zero-Knowledge Architecture</CardTitle>
              <CardDescription className="text-slate-400">
                Client-side AES-256 encryption ensures even we can't access your data. True privacy by design
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-slate-400">
                Password retrieval in under 150ms with support for 1M+ concurrent users
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Biometric Security</CardTitle>
              <CardDescription className="text-slate-400">
                FaceID, fingerprint, and voice recognition with secure local biometric recovery
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Secure Sharing</CardTitle>
              <CardDescription className="text-slate-400">
                QR codes and encrypted links for instant, secure password sharing with expiry controls
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Cross-Platform Sync</CardTitle>
              <CardDescription className="text-slate-400">
                Seamless synchronization across all devices with intelligent offline access and auto-merge
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-6 bg-green-500/10 text-green-400 border-green-500/20">
              🛡️ Military-Grade Security
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Security That Anticipates Tomorrow's Threats
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              While others react to breaches, Lockvian predicts them. Our SRI technology continuously monitors 
              global threat intelligence to protect your credentials before they're compromised.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-slate-300">AES-256-GCM end-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-slate-300">Argon2id password hashing</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-slate-300">Real-time breach anticipation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-slate-300">99.99% uptime SLA guarantee</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-3xl"></div>
            <Card className="relative bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
              <div className="text-center">
                <img 
                  src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
                  alt="Security Shield" 
                  className="w-32 h-32 mx-auto mb-6 opacity-80"
                />
                <h3 className="text-2xl font-bold text-white mb-4">Zero-Knowledge Promise</h3>
                <p className="text-slate-400">
                  Your data is encrypted on your device before it ever reaches our servers. 
                  Not even we can access your passwords.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="text-center py-16 px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Secure Your Future?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join the next generation of password security. Experience AI-powered protection 
              with zero-knowledge privacy.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 text-lg">
                  <Shield className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-slate-700">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
              alt="Lockvian Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Lockvian
            </span>
          </div>
          <p className="text-slate-400">
            © 2025 Lockvian. Next-generation password security for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
