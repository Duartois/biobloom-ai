
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { ProfileForm, ProfileFormData } from './components/ProfileForm';
import { BackgroundSelector, BackgroundData } from './components/BackgroundSelector';
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
    backgroundColor: profile.themeColor || '#FFFFFF',
    opacity: profile.opacity || 1.0,
    grayscale: profile.grayscale || false,
  });

  const handleProfileFormSubmit = async (data: ProfileFormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleBackgroundSubmit = async (data: BackgroundData) => {
    setFormData(prev => ({ ...prev, ...data }));
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Vamos configurar seu perfil</h1>
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
                  <BackgroundSelector
                    backgroundType={formData.backgroundType as 'image' | 'color'}
                    backgroundImage={formData.backgroundImage}
                    backgroundColor={formData.backgroundColor}
                    opacity={formData.opacity}
                    grayscale={formData.grayscale}
                    onSubmit={handleBackgroundSubmit}
                    onBack={() => setCurrentStep(1)}
                    isSubmitting={isSubmitting}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="hidden md:flex flex-col space-y-4">
            <div className="text-sm font-medium">Preview</div>
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
