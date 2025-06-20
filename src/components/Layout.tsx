
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
  Search,
  Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Single Top Navigation */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                VaultVian
              </span>
            </Link>

            {/* Center Navigation - Hover Expandable */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div 
                className="relative"
                onMouseEnter={() => setIsNavExpanded(true)}
                onMouseLeave={() => setIsNavExpanded(false)}
              >
                <Button
                  variant="outline"
                  className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50 transition-all duration-300"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Navigation
                </Button>
                
                {/* Expandable Menu */}
                <div className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 origin-top
                  ${isNavExpanded ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                `}>
                  <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-2 min-w-[280px]">
                    <div className="grid grid-cols-2 gap-1">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`
                              flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                              ${active 
                                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg' 
                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                              }
                            `}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="font-medium text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <Button variant="ghost" size="icon" className="hidden md:flex text-slate-400 hover:text-white">
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="hidden md:flex text-slate-400 hover:text-white">
                <Bell className="h-4 w-4" />
              </Button>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-slate-800/50 rounded-xl px-3 py-2 border border-slate-700/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
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
                className="md:hidden text-white"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed top-0 right-0 z-50 h-full w-80 bg-slate-900/95 backdrop-blur-xl transform transition-transform duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        md:hidden border-l border-slate-700/50
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                VaultVian
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-white"
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
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                    ${active 
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
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
              className="w-full border-slate-600 text-white hover:bg-slate-700"
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

      {/* Responsive Chatbot */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-xl border-2 border-white/20"
        >
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-72 sm:w-80 h-80 sm:h-96 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-white font-semibold">VaultVian AI Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 h-48 sm:h-64 overflow-y-auto">
              <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg p-3 mb-4 border border-emerald-500/30">
                <p className="text-white text-sm">
                  👋 Hello! I'm your VaultVian AI assistant. How can I help you today?
                </p>
              </div>
              <div className="text-slate-400 text-xs space-y-2">
                <p className="font-medium text-slate-300">I can help with:</p>
                <ul className="space-y-1">
                  <li>• Password security tips</li>
                  <li>• Feature explanations</li>
                  <li>• Account management</li>
                  <li>• Technical support</li>
                  <li>• Plan upgrades</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 px-3">
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
