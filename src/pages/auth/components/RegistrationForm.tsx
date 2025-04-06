
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from 'lucide-react';

type PlanType = 'free' | 'starter' | 'pro' | 'premium';

type RegistrationFormProps = {
  email: string;
  setEmail: (email: string) => void;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  plan: PlanType;
  setPlan: (plan: PlanType) => void;
  planData: any[];
  getPlanName: (planId: string) => string;
  getPlanPrice: (planId: string) => string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  isRedirecting: boolean;
};

export const RegistrationForm = ({
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  plan,
  setPlan,
  planData,
  getPlanName,
  getPlanPrice,
  handleSubmit,
  loading,
  isRedirecting
}: RegistrationFormProps) => {
  return (
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
  );
};
