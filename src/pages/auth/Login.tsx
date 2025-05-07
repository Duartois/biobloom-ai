
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/auth/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { LoadingBanner } from './components/LoadingBanner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated, needsOnboarding } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState('Login bem-sucedido. Redirecionando...');
  
  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const params = new URLSearchParams(window.location.search);
      const type = params.get('type');
      
      if (type === 'email_confirmation') {
        toast.success("Email confirmado com sucesso! Agora você pode fazer login.");
      }
    };
    
    checkEmailConfirmation();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsRedirecting(true);
      
      if (needsOnboarding) {
        setRedirectMessage('Login bem-sucedido. Redirecionando para configuração inicial...');
        toast.success("Login bem-sucedido!", { duration: 2000 });
        
        const redirectTimer = setTimeout(() => {
          navigate('/onboarding', { replace: true });
        }, 1000);
        
        return () => clearTimeout(redirectTimer);
      }
      
      const from = location.state?.from || '/dashboard';
      toast.success("Login bem-sucedido!", { duration: 2000 });
      
      const redirectTimer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, needsOnboarding, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(usernameOrEmail, password);
    } catch (err: any) {
      const errorMessage = err?.message || 'Falha no login. Por favor, verifique suas credenciais.';
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto px-4 py-12">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">Digite suas credenciais para acessar sua conta</p>
        </div>
        <div className="bg-background p-6 rounded-lg border shadow-sm">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {isRedirecting && <LoadingBanner message={redirectMessage} />}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">E-mail ou nome de usuário</Label>
              <Input
                id="usernameOrEmail"
                type="text"
                placeholder="nome@exemplo.com ou seu_username"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-sm text-festa-amarelo hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-festa-amarelo hover:bg-festa-laranja text-white"
              disabled={loading || isRedirecting}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-festa-amarelo hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
