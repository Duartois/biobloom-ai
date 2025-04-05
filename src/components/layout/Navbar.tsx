
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, UserCircle, LogOut, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import Logo from "@/components/assets/BioBloom.svg"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          <img src={Logo} alt="BioBloom Logo" className="h-8 sm:h-10 w-auto" />
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated && (
            <>
              <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Preços
              </Link>
              <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
                Recursos
              </Link>
              <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/help-center" className="text-sm font-medium hover:text-primary transition-colors">
                Ajuda
              </Link>
              <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Entrar
              </Link>
              <Button asChild variant="default">
                <Link to="/register">Começar Agora</Link>
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium">
                      <UserCircle className="h-5 w-5" />
                      <span>{user?.username}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/help-center">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Ajuda</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
          <nav className="flex flex-col space-y-4 p-4">
            {!isAuthenticated && (
              <>
                <Link 
                  to="/pricing" 
                  className="text-xl font-medium p-2 hover:text-primary border-b border-border"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Preços
                </Link>
                <Link 
                  to="/features" 
                  className="text-xl font-medium p-2 hover:text-primary border-b border-border"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Recursos
                </Link>
                <Link 
                  to="/blog" 
                  className="text-xl font-medium p-2 hover:text-primary border-b border-border"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  to="/help-center" 
                  className="text-xl font-medium p-2 hover:text-primary border-b border-border"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ajuda
                </Link>
                <Link 
                  to="/login" 
                  className="text-xl font-medium p-2 text-primary border-b border-border"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Button 
                  asChild 
                  size="lg" 
                  className="mt-4 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/register">Começar Agora</Link>
                </Button>
              </>
            )}
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-xl font-medium p-2 hover:text-primary border-b border-border"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard/settings" 
                  className="text-xl font-medium p-2 hover:text-primary border-b border-border"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Configurações
                </Link>
                <Link 
                  to="/help-center" 
                  className="text-xl font-medium p-2 hover:text-primary border-b border-border"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ajuda
                </Link>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
