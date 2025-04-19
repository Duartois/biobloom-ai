
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Loader2 } from 'lucide-react';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  
  // Add a timeout for loading state in case auth check takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setWaitedTooLong(true);
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading state while checking authentication
  if (loading && !waitedTooLong) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
