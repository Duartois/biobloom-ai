
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Palette, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Progress } from "@/components/ui/progress";

// Background image suggestions - consistent with main BackgroundSelector
const backgroundImages = [
  { id: 1, url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500&auto=format&fit=crop" },
  { id: 2, url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&auto=format&fit=crop" },
  { id: 3, url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop" },
  { id: 4, url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop" },
  { id: 5, url: "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=500&auto=format&fit=crop" },
  { id: 6, url: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=500&auto=format&fit=crop" },
  { id: 7, url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=500&auto=format&fit=crop" },
  { id: 8, url: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?q=80&w=500&auto=format&fit=crop" },
  { id: 9, url: "https://images.unsplash.com/photo-1560015534-cee980ba7e13?q=80&w=500&auto=format&fit=crop" },
  { id: 10, url: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=500&auto=format&fit=crop" },
  { id: 11, url: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=500&auto=format&fit=crop" },
  { id: 12, url: "https://images.unsplash.com/photo-1508614999368-9260051292e5?q=80&w=500&auto=format&fit=crop" },
];

// Palette of solid colors with more neutral tones
const colorPalette = [
  "#FFFFFF", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#CCCCCC", 
  "#AAAAAA", "#888888", "#666666", "#444444", "#222222", 
  "#F9F9F9", "#F0F0F0", "#EAEAEA", "#D9D9D9", "#BFBFBF", 
  "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD",
];

export type BackgroundData = {
  backgroundType: 'image' | 'color';
  backgroundImage: string;
  backgroundColor: string;
  opacity: number;
  grayscale: boolean;
};

export type BackgroundSelectorProps = {
  backgroundType: 'image' | 'color';
  backgroundImage: string;
  backgroundColor: string;
  opacity: number;
  grayscale: boolean;
  onSubmit: (data: BackgroundData) => void;
  isSubmitting?: boolean;
  onBack?: () => void;
};

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundType = 'color',
  backgroundImage = '',
  backgroundColor = '#FFFFFF',
  opacity = 1.0,
  grayscale = false,
  onSubmit,
  isSubmitting = false,
  onBack
}) => {
  const [formData, setFormData] = useState<BackgroundData>({
    backgroundType,
    backgroundImage,
    backgroundColor,
    opacity,
    grayscale
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const setBackgroundType = (type: 'image' | 'color') => {
    setFormData(prev => ({ ...prev, backgroundType: type }));
  };

  const setSelectedImage = (url: string | null) => {
    if (url) {
      setFormData(prev => ({ ...prev, backgroundImage: url }));
    }
  };

  const setSelectedColor = (color: string | null) => {
    if (color) {
      setFormData(prev => ({ ...prev, backgroundColor: color }));
    }
  };

  const setOpacity = (value: number) => {
    setFormData(prev => ({ ...prev, opacity: value }));
  };

  const setGrayscale = (value: boolean) => {
    setFormData(prev => ({ ...prev, grayscale: value }));
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Passo 2 de 2</span>
          <span>100% completo</span>
        </div>
        <Progress value={100} className="h-2" />
      </div>

      <form id="background-form" onSubmit={handleSubmit} className="space-y-6">
        <Tabs 
          defaultValue={formData.backgroundType} 
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
            
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {colorPalette.map((color, index) => (
                <div 
                  key={index}
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    formData.backgroundColor === color 
                      ? 'border-black dark:border-white ring-2 ring-offset-2' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                >
                  {formData.backgroundColor === color && (
                    <div className="flex items-center justify-center h-full">
                      <Check 
                        className="h-5 w-5"
                        stroke={parseInt(color.slice(1), 16) > 0xffffff / 2 ? 'black' : 'white'} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="pt-6 mt-6 border-t">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-full max-w-xs mx-auto">
                  <HexColorPicker 
                    color={formData.backgroundColor} 
                    onChange={(color) => setSelectedColor(color)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <ImageOptions 
              opacity={formData.opacity} 
              setOpacity={setOpacity} 
              grayscale={formData.grayscale} 
              setGrayscale={setGrayscale} 
            />
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Escolha uma imagem de fundo para sua página
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {backgroundImages.map(image => (
                <div 
                  key={image.id}
                  className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    formData.backgroundImage === image.url 
                      ? 'border-black dark:border-white ring-2 ring-offset-2' 
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img 
                    src={image.url} 
                    alt="Background option" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {formData.backgroundImage === image.url && (
                    <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1 shadow-sm">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <ImageOptions 
              opacity={formData.opacity} 
              setOpacity={setOpacity} 
              grayscale={formData.grayscale} 
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
            className="bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 flex items-center"
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
      </form>
    </div>
  );
};

interface ImageOptionsProps {
  opacity: number;
  setOpacity: (opacity: number) => void;
  grayscale: boolean;
  setGrayscale: (grayscale: boolean) => void;
}

const ImageOptions = ({ opacity, setOpacity, grayscale, setGrayscale }: ImageOptionsProps) => (
  <div className="space-y-4 pt-4 border-t mt-4">
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="opacity" className="text-sm font-medium">Opacidade</label>
        <span className="text-sm text-muted-foreground">{Math.round(opacity * 100)}%</span>
      </div>
      <input
        type="range"
        id="opacity"
        min="0.2"
        max="1"
        step="0.05"
        value={opacity}
        onChange={(e) => setOpacity(parseFloat(e.target.value))}
        className="w-full accent-black dark:accent-white"
      />
    </div>
    
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="grayscale"
        checked={grayscale}
        onChange={(e) => setGrayscale(e.target.checked)}
        className="rounded border-gray-300 accent-black dark:accent-white"
      />
      <label htmlFor="grayscale" className="text-sm font-medium">Preto e branco</label>
    </div>
  </div>
);
