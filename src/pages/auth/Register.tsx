
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

// Define plan types for type safety
type PlanType = 'free' | 'starter' | 'pro' | 'premium';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser, loading, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [plan, setPlan] = useState<PlanType>(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'starter' || planParam === 'pro' || planParam === 'premium') {
      return planParam;
    }
    return 'free';
  });
  const [error, setError] = useState<string | null>(null);
  const [planData, setPlanData] = useState<any[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      setIsRedirecting(true);
      // Se for primeiro login, redirecionar para onboarding, caso contrário para dashboard
      const redirectTimer = setTimeout(() => {
        navigate('/onboarding', { replace: true });
      }, 1000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, navigate]);

  // Fetch plans data from Supabase
  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('ativo', true);
      
      if (error) {
        console.error('Error fetching plans:', error);
        return;
      }
      
      if (data) {
        setPlanData(data);
      }
    };
    
    fetchPlans();
  }, []);

  // Update URL when plan changes
  useEffect(() => {
    if (plan !== 'free') {
      navigate(`/register?plan=${plan}`, { replace: true });
    } else {
      navigate('/register', { replace: true });
    }
  }, [plan, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validation
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (username.length < 3) {
      setError("O nome de usuário deve ter pelo menos 3 caracteres");
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setError("O nome de usuário deve conter apenas letras minúsculas, números e underscore");
      return;
    }
    
    try {
      await registerUser(email, password, username);
      setIsRedirecting(true);
      // A redireção para onboarding será feita pelo useEffect acima quando isAuthenticated mudar
    } catch (err: any) {
      setError(err.message || 'Falha no registro. Por favor tente novamente.');
      console.error(err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100);
  };

  // Get plan details
  const getPlanName = (planId: string) => {
    const plan = planData.find(p => p.nome.toLowerCase() === planId);
    return plan ? plan.nome : planId.charAt(0).toUpperCase() + planId.slice(1);
  };

  const getPlanPrice = (planId: string) => {
    const plan = planData.find(p => p.nome.toLowerCase() === planId);
    return plan ? formatPrice(plan.preco) + '/mês' : '';
  };

  return (
    <MainLayout>
      <div className="container max-w-lg mx-auto px-4 py-12">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground">Insira seus dados para criar sua conta BioBloom</p>
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
              Cadastro realizado com sucesso! Redirecionando para configuração inicial...
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
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Esta será sua URL no BioBloom: biobloom.com/{username || 'seuusuario'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label>Selecione seu plano</Label>
              <RadioGroup value={plan} onValueChange={(value) => setPlan(value as PlanType)} className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <RadioGroupItem 
                    value="free" 
                    id="free" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="free"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 font-semibold text-center">Grátis</div>
                    <div className="text-sm text-muted-foreground text-center">Recursos básicos</div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="starter" 
                    id="starter" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="starter"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 font-semibold text-center">Inicial</div>
                    <div className="text-sm text-muted-foreground text-center">{getPlanPrice('starter') || 'R$ 9/mês'}</div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="pro" 
                    id="pro" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="pro"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary relative"
                  >
                    <div className="absolute -top-3 -right-3 bg-festa-rosa text-white text-xs px-3 py-1 rounded-full transform rotate-12">
                      Popular
                    </div>
                    <div className="mb-2 font-semibold text-center">Pro</div>
                    <div className="text-sm text-muted-foreground text-center">{getPlanPrice('pro') || 'R$ 19/mês'}</div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="premium" 
                    id="premium" 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor="premium"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent/10 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 font-semibold text-center">Premium</div>
                    <div className="text-sm text-muted-foreground text-center">{getPlanPrice('premium') || 'R$ 39/mês'}</div>
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Você terá acesso gratuito ao plano Pro por 7 dias. Cancele a qualquer momento.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-festa-amarelo hover:bg-festa-laranja text-festa-dark"
              disabled={loading || isRedirecting}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
