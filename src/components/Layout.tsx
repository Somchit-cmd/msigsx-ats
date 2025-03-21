
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, FileText, BarChart, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Close sidebar when pressing escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isSidebarOpen]);

  const navigationItems = [
    { path: '/', label: 'Home', icon: Building2 },
    { path: '/report', label: 'New Report', icon: FileText },
    { path: '/admin', label: 'Admin Dashboard', icon: Building2 },
    { path: '/analytics', label: 'Analytics', icon: BarChart }
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Top Navbar for Mobile */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="ml-4 text-xl font-medium">
            {navigationItems.find(item => item.path === location.pathname)?.label || 'Admin Tracker'}
          </h1>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r shadow-lg transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0 md:static md:h-[calc(100vh-4rem)]"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header with Logo */}
            <div className="p-6 border-b">
              <div className="flex items-center">
                {/* Logo for Desktop */}
                <div className="hidden md:block">
                  <img 
                    src="/lovable-uploads/6ae9b495-93d8-4206-b2c6-726deb8ff764.png" 
                    alt="Admin Tracker Logo" 
                    className="w-auto h-8 object-contain"
                  />
                </div>
                {/* Text for Mobile */}
                <div className="md:hidden">
                  <h2 className="text-2xl font-semibold text-primary">Admin Tracker</h2>
                  <p className="text-sm text-muted-foreground mt-1">Track field activities</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        location.pathname === item.path
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary/80"
                      )}
                    >
                      <item.icon size={18} className="mr-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Sidebar Footer */}
            <div className="p-4 border-t mt-auto">
              <button className="flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors duration-200">
                <LogOut size={18} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "md:ml-0"
        )}>
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
