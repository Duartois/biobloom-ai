
import React, { useState } from 'react';
import { toast } from "sonner";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { BackgroundSelector } from '@/components/backgrounds/BackgroundSelector';
import { AiBackgroundSuggestor } from '@/components/backgrounds/AiBackgroundSuggestor';
import BioPagePreview from '@/components/profile/BioPagePreview';

const BackgroundGenerator = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useLinks();
  const [backgroundType, setBackgroundType] = useState<'image' | 'color'>(
    profile.background_type === 'image' ? 'image' : 'color'
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(
    profile.backgroundImage || null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    profile.themeColor || '#893bf2'
  );
  const [opacity, setOpacity] = useState<number>(
    profile.opacity !== undefined ? profile.opacity : 1.0
  );
  const [grayscale, setGrayscale] = useState<boolean>(
    profile.grayscale || false
  );
  const [isSaving, setIsSaving] = useState(false);
  const isPaidUser = user?.plan === 'starter' || user?.plan === 'pro' || user?.plan === 'premium';

  const handleApplyBackground = async () => {
    if (!selectedImage && !selectedColor) {
      toast.error('Por favor, selecione uma imagem ou cor para o plano de fundo.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ 
        backgroundImage: backgroundType === 'image' ? selectedImage : undefined,
        background_type: backgroundType,
        themeColor: backgroundType === 'color' ? selectedColor : undefined,
        opacity,
        grayscale
      });
      toast.success('Plano de fundo aplicado com sucesso!');
    } catch (error) {
      toast.error('Erro ao aplicar plano de fundo.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAiBackground = (url: string) => {
    setBackgroundType('image');
    setSelectedImage(url);
    setSelectedColor(null);
  };

  const handleSelectAiColor = (color: string) => {
    setBackgroundType('color');
    setSelectedColor(color);
    setSelectedImage(null);
  };

  // Create a modified profile for the preview
  const previewProfile = {
    ...profile,
    background_type: backgroundType,
    backgroundImage: selectedImage,
    themeColor: selectedColor,
    opacity,
    grayscale
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Planos de Fundo</h1>

        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Escolha seu Plano de Fundo</CardTitle>
                <CardDescription>
                  Selecione entre imagens pré-definidas ou cores sólidas para personalizar sua página
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
                <CardDescription>
                  Veja como seu plano de fundo ficará em sua página
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <BioPagePreview 
                  profile={previewProfile}
                  username={user?.username}
                  compact
                />
              </CardContent>
            </Card>
            
            {isPaidUser && (
              <AiBackgroundSuggestor
                onSelectBackground={handleSelectAiBackground}
                onSelectColor={handleSelectAiColor}
              />
            )}
            
            <Button 
              onClick={handleApplyBackground} 
              className="w-full"
              disabled={isSaving || (!selectedImage && !selectedColor)}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Aplicando...
                </>
              ) : (
                'Aplicar e Salvar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BackgroundGenerator;
