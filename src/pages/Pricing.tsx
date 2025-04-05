
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type PlanDuration = 'monthly' | 'annual';
type PlanType = 'free' | 'starter' | 'pro' | 'premium';

interface PlanData {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  recursos: string[];
  ativo: boolean;
}

const Pricing = () => {
  const [duration, setDuration] = useState<PlanDuration>('monthly');
  const { isAuthenticated, user, updateUserPlan } = useAuth();
  const navigate = useNavigate();
  const [plansData, setPlansData] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch plans data from Supabase
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('ativo', true);
      
      if (error) {
        console.error('Error fetching plans:', error);
        toast.error('Erro ao carregar os planos. Por favor, tente novamente mais tarde.');
      } else if (data) {
        setPlansData(data);
      }
      setLoading(false);
    };
    
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: PlanType) => {
    if (!isAuthenticated) {
      navigate('/register?plan=' + plan);
      return;
    }
    
    if (plan === 'free') {
      updateUserPlan('free')
        .then(() => navigate('/dashboard'))
        .catch(console.error);
      return;
    }
    
    // Mock payment flow
    toast.loading('Redirecionando para pagamento...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Pagamento simulado concluído');
      updateUserPlan(plan)
        .then(() => navigate('/dashboard'))
        .catch(console.error);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100);
  };

  const getAnnualPrice = (monthlyPrice: number) => {
    // 20% discount for annual plans
    const annualPrice = monthlyPrice * 12 * 0.8;
    return formatPrice(annualPrice);
  };

  // Helper to find plan by name
  const findPlan = (planName: string): PlanData | undefined => {
    return plansData.find(p => p.nome.toLowerCase() === planName);
  };

  const freePlan = findPlan('gratuito');
  const starterPlan = findPlan('inicial');
  const proPlan = findPlan('pro');
  const premiumPlan = findPlan('premium');

  return (
    <MainLayout>
      <div className="container px-4 py-24 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Escolha seu plano</h1>
          <p className="text-xl text-muted-foreground">
            Comece gratuitamente e faça upgrade conforme sua necessidade. Todos os planos incluem período de teste de 7 dias.
          </p>
        </div>

        {/* Toggle monthly/annual */}
        <div className="flex justify-center items-center space-x-4 mb-16">
          <button
            className={`text-sm font-medium ${
              duration === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
            }`}
            onClick={() => setDuration('monthly')}
          >
            Mensal
          </button>
          <div className="relative w-14 h-7 bg-muted rounded-full">
            <div
              className={`absolute w-5 h-5 bg-primary rounded-full top-1 transition-all ${
                duration === 'monthly' ? 'left-1' : 'left-8'
              }`}
            />
          </div>
          <button
            className={`text-sm font-medium flex items-center ${
              duration === 'annual' ? 'text-foreground' : 'text-muted-foreground'
            }`}
            onClick={() => setDuration('annual')}
          >
            Anual
            <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              Economize 20%
            </span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-biobloom-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free plan */}
            <div className="bg-background border rounded-xl overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Gratuito</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">R$0</span>
                  <span className="text-muted-foreground ml-1">/sempre</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {freePlan?.descricao || 'Perfeito para começar'}
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {freePlan?.recursos?.map((recurso, idx) => (
                    <li key={idx} className="flex text-sm">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPlan('free')}
                  variant="outline"
                  className="w-full mt-6"
                >
                  Começar Grátis
                </Button>
              </div>
            </div>

            {/* Starter plan */}
            <div className="bg-background border rounded-xl overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Inicial</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">
                    {duration === 'monthly' 
                      ? starterPlan ? formatPrice(starterPlan.preco) : 'R$9'
                      : starterPlan ? getAnnualPrice(starterPlan.preco) : 'R$87'}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    /{duration === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {starterPlan?.descricao || 'Para criadores em crescimento'}
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {starterPlan?.recursos?.map((recurso, idx) => (
                    <li key={idx} className="flex text-sm">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPlan('starter')}
                  variant="outline"
                  className="w-full mt-6"
                >
                  Assinar Plano Inicial
                </Button>
              </div>
            </div>

            {/* Pro plan */}
            <div className="bg-background border-2 border-primary rounded-xl overflow-hidden relative transform hover:scale-105 transition-transform">
              <div className="absolute -top-3 -right-3 bg-secondary text-white text-xs px-3 py-1 rounded-full transform rotate-12">
                Popular
              </div>
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Pro</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">
                    {duration === 'monthly' 
                      ? proPlan ? formatPrice(proPlan.preco) : 'R$19'
                      : proPlan ? getAnnualPrice(proPlan.preco) : 'R$182'}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    /{duration === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {proPlan?.descricao || 'Para criadores estabelecidos'}
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {proPlan?.recursos?.map((recurso, idx) => (
                    <li key={idx} className="flex text-sm">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPlan('pro')}
                  className="w-full mt-6"
                >
                  Assinar Plano Pro
                </Button>
              </div>
            </div>

            {/* Premium plan */}
            <div className="bg-background border rounded-xl overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Premium</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">
                    {duration === 'monthly' 
                      ? premiumPlan ? formatPrice(premiumPlan.preco) : 'R$39'
                      : premiumPlan ? getAnnualPrice(premiumPlan.preco) : 'R$374'}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    /{duration === 'monthly' ? 'mês' : 'ano'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {premiumPlan?.descricao || 'Para equipes e marcas'}
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {premiumPlan?.recursos?.map((recurso, idx) => (
                    <li key={idx} className="flex text-sm">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPlan('premium')}
                  variant="outline"
                  className="w-full mt-6"
                >
                  Assinar Plano Premium
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Precisa de um plano personalizado para sua empresa?{' '}
            <a href="#" className="text-primary underline">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
