import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RegistrationForm } from './components/RegistrationForm';
import { LoadingBanner } from './components/LoadingBanner';

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
      // Redirecionar para onboarding se for primeiro login
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
      // Após registro bem-sucedido, redirecionar para página de confirmação de email
      navigate('/auth/confirm-email', { replace: true });
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
          
          {isRedirecting && <LoadingBanner message="Cadastro realizado com sucesso! Redirecionando para configuração inicial..." />}
          
          <RegistrationForm 
            email={email}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            plan={plan}
            setPlan={setPlan}
            planData={planData}
            getPlanName={getPlanName}
            getPlanPrice={getPlanPrice}
            handleSubmit={handleSubmit}
            loading={loading}
            isRedirecting={isRedirecting}
          />
          
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
