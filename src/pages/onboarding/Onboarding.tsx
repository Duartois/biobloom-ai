
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { ProfileForm, ProfileFormData } from './components/ProfileForm';
import { BackgroundData } from './components/BackgroundSelector';
import BioPagePreview from '@/components/profile/BioPagePreview';
import { BackgroundSelector } from '@/components/backgrounds/BackgroundSelector';

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
    backgroundColor: profile.themeColor || '#F8F9FA',
    opacity: profile.opacity || 1.0,
    grayscale: profile.grayscale || false,
  });

  const handleProfileFormSubmit = async (data: ProfileFormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleBackgroundChange = (data: BackgroundData) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio || '', // Permite bio vazia
        background_type: formData.backgroundType,
        backgroundImage: formData.backgroundType === 'image' ? formData.backgroundImage : '',
        themeColor: formData.backgroundType === 'color' ? formData.backgroundColor : '#F8F9FA',
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Vamos configurar seu perfil</h1>
          <p className="text-muted-foreground mt-2">
            Personalize sua Bio-page para compartilhar seus links
          </p>
        </header>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="md:col-span-2">
            <Card className="shadow-sm dark:shadow-slate-800/20">
              <CardContent className="p-6 md:p-8">
                {currentStep === 1 ? (
                  <ProfileForm
                    name={formData.name}
                    bio={formData.bio}
                    username={formData.username}
                    onSubmit={handleProfileFormSubmit}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Passo 2 de 2</span>
                        <span>100% completo</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    <BackgroundSelector
                      backgroundType={formData.backgroundType as 'image' | 'color'}
                      backgroundImage={formData.backgroundImage}
                      backgroundColor={formData.backgroundColor}
                      opacity={formData.opacity}
                      grayscale={formData.grayscale}
                      onSubmit={handleBackgroundChange}
                      onBack={() => setCurrentStep(1)}
                    />

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar
                      </button>
                      
                      <button 
                        type="button"
                        onClick={handleCompleteOnboarding}
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Configurando...
                          </>
                        ) : (
                          <>
                            Concluir
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="hidden md:flex flex-col space-y-4">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Preview</div>
            <div className="flex justify-center h-full">
              <BioPagePreview 
                profile={previewProfile}
                username={user?.username}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
