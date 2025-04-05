
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  CreditCard, 
  User, 
  Mail, 
  Key, 
  Trash2, 
  RefreshCw,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { user, updateUserPlan, getRemainingTrialDays, isTrialActive } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Link para redefinição de senha enviado para seu email!');
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Tem certeza que deseja cancelar sua assinatura? Seus recursos serão limitados ao plano gratuito.')) {
      updateUserPlan('free')
        .then(() => toast.success('Assinatura cancelada com sucesso!'))
        .catch(console.error);
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const getPlanName = () => {
    switch(user?.plan) {
      case 'free': return 'Gratuito';
      case 'starter': return 'Inicial';
      case 'pro': return 'Pro';
      case 'premium': return 'Premium';
      case 'trial': return 'Pro (período de teste)';
      default: return 'Desconhecido';
    }
  };

  const isPaidPlan = user?.plan && ['starter', 'pro', 'premium'].includes(user.plan);
  const isTrialPlan = user?.plan === 'trial';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Seu nome" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="seu@email.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input 
                      id="username" 
                      value={user?.username} 
                      disabled 
                    />
                    <p className="text-sm text-muted-foreground">
                      Seu URL é: biobloom.com/{user?.username}
                    </p>
                  </div>
                  <Button type="submit">Salvar alterações</Button>
                </form>
              </CardContent>
            </Card>

            {/* Password */}
            <Card>
              <CardHeader>
                <CardTitle>Alterar senha</CardTitle>
                <CardDescription>Atualize sua senha para manter sua conta segura</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button type="submit">Atualizar senha</Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis para sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Excluir conta</h4>
                      <p className="text-sm text-muted-foreground">
                        Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle>Assinatura</CardTitle>
                <CardDescription>Gerenciar seu plano atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium">Plano atual</p>
                  <p className="text-lg font-bold">{getPlanName()}</p>
                  
                  {isTrialPlan && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-center text-amber-500">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>Período de teste: {getRemainingTrialDays()} dias restantes</span>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        Após o término do teste, sua conta será convertida para o plano gratuito.
                      </p>
                    </div>
                  )}
                  
                  {isPaidPlan && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Próxima cobrança: 15/05/2024
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {(user?.plan === 'free' || isTrialPlan) && (
                    <Button onClick={handleUpgrade} className="w-full">
                      Fazer upgrade
                    </Button>
                  )}

                  {isPaidPlan && (
                    <Button onClick={handleCancelSubscription} variant="outline" className="w-full">
                      Cancelar assinatura
                    </Button>
                  )}

                  {isPaidPlan && (
                    <Button variant="outline" className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Atualizar forma de pagamento
                    </Button>
                  )}

                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <a href="/billing-history">
                      <span>Histórico de cobranças</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle>Segurança da conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Verificação em duas etapas</div>
                    <div className="text-xs text-muted-foreground">Não ativado</div>
                  </div>
                  <Button variant="outline" size="sm">Ativar</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Sessões ativas</div>
                    <div className="text-xs text-muted-foreground">1 dispositivo</div>
                  </div>
                  <Button variant="outline" size="sm">Gerenciar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
