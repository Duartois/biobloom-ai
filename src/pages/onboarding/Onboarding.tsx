
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm, ProfileFormData } from './components/ProfileForm';
import { BackgroundSelector } from './components/BackgroundSelector';
import { BackgroundData } from './components/BackgroundSelector';
import { LinksForm, LinkData } from './components/LinksForm';
import BioPagePreview from '@/components/profile/BioPagePreview';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, addLink } = useLinks();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || user?.name || '',
    username: user?.username || '',
    bio: profile.bio || '',
    links: [] as LinkData[],
    backgroundType: profile.background_type || 'color',
    backgroundImage: profile.backgroundImage || '',
    backgroundColor: profile.themeColor || '#F4F4F5',
    opacity: profile.opacity || 1.0,
    grayscale: profile.grayscale || false,
  });

  const handleProfileFormSubmit = async (data: ProfileFormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };
  
  const handleProfileChange = (data: ProfileFormData) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  const handleLinksSubmit = async (links: LinkData[]) => {
    setFormData(prev => ({ ...prev, links }));
    setCurrentStep(3);
  };
  
  const handleLinksChange = (links: LinkData[]) => {
    setFormData(prev => ({ ...prev, links }));
  };
  
  const handleBackgroundSubmit = async (data: BackgroundData) => {
    setIsSubmitting(true);
    try {
      // Save profile data
      await updateProfile({
        name: formData.name,
        bio: formData.bio || '', // Permite bio vazia
        background_type: data.backgroundType,
        backgroundImage: data.backgroundType === 'image' ? data.backgroundImage : '',
        themeColor: data.backgroundType === 'color' ? data.backgroundColor : '#F4F4F5',
        opacity: data.opacity,
        grayscale: data.grayscale,
      });
      
      // Save links if any exist
      if (formData.links.length > 0) {
        // Save each link
        for (let i = 0; i < formData.links.length; i++) {
          const link = formData.links[i];
          if (link.title && link.url) {
            // Ensure the style is one of the allowed types
            const validStyle = (link.style === 'default' || 
                               link.style === 'outline' || 
                               link.style === 'ghost' ||
                               link.style === 'neobrutal' ||
                               link.style === 'glass') 
                               ? link.style 
                               : 'default';
                               
            await addLink({
              title: link.title,
              url: link.url,
              style: validStyle,
            });
          }
        }
      }
      
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
    // Convert LinkData[] to Link[] for the preview
    links: formData.links.map(link => {
      // Ensure the style is one of the allowed types
      const validStyle = (link.style === 'default' || 
                         link.style === 'outline' || 
                         link.style === 'ghost' ||
                         link.style === 'neobrutal' ||
                         link.style === 'glass') 
                         ? link.style 
                         : 'default';
      
      return {
        id: `temp-${Math.random().toString(36).substr(2, 9)}`, // Generate temporary IDs for preview
        title: link.title,
        url: link.url,
        style: validStyle
      };
    })
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
                    onChange={handleProfileChange}
                  />
                ) : currentStep === 2 ? (
                  <LinksForm
                    links={formData.links}
                    onSubmit={handleLinksSubmit}
                    onBack={() => setCurrentStep(1)}
                    onChange={handleLinksChange}
                  />
                ) : (
                  <BackgroundSelector
                    backgroundType={formData.backgroundType as 'image' | 'color'}
                    setBackgroundType={(type) => setFormData(prev => ({...prev, backgroundType: type}))}
                    selectedImage={formData.backgroundImage}
                    setSelectedImage={(url) => setFormData(prev => ({...prev, backgroundImage: url || ''}))}
                    selectedColor={formData.backgroundColor}
                    setSelectedColor={(color) => setFormData(prev => ({...prev, backgroundColor: color || '#F4F4F5'}))}
                    opacity={formData.opacity}
                    setOpacity={(value) => setFormData(prev => ({...prev, opacity: value}))}
                    grayscale={formData.grayscale}
                    setGrayscale={(value) => setFormData(prev => ({...prev, grayscale: value}))}
                    onSubmit={handleBackgroundSubmit}
                    onBack={() => setCurrentStep(2)}
                    isSubmitting={isSubmitting}
                  />
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
