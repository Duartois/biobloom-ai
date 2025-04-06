import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { BackgroundSelector } from './components/BackgroundSelector';
import { ProfileForm } from './components/ProfileForm';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile } = useLinks();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundType, setBackgroundType] = useState<'image' | 'color'>('image');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [opacity, setOpacity] = useState<number>(1);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  
  // Form state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: '',
    interests: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // In a real app, here we would send profile.interests to an AI service
      // to get background suggestions based on interests
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 1000);
    } else if (step === 2 && (selectedImage || selectedColor)) {
      // Final step completion - save everything and go to dashboard
      setIsLoading(true);
      
      try {
        await updateProfile({
          name: profile.name,
          bio: profile.bio,
          backgroundImage: selectedImage,
          background_type: backgroundType,
          themeColor: selectedColor || undefined, // Changed from cor_fundo to themeColor to match ProfileData
          opacity,
          grayscale,
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <MainLayout hideFooter>
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <div className="flex justify-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-biobloom-100 text-biobloom-700 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Vamos configurar sua página BioBloom</h1>
          <p className="text-muted-foreground">Ajudaremos você a criar uma página bonita que reflita sua marca</p>
        </div>

        <div className="bg-background p-6 rounded-lg border shadow-sm">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step >= 1 ? 'border-biobloom-600 bg-biobloom-600 text-white' : 'border-muted'
              }`}>
                1
              </div>
              <div className={`h-1 w-12 ${step >= 2 ? 'bg-biobloom-600' : 'bg-muted'}`}></div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step >= 2 ? 'border-biobloom-600 bg-biobloom-600 text-white' : 'border-muted'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Step 1: Basic info */}
          {step === 1 && (
            <ProfileForm 
              profile={profile}
              onChange={handleProfileChange}
            />
          )}

          {/* Step 2: Background selection */}
          {step === 2 && (
            <BackgroundSelector
              backgroundType={backgroundType}
              setBackgroundType={setBackgroundType}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              opacity={opacity}
              setOpacity={setOpacity}
              grayscale={grayscale}
              setGrayscale={setGrayscale}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex justify-end mt-8">
            {step === 2 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="mr-2"
                disabled={isLoading}
              >
                Voltar
              </Button>
            )}
            <Button 
              onClick={handleNextStep}
              className="bg-biobloom-600 hover:bg-biobloom-700"
              disabled={
                (step === 1 && (!profile.name || !profile.bio)) || 
                (step === 2 && !selectedImage && !selectedColor) ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando
                </>
              ) : step === 2 ? (
                'Concluir Configuração'
              ) : (
                <>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Onboarding;
