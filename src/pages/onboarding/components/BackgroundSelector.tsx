
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Palette, ChevronRight, ChevronLeft } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { ColorPickerSection } from '@/components/backgrounds/ColorPickerSection';
import { ColorPalette } from '@/components/backgrounds/ColorPalette';
import { ImageGallery } from '@/components/backgrounds/ImageGallery';
import { ImageOptions } from '@/components/backgrounds/ImageOptions';

export type BackgroundData = {
  backgroundType: 'image' | 'color';
  backgroundImage: string;
  backgroundColor: string;
  opacity: number;
  grayscale: boolean;
};

export type BackgroundSelectorProps = {
  backgroundType: 'image' | 'color';
  setBackgroundType: (type: 'image' | 'color') => void;
  selectedImage: string;
  setSelectedImage: (url: string | null) => void;
  selectedColor: string;
  setSelectedColor: (color: string | null) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  grayscale: boolean;
  setGrayscale: (grayscale: boolean) => void;
  onSubmit: (data: BackgroundData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
};

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType = 'color',
  setBackgroundType,
  selectedImage = '',
  setSelectedImage,
  selectedColor = '#F4F4F5',
  setSelectedColor,
  opacity = 1.0,
  setOpacity,
  grayscale = false,
  setGrayscale,
  onSubmit,
  onBack,
  isSubmitting = false
}) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      backgroundType,
      backgroundImage: selectedImage,
      backgroundColor: selectedColor,
      opacity,
      grayscale
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Passo 3 de 3</span>
          <span>100% completo</span>
        </div>
        <Progress value={100} className="h-2" />
      </div>

      <form id="background-form" onSubmit={handleSubmit} className="space-y-6">
        <Tabs 
          defaultValue={backgroundType} 
          onValueChange={(value) => setBackgroundType(value as 'image' | 'color')}
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
            <TabsTrigger value="color" className="flex items-center justify-center">
              <Palette className="h-4 w-4 mr-2" />
              Cor Sólida
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center justify-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Imagem
            </TabsTrigger>
          </TabsList>

          <TabsContent value="color" className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Escolha uma cor para o fundo da sua página
            </p>
            
            <ColorPalette 
              selectedColor={selectedColor} 
              onSelectColor={(color) => setSelectedColor(color)}
            />
            
            <ColorPickerSection 
              selectedColor={selectedColor} 
              onSelectColor={(color) => setSelectedColor(color)} 
            />

            <ImageOptions 
              opacity={opacity} 
              setOpacity={setOpacity} 
              grayscale={grayscale} 
              setGrayscale={setGrayscale} 
            />
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Escolha uma imagem de fundo para sua página
            </p>
            
            <ImageGallery
              selectedImage={selectedImage}
              onSelectImage={(url) => setSelectedImage(url)}
              grayscale={grayscale}
              opacity={opacity}
            />
            
            <ImageOptions 
              opacity={opacity} 
              setOpacity={setOpacity} 
              grayscale={grayscale} 
              setGrayscale={setGrayscale} 
            />
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1B3B5A] hover:bg-[#1B3B5A]/90 text-white flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Concluir
              </>
            ) : (
              <>
                Concluir
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
