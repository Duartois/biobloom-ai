
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, UserCircle, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-satoshi font-bold text-2xl bg-gradient-to-r from-biobloom-600 to-biobloom-800 bg-clip-text text-transparent">
            BioBloom
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated && (
            <>
              <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/login" className="text-sm font-medium text-biobloom-600 hover:text-biobloom-700 transition-colors">
                Login
              </Link>
              <Button asChild className="bg-biobloom-600 hover:bg-biobloom-700">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium">
                  <UserCircle className="h-5 w-5" />
                  <span>{user?.username}</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => logout()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
        
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur-sm p-4 animate-fade-in">
          <div className="flex flex-col space-y-4 p-4">
            {!isAuthenticated && (
              <>
                <Link to="/pricing" className="text-xl font-medium p-2 hover:text-primary">
                  Pricing
                </Link>
                <Link to="/features" className="text-xl font-medium p-2 hover:text-primary">
                  Features
                </Link>
                <Link to="/login" className="text-xl font-medium p-2 text-biobloom-600">
                  Login
                </Link>
                <Button asChild size="lg" className="mt-4 bg-biobloom-600 hover:bg-biobloom-700">
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-xl font-medium p-2 hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-xl font-medium p-2 hover:text-primary">
                  Profile
                </Link>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
