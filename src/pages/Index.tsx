
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Brain, Zap, Eye, Users, Smartphone, Globe, Check, Star, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI Security Intelligence",
      description: "Advanced threat prediction with machine learning algorithms that analyze millions of breach patterns.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Architecture", 
      description: "Military-grade AES-256 encryption ensures your data remains private, even from us.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description: "Sub-150ms response times with global CDN infrastructure supporting millions of users.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Smartphone,
      title: "Biometric Security",
      description: "Seamless authentication with FaceID, fingerprint, and voice recognition technology.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Secure Collaboration",
      description: "Share passwords securely with teams using encrypted links and QR codes with expiry controls.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Cross-Platform Sync",
      description: "Real-time synchronization across all devices with intelligent offline access and conflict resolution.",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for personal use",
      features: [
        "Up to 50 passwords",
        "Basic password generator",
        "Email support",
        "2-device sync",
        "Basic breach monitoring"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For power users and professionals",
      features: [
        "Unlimited passwords",
        "Advanced password generator",
        "Priority support",
        "Unlimited device sync",
        "Real-time breach alerts",
        "Secure sharing",
        "Advanced 2FA",
        "Dark web monitoring"
      ],
      popular: true,
      cta: "Start Pro Trial"
    },
    {
      name: "Business",
      price: "$25",
      period: "per user/month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Admin dashboard",
        "SSO integration",
        "Compliance reports",
        "API access",
        "Custom policies",
        "24/7 phone support"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-cyber-grid bg-cyber-grid opacity-20 animate-pulse-slow"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 animate-gradient-shift bg-[length:400%_400%]"></div>

      {/* Navigation */}
      <nav className="relative container mx-auto px-4 sm:px-6 py-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-slide-in-left">
            <div className="relative">
              <img 
                src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
                alt="Lockvian Logo" 
                className="w-10 h-10 animate-float"
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-glow"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lockvian
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105">Features</a>
            <a href="#security" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105">Security</a>
            <a href="#pricing" className="text-slate-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105">Pricing</a>
            <Link to="/auth">
              <Button variant="outline" className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 hover:scale-105">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-lg mt-2 p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-slate-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#security" className="text-slate-300 hover:text-cyan-400 transition-colors">Security</a>
              <a href="#pricing" className="text-slate-300 hover:text-cyan-400 transition-colors">Pricing</a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-800">
                <Link to="/auth">
                  <Button variant="outline" className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="text-center max-w-5xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border-cyan-500/30 px-6 py-2 text-sm animate-bounce-gentle">
            🚀 Next-Generation Security Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-up">
            Password Security
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift bg-[length:400%_400%]">
              Reimagined
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Experience zero-knowledge architecture with AI-powered breach prediction. 
            Your digital fortress, secured by tomorrow's technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-cyan-500/25">
                <Shield className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-4 text-lg transition-all duration-300 hover:scale-105">
              <Eye className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-slate-400 mb-4">Trusted by over 10,000+ users worldwide</p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-slate-400 ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative container mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-up">
            Revolutionary Features
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Built with cutting-edge technology to provide unparalleled security and user experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative`}>
                    <Icon className="h-7 w-7 text-white" />
                    <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  </div>
                  <CardTitle className="text-white text-xl group-hover:text-cyan-400 transition-colors duration-300">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative container mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-up">
            Choose Your Plan
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Flexible pricing that grows with your security needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={plan.name} className={`relative bg-slate-900/50 border-slate-800 backdrop-blur-sm transition-all duration-500 hover:scale-105 animate-fade-up ${plan.popular ? 'ring-2 ring-cyan-500 shadow-2xl shadow-cyan-500/20' : 'hover:shadow-2xl'}`} style={{ animationDelay: `${index * 0.1}s` }}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-1">/{plan.period}</span>
                </div>
                <CardDescription className="text-slate-400">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-300">
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/auth">
                  <Button className={`w-full transition-all duration-300 hover:scale-105 ${plan.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative container mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <Badge className="mb-6 bg-green-500/10 text-green-400 border-green-500/30 px-4 py-2">
              🛡️ Military-Grade Security
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Security That Anticipates Tomorrow's Threats
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              While others react to breaches, Lockvian predicts them. Our advanced threat intelligence 
              continuously monitors global security landscapes to protect your credentials proactively.
            </p>
            <div className="space-y-4">
              {[
                "AES-256-GCM end-to-end encryption",
                "Argon2id password hashing", 
                "Real-time breach anticipation",
                "99.99% uptime SLA guarantee"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse-slow"></div>
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse-slow"></div>
            <Card className="relative bg-slate-900/80 border-slate-700 backdrop-blur-sm p-8 hover:bg-slate-800/80 transition-all duration-500">
              <div className="text-center">
                <div className="relative mb-8">
                  <img 
                    src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
                    alt="Security Shield" 
                    className="w-32 h-32 mx-auto opacity-90 animate-float"
                  />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-glow"></div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Zero-Knowledge Promise</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Your data is encrypted on your device before it ever reaches our servers. 
                  Not even we can access your passwords.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <Card className="bg-gradient-to-r from-slate-900/80 to-blue-900/80 border-slate-700 backdrop-blur-sm animate-scale-in">
          <CardContent className="text-center py-16 px-6 lg:px-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Secure Your Future?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who trust Lockvian to protect their digital lives. 
              Experience next-generation security with zero-knowledge privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-cyan-500/25">
                  <Shield className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-4 text-lg transition-all duration-300 hover:scale-105">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative container mx-auto px-4 sm:px-6 py-12 border-t border-slate-800">
        <div className="text-center animate-fade-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img 
              src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
              alt="Lockvian Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Lockvian
            </span>
          </div>
          <p className="text-slate-400 mb-6">
            © 2025 Lockvian. Next-generation password security for everyone.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
