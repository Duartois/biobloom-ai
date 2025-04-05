
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsRedirecting(true);
      const from = location.state?.from || '/dashboard';
      const redirectTimer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000); // Pequeno delay para mostrar a mensagem de redirecionamento
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(email, password);
      setIsRedirecting(true);
      // A redireção será feita pelo useEffect acima quando isAuthenticated mudar
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
          
          {isRedirecting && (
            <div className="bg-success/10 border border-success text-success text-sm p-3 rounded-md mb-4 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Login bem-sucedido. Redirecionando...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
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
              className="w-full"
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
            <Link to="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
