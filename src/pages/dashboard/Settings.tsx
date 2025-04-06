import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { toast } from 'sonner';
import { 
  CreditCard, 
  User, 
  Mail, 
  Key, 
  Trash2, 
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  Upload
} from 'lucide-react';

const Settings = () => {
  const { user, updateUserPlan, getRemainingTrialDays, isTrialActive } = useAuth();
  const { profile, updateProfile } = useLinks();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile.profilePicture || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        name: name,
        profilePicture: profilePictureUrl
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar o perfil.');
    }
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
  
  const getPlanPrice = () => {
    switch(user?.plan) {
      case 'free': return 'Grátis';
      case 'starter': return 'R$9/mês';
      case 'pro': return 'R$19/mês';
      case 'premium': return 'R$39/mês';
      case 'trial': return 'Grátis durante o período de teste';
      default: return '';
    }
  };

  const isPaidPlan = user?.plan && ['starter', 'pro', 'premium'].includes(user.plan);
  const isTrialPlan = user?.plan === 'trial';
  
  // Only Pro and Premium plans can upload logo
  const canUploadLogo = user?.plan && ['pro', 'premium', 'trial'].includes(user.plan);

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
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      O e-mail não pode ser alterado
                    </p>
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
                  
                  {canUploadLogo && (
                    <div className="space-y-2">
                      <Label htmlFor="profilePicture">Logotipo</Label>
                      <div className="flex gap-3 items-start">
                        {profilePictureUrl && (
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <img 
                              src={profilePictureUrl} 
                              alt="Logo" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input 
                            id="profilePicture" 
                            value={profilePictureUrl} 
                            onChange={(e) => setProfilePictureUrl(e.target.value)} 
                            placeholder="https://exemplo.com/seu-logo.png" 
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Informe a URL do seu logotipo (disponível nos planos Pro e Premium)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!canUploadLogo && (
                    <div className="bg-muted p-3 rounded-md">
                      <h4 className="text-sm font-medium flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload de Logotipo
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Faça upgrade para o plano Pro ou Premium para adicionar seu logotipo personalizado
                      </p>
                    </div>
                  )}
                  
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
                  <p className="text-sm text-muted-foreground">
                    {getPlanPrice()}
                  </p>
                  
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
                      Próxima cobrança: 15/05/2025
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
