
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
  MessageCircle,
  Bell,
  Search
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
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/vault', icon: Key, label: 'Vault' },
    { path: '/generator', icon: Zap, label: 'Generator' },
    { path: '/security', icon: Shield, label: 'Security' },
    { path: '/sharing', icon: Users, label: 'Sharing' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation */}
      <header className="bg-slate-800/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">QuantumVault</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                      ${active 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Bell className="h-4 w-4" />
              </Button>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-slate-700 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Crown className="h-3 w-3 text-yellow-400" />
                      <p className="text-xs text-slate-400">Pro Plan</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed top-0 right-0 z-50 h-full w-80 bg-slate-800 transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        md:hidden
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">QuantumVault</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${active 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg mb-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <div className="flex items-center space-x-1">
                  <Crown className="h-3 w-3 text-yellow-400" />
                  <p className="text-xs text-slate-400">Pro Plan</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          size="lg"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 h-96 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              <div className="bg-slate-700 rounded-lg p-3 mb-4">
                <p className="text-white text-sm">
                  👋 Hello! I'm your AI assistant. How can I help you today?
                </p>
              </div>
              <div className="text-slate-400 text-xs">
                <p>I can help with:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Password security tips</li>
                  <li>Feature explanations</li>
                  <li>Account management</li>
                  <li>Technical support</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <Button size="sm">
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
