
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = false 
}) => {
  const { isAuthenticated, loading, needsOnboarding, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  const [authError, setAuthError] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check for session validity
  useEffect(() => {
    if (session === null && !loading && !isRetrying) {
      console.info("No valid session found, redirecting to login");
      toast.error("Sessão expirada ou inválida. Por favor, faça login novamente.");
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [session, loading, navigate, location.pathname, isRetrying]);

  useEffect(() => {
    // Set timeout in case auth takes too long
    const timer = setTimeout(() => {
      if (loading) {
        setWaitedTooLong(true);
        console.log("Auth check is taking too long, proceeding with auth flow");
      }
    }, 3000); // 3 seconds timeout

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

  useEffect(() => {
    // Only redirect if we're not in a loading state
    if (!loading && !waitedTooLong && isAuthenticated) {
      // If authenticated and needs onboarding, redirect to onboarding
      // But only if not already on the onboarding page
      if (needsOnboarding && 
          location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
        return;
      }

      // If already completed onboarding and trying to access /onboarding, redirect to dashboard
      if (!needsOnboarding && 
          location.pathname === '/onboarding') {
        navigate('/dashboard', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, needsOnboarding, loading, navigate, location.pathname, waitedTooLong]);

  // Handle retry attempt
  const handleRetry = () => {
    setIsRetrying(true);
    setAuthError(false);
    setWaitedTooLong(false);
    
    // Force refresh page to fully reload authentication
    window.location.reload();
  };

  // Handle complete auth failure
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Problema na verificação de autenticação</h2>
        <p className="text-muted-foreground mb-6">
          Não foi possível verificar seu status de autenticação. Isso pode ser devido a problemas de conexão.
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={handleRetry}
            className="bg-festa-amarelo hover:bg-festa-laranja text-white"
          >
            Tentar novamente
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/login", { replace: true })}
          >
            Ir para login
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication - with timeout protection
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

  // If waited too long and still loading, assume not authenticated
  if (waitedTooLong && loading) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated && !loading) {
    // Save the location the user was trying to visit
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
