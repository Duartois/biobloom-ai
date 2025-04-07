
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { ProfileForm } from './components/ProfileForm';
import { BackgroundSelector } from './components/BackgroundSelector';
import BioPagePreview from '@/components/profile/BioPagePreview';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile } = useLinks();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || user?.name || '',
    username: user?.username || '',
    bio: profile.bio || '',
    backgroundType: profile.background_type || 'color',
    backgroundImage: profile.backgroundImage || '',
    backgroundColor: profile.themeColor || '#893bf2',
    opacity: profile.opacity || 1.0,
    grayscale: profile.grayscale || false,
  });

  const handleProfileFormSubmit = async (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleBackgroundSubmit = async (background: any) => {
    setFormData(prev => ({ ...prev, ...background }));
    handleCompleteOnboarding();
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        background_type: formData.backgroundType,
        backgroundImage: formData.backgroundType === 'image' ? formData.backgroundImage : undefined,
        themeColor: formData.backgroundType === 'color' ? formData.backgroundColor : undefined,
        opacity: formData.opacity,
        grayscale: formData.grayscale,
      });
      toast.success('Perfil configurado com sucesso!');
      // Redirect immediately to dashboard after successful onboarding
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao configurar perfil. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create a preview profile for the current step
  const previewProfile = {
    ...profile,
    name: formData.name,
    bio: formData.bio,
    background_type: formData.backgroundType,
    backgroundImage: formData.backgroundImage,
    themeColor: formData.backgroundColor,
    opacity: formData.opacity,
    grayscale: formData.grayscale,
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="flex-1 flex flex-col max-w-screen-xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Bem-vindo ao BioBloom</h1>
          <p className="text-muted-foreground mt-2">
            Vamos configurar seu perfil para você começar a usar a plataforma.
          </p>
        </header>
        
        <div className="grid md:grid-cols-3 gap-6 flex-1">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {currentStep === 1 ? 'Informações do Perfil' : 'Plano de Fundo'}
                    </CardTitle>
                    <CardDescription>
                      {currentStep === 1 
                        ? 'Conte um pouco sobre você ou sua marca'
                        : 'Escolha a aparência da sua Bio-page'
                      }
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Passo {currentStep} de 2
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentStep === 1 ? (
                  <ProfileForm 
                    defaultValues={{
                      name: formData.name,
                      bio: formData.bio,
                    }}
                    onSubmit={handleProfileFormSubmit}
                  />
                ) : (
                  <div className="space-y-6">
                    <BackgroundSelector
                      defaultValues={{
                        backgroundType: formData.backgroundType,
                        backgroundImage: formData.backgroundImage,
                        backgroundColor: formData.backgroundColor,
                        opacity: formData.opacity,
                        grayscale: formData.grayscale,
                      }}
                      onSubmit={handleBackgroundSubmit}
                      isSubmitting={isSubmitting}
                    />
                    
                    <div className="flex items-center justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      
                      <Button 
                        type="submit"
                        form="background-form"
                        disabled={isSubmitting}
                        className="flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Configurando...
                          </>
                        ) : (
                          <>
                            Concluir
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
                <CardDescription>
                  Veja como sua bio-page ficará
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pt-0">
                <BioPagePreview 
                  profile={previewProfile}
                  username={user?.username}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
