
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Palette } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { ColorPalette } from './ColorPalette';
import { ColorPickerSection } from './ColorPickerSection';
import { ImageOptions } from './ImageOptions';

export type BackgroundSelectorProps = {
  backgroundType: 'image' | 'color';
  setBackgroundType: (type: 'image' | 'color') => void;
  selectedImage: string | null;
  setSelectedImage: (url: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  grayscale: boolean;
  setGrayscale: (grayscale: boolean) => void;
  className?: string;
  showOpacityOnPreviewOnly?: boolean;
};

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType,
  setBackgroundType,
  selectedImage,
  setSelectedImage,
  selectedColor,
  setSelectedColor,
  opacity,
  setOpacity,
  grayscale,
  setGrayscale,
  className = '',
  showOpacityOnPreviewOnly = false,
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue={backgroundType} onValueChange={(value) => setBackgroundType(value as 'image' | 'color')}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="image" className="flex items-center justify-center">
            <ImageIcon className="h-4 w-4 mr-2" />
            Imagens
          </TabsTrigger>
          <TabsTrigger value="color" className="flex items-center justify-center">
            <Palette className="h-4 w-4 mr-2" />
            Cores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Escolha uma imagem de fundo para sua página
          </p>
          
          <ImageGallery 
            selectedImage={selectedImage}
            onSelectImage={(url) => {
              setSelectedImage(url);
              setSelectedColor(null);
              setBackgroundType('image');
            }}
            grayscale={grayscale}
            opacity={opacity}
            showOpacityOnPreviewOnly={showOpacityOnPreviewOnly}
          />
          
          {selectedImage && (
            <ImageOptions 
              opacity={opacity} 
              setOpacity={setOpacity} 
              grayscale={grayscale} 
              setGrayscale={setGrayscale} 
            />
          )}
        </TabsContent>

        <TabsContent value="color" className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Escolha uma cor sólida para o fundo da sua página
          </p>
          
          <ColorPalette 
            selectedColor={selectedColor}
            onSelectColor={(color) => {
              setSelectedColor(color);
              setSelectedImage(null);
              setBackgroundType('color');
            }}
          />
          
          <ColorPickerSection 
            selectedColor={selectedColor} 
            onSelectColor={(color) => {
              setSelectedColor(color);
              setSelectedImage(null);
              setBackgroundType('color');
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
