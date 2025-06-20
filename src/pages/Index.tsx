
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Brain, Zap, Eye, Users, Smartphone, Globe, Check, Star, ArrowRight, ChevronDown, Play, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "Quantum AI Security",
      description: "Revolutionary quantum-encrypted algorithms with neural prediction matrices.",
      gradient: "from-purple-500 via-pink-500 to-orange-500"
    },
    {
      icon: Lock,
      title: "Biometric Vault", 
      description: "Multi-dimensional biometric encryption with DNA-level security protocols.",
      gradient: "from-cyan-400 via-blue-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Instant Sync Matrix",
      description: "Quantum entanglement synchronization across infinite dimensions.",
      gradient: "from-green-400 via-emerald-500 to-teal-600"
    },
    {
      icon: Smartphone,
      title: "Holographic Interface",
      description: "3D holographic password management with gesture recognition.",
      gradient: "from-orange-400 via-red-500 to-pink-600"
    },
    {
      icon: Users,
      title: "Telepathic Sharing",
      description: "Mind-to-mind secure password transmission via neural networks.",
      gradient: "from-indigo-400 via-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Cosmic Network",
      description: "Intergalactic password storage with alien-grade encryption.",
      gradient: "from-teal-400 via-blue-500 to-indigo-600"
    }
  ];

  const pricingPlans = [
    {
      name: "Earthling",
      price: "$0",
      period: "forever",
      description: "Basic human-level security",
      features: [
        "10 passwords maximum",
        "Basic quantum encryption",
        "Earth-based support only",
        "2 devices",
        "Standard breach alerts"
      ],
      popular: false,
      cta: "Start Free",
      limit: "basic"
    },
    {
      name: "Cyborg",
      price: "$19",
      period: "per month",
      description: "Enhanced cybernetic capabilities",
      features: [
        "Unlimited passwords",
        "Advanced quantum AI",
        "24/7 Neural support",
        "Unlimited devices",
        "Real-time threat prediction",
        "Biometric sharing",
        "Holographic 2FA",
        "Dark web monitoring",
        "Time travel backup"
      ],
      popular: true,
      cta: "Upgrade Now",
      limit: "pro"
    },
    {
      name: "Alien",
      price: "$99",
      period: "per user/month",
      description: "Intergalactic enterprise grade",
      features: [
        "Everything in Cyborg",
        "Telepathic team management",
        "Cosmic admin dashboard",
        "Alien SSO integration",
        "Galactic compliance reports",
        "Quantum API access",
        "Reality-bending policies",
        "Interdimensional support"
      ],
      popular: false,
      cta: "Contact Aliens",
      limit: "enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-cyan-950 text-white overflow-hidden relative">
      {/* Revolutionary Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Futuristic Navigation */}
      <nav className="relative z-50 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Shield className="h-7 w-7 text-white relative z-10" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              QuantumVault
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-white/80 hover:text-cyan-400 transition-all duration-300 hover:scale-110 relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#demo" className="text-white/80 hover:text-purple-400 transition-all duration-300 hover:scale-110 relative group">
              Demo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-white/80 hover:text-pink-400 transition-all duration-300 hover:scale-110 relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link to="/auth">
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105">
                Access Portal
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-purple-500/50">
                Enter Dimension
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-white/80 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#demo" className="text-white/80 hover:text-purple-400 transition-colors">Demo</a>
              <a href="#pricing" className="text-white/80 hover:text-pink-400 transition-colors">Pricing</a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                <Link to="/auth">
                  <Button variant="ghost" className="w-full border border-white/20 hover:bg-white/10">
                    Access Portal
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500">
                    Enter Dimension
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Revolutionary Hero Section */}
      <section className="relative container mx-auto px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <Badge className="mb-8 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 text-white border border-white/20 px-8 py-3 text-lg animate-pulse-glow">
            🚀 Quantum Security Revolution
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              Beyond Reality
            </span>
            <span className="block text-white mt-4">
              Security Portal
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto">
            Enter the quantum dimension of password security. Experience technology that transcends 
            human comprehension with alien-grade encryption protocols.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/auth">
              <Button size="xl" className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 text-xl px-12 py-6 transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-purple-500/50 group">
                <Shield className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Enter Quantum Realm
              </Button>
            </Link>
            <Button size="xl" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 text-xl px-12 py-6 transition-all duration-500 hover:scale-110 group">
              <Play className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              Watch Magic
            </Button>
          </div>

          {/* Quantum Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "∞", label: "Quantum Passwords" },
              { value: "99.999%", label: "Alien Security" },
              { value: "0ms", label: "Time Travel Sync" },
              { value: "∞D", label: "Dimensions Protected" }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Impossible Features
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
            Technology so advanced, it seems like magic from another dimension
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:rotate-1" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative overflow-hidden`}>
                    <Icon className="h-8 w-8 text-white relative z-10" />
                    <div className="absolute inset-0 bg-white/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  </div>
                  <CardTitle className="text-white text-2xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-cyan-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">{feature.title}</CardTitle>
                  <CardDescription className="text-white/70 text-lg leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              See The Magic
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto">
            Watch how QuantumVault bends reality to protect your digital existence
          </p>
          
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 group-hover:border-white/40 transition-all duration-500">
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 via-cyan-900/50 to-pink-900/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <Play className="h-20 w-20 text-white group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Dimensional Plans
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
            Choose your level of cosmic security enhancement
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={plan.name} className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border transition-all duration-500 hover:scale-105 hover:rotate-1 ${plan.popular ? 'border-purple-500 shadow-2xl shadow-purple-500/50' : 'border-white/20 hover:border-white/40'}`} style={{ animationDelay: `${index * 0.1}s` }}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 text-white px-6 py-2 text-lg">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="text-center pb-6 relative z-10">
                <CardTitle className="text-3xl text-white mb-4">{plan.name}</CardTitle>
                <div className="mb-6">
                  <span className="text-5xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">{plan.price}</span>
                  <span className="text-white/60 ml-2">/{plan.period}</span>
                </div>
                <CardDescription className="text-white/70 text-lg">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 relative z-10">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-white/80">
                      <Check className="h-5 w-5 text-green-400 mr-4 flex-shrink-0" />
                      <span className="text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/auth">
                  <Button className={`w-full transition-all duration-300 hover:scale-105 text-lg py-6 ${plan.popular ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 shadow-lg' : 'bg-gradient-to-r from-white/10 to-white/20 hover:from-white/20 hover:to-white/30 text-white border border-white/20'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 24/7 Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
        
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Quantum AI Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ×
              </Button>
            </div>
            <div className="h-64 bg-black/20 rounded-xl p-4 mb-4 overflow-y-auto">
              <div className="text-white/80 text-sm">
                🤖 Hello! I'm your quantum AI assistant. I can help you with:
                <br/>• Security questions
                <br/>• Feature explanations  
                <br/>• Technical support
                <br/>• Cosmic guidance
                <br/><br/>
                Ask me anything about QuantumVault!
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask your quantum question..."
                className="flex-1 bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm"
              />
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-cyan-500">
                Send
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative container mx-auto px-6 py-16 border-t border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              QuantumVault
            </span>
          </div>
          <p className="text-white/60 mb-8 text-lg">
            © 2025 QuantumVault. Transcending reality since the beginning of time.
          </p>
          <div className="flex justify-center space-x-8 text-white/50">
            <a href="#" className="hover:text-purple-400 transition-colors">Quantum Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Cosmic Terms</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Alien Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
