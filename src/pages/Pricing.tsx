
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type PlanDuration = 'monthly' | 'annual';

const Pricing = () => {
  const [duration, setDuration] = useState<PlanDuration>('monthly');
  const { isAuthenticated, user, updateUserPlan } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (plan: 'free' | 'starter' | 'pro' | 'premium') => {
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

        {/* Pricing cards */}
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
                Perfeito para começar
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Até 2 links</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Templates com cores sólidas</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Backgrounds padrões</span>
                </li>
                <li className="flex text-sm text-muted-foreground">
                  <Check className="h-5 w-5 text-muted mr-2 flex-shrink-0" />
                  <span>Marca d'água do BioBloom</span>
                </li>
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
                  {duration === 'monthly' ? 'R$9' : 'R$87'}
                </span>
                <span className="text-muted-foreground ml-1">
                  /{duration === 'monthly' ? 'mês' : 'ano'}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Para criadores em crescimento
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Links ilimitados</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Temas variados</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Plano de fundo com IA</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Até 20 agendamentos/mês</span>
                </li>
                <li className="flex text-sm text-muted-foreground">
                  <Check className="h-5 w-5 text-muted mr-2 flex-shrink-0" />
                  <span>Marca d'água do BioBloom</span>
                </li>
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
                  {duration === 'monthly' ? 'R$19' : 'R$182'}
                </span>
                <span className="text-muted-foreground ml-1">
                  /{duration === 'monthly' ? 'mês' : 'ano'}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Para criadores estabelecidos
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Tudo do plano Inicial</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Sem marca d'água</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Logotipo personalizado</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Publicação com IA</span>
                </li>
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
                  {duration === 'monthly' ? 'R$39' : 'R$374'}
                </span>
                <span className="text-muted-foreground ml-1">
                  /{duration === 'monthly' ? 'mês' : 'ano'}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Para equipes e marcas
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Tudo do plano Pro</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Análises avançadas</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Postagens ilimitadas</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Até 3 marcas</span>
                </li>
                <li className="flex text-sm">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>Colaboração em equipe</span>
                </li>
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
