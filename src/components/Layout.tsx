
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
  Crown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/vault', icon: Key, label: 'Password Vault', gradient: 'from-cyan-500 to-blue-500' },
    { path: '/generator', icon: Zap, label: 'Generator', gradient: 'from-green-500 to-emerald-500' },
    { path: '/security', icon: Shield, label: 'Security', gradient: 'from-red-500 to-orange-500' },
    { path: '/sharing', icon: Users, label: 'Sharing', gradient: 'from-purple-500 to-pink-500' },
    { path: '/settings', icon: Settings, label: 'Settings', gradient: 'from-slate-500 to-slate-600' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-cyber-grid bg-cyber-grid opacity-5 animate-pulse-slow pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-cyan-500/3 animate-gradient-shift bg-[length:400%_400%] pointer-events-none"></div>

      {/* Mobile menu overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50
        transform transition-all duration-500 ease-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/30">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
                  alt="Lockvian Logo" 
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Lockvian
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800/50"
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
                    group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${active 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-105` 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:scale-105'
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                    ${active 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                    }
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center relative">
                <User className="h-5 w-5 text-white" />
                <div className="absolute inset-0 bg-white/10 rounded-full blur-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <div className="flex items-center space-x-1">
                  <Crown className="h-3 w-3 text-yellow-400" />
                  <p className="text-xs text-slate-400">Pro Plan</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-72 min-h-screen relative">
        {/* Top bar - Mobile only */}
        <header className="lg:hidden bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/7cf47063-e479-491c-aea6-f5519798ef73.png" 
                alt="Lockvian Logo" 
                className="w-8 h-8"
              />
              <span className="font-bold text-white">Lockvian</span>
            </Link>
            <div className="w-8" />
          </div>
        </header>

        {/* Page content */}
        <main className="relative animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
