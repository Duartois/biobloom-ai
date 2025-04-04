
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Laptop, Layout, LinkIcon, Calendar, Settings, 
  PlusSquare, Home, ChevronLeft, ChevronRight, LogOut 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const navItems = [
    { name: 'Dashboard', icon: <Layout className="h-5 w-5" />, path: '/dashboard' },
    { name: 'My Bio-page', icon: <Laptop className="h-5 w-5" />, path: '/dashboard/bio' },
    { name: 'Links', icon: <LinkIcon className="h-5 w-5" />, path: '/dashboard/links' },
    { name: 'Schedule Posts', icon: <Calendar className="h-5 w-5" />, path: '/dashboard/schedule' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/dashboard/settings' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <div 
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } bg-background border-r border-border transition-all duration-300 ease-in-out flex flex-col fixed h-full`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <Link to="/" className="font-satoshi font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              BioBloom
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-grow py-4 overflow-y-auto">
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-2 py-2 rounded-md text-sm transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span className="inline-flex">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={() => logout()}
            className={`${
              collapsed ? 'w-full justify-center' : 'w-full justify-start'
            } text-muted-foreground hover:text-foreground`}
          >
            <LogOut className={`h-5 w-5 ${!collapsed && 'mr-2'}`} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${collapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <header className="bg-background border-b border-border h-14 flex items-center px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center">
              <Home className="h-5 w-5 text-muted-foreground" />
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex"
              asChild
            >
              <Link to={`/${user?.username || 'preview'}`} target="_blank">
                <Laptop className="mr-2 h-4 w-4" />
                Preview Bio-page
              </Link>
            </Button>
            <Button 
              size="sm"
              asChild
            >
              <Link to="/dashboard/links/new">
                <PlusSquare className="mr-2 h-4 w-4" />
                Add Link
              </Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
