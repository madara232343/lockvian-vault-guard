
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Key, 
  Shield, 
  Settings, 
  Users, 
  Zap, 
  LogOut, 
  Menu,
  X,
  User,
  Crown,
  MessageCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Quantum Dashboard', gradient: 'from-purple-500 to-cyan-500' },
    { path: '/vault', icon: Key, label: 'Neural Vault', gradient: 'from-cyan-500 to-blue-500' },
    { path: '/generator', icon: Zap, label: 'Key Generator', gradient: 'from-green-500 to-emerald-500' },
    { path: '/security', icon: Shield, label: 'Reality Shield', gradient: 'from-red-500 to-orange-500' },
    { path: '/sharing', icon: Users, label: 'Cosmic Sharing', gradient: 'from-purple-500 to-pink-500' },
    { path: '/settings', icon: Settings, label: 'Dimension Settings', gradient: 'from-slate-500 to-slate-600' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-cyan-950 text-white relative overflow-hidden">
      {/* Revolutionary Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 animate-gradient-x"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navigation Bar - Centered */}
      <header className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-purple-500/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                QuantumVault
              </span>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 bg-black/20 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300
                      ${active 
                        ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-105` 
                        : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="hidden lg:flex items-center space-x-3 bg-black/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.email?.split('@')[0] || 'Quantum User'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Crown className="h-3 w-3 text-yellow-400" />
                    <p className="text-xs text-white/60">Cyborg Plan</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="hidden lg:flex items-center space-x-2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Exit Portal</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed top-0 right-0 z-50 h-full w-80 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-l border-white/20
        transform transition-all duration-500 ease-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:hidden
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                QuantumVault
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300
                    ${active 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                    ${active 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'bg-white/10 group-hover:bg-white/20'
                    }
                  `}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-white/20 space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">
                  {user?.email?.split('@')[0] || 'Quantum User'}
                </p>
                <div className="flex items-center space-x-1">
                  <Crown className="h-3 w-3 text-yellow-400" />
                  <p className="text-xs text-white/60">Cyborg Plan</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Exit Portal
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content - Centered */}
      <main className="relative">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      {/* 24/7 Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
        
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 animate-fade-in shadow-2xl">
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
            <div className="h-64 bg-black/20 rounded-xl p-4 mb-4 overflow-y-auto border border-white/10">
              <div className="text-white/80 text-sm space-y-2">
                <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-3 border border-white/10">
                  🤖 <strong>Quantum AI:</strong> Greetings, human! I'm your interdimensional assistant.
                </div>
                <div className="text-white/60 text-xs">
                  I can help with:
                  <br/>• Security optimization
                  <br/>• Feature navigation  
                  <br/>• Quantum troubleshooting
                  <br/>• Reality bending tips
                  <br/>• Plan limitations explained
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask your quantum question..."
                className="flex-1 bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
