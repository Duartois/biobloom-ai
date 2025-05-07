
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, session } = useAuth();
  const location = useLocation();
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  const [authError, setAuthError] = useState<boolean>(false);
  
  // Add a timeout for loading state in case auth check takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setWaitedTooLong(true);
        console.log("Auth check is taking too long, proceeding with the content");
      }
    }, 3000); // Reduced to 3 seconds timeout for better UX

    // Set another timeout for complete failure
    const errorTimer = setTimeout(() => {
      if (loading) {
        setAuthError(true);
        console.error("Auth check failed completely");
      }
    }, 8000); // 8 seconds until we show error message

    return () => {
      clearTimeout(timer);
      clearTimeout(errorTimer);
    };
  }, [loading]);

  // Handle complete auth failure
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Problema na verificação de autenticação</h2>
        <p className="text-muted-foreground mb-6">
          Não foi possível verificar seu status de autenticação. Isso pode ser devido a problemas de conexão.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-festa-amarelo hover:bg-festa-laranja text-white"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (loading && !waitedTooLong) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-festa-amarelo" aria-hidden="true" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If we waited too long, just show the component
  if (waitedTooLong) {
    return <>{children}</>;
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    const from = location.state?.from || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // If not authenticated, render children (login/register components)
  return <>{children}</>;
};

export default GuestRoute;
