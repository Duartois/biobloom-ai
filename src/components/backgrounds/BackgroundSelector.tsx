
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Palette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

// Background image suggestions - same 20 images used across all pages
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
  { id: 13, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop" },
  { id: 14, url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=500&auto=format&fit=crop" },
  { id: 15, url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=500&auto=format&fit=crop" },
  { id: 16, url: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=500&auto=format&fit=crop" },
  { id: 17, url: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?q=80&w=500&auto=format&fit=crop" },
  { id: 18, url: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=500&auto=format&fit=crop" },
  { id: 19, url: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=500&auto=format&fit=crop" },
  { id: 20, url: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=500&auto=format&fit=crop" },
];

// Palette of solid colors - consistent across all pages
const colorPalette = [
  "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD", 
  "#6C757D", "#495057", "#343A40", "#212529", "#F8BBD0", 
  "#F48FB1", "#FF80AB", "#D0F0C0", "#A8E6CF", "#1DE9B6", 
  "#90CAF9", "#64B5F6", "#42A5F5", "#FFF176", "#FFEE58", 
  "#FFCA28", "#FFA726", "#FF7043", "#8C9EFF", "#536DFE", 
  "#7C4DFF", "#E1BEE7", "#CE93D8", "#BA68C8",
];

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
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {backgroundImages.map(image => (
              <div 
                key={image.id}
                className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === image.url 
                    ? 'border-biobloom-600 ring-2 ring-biobloom-300' 
                    : 'border-transparent hover:border-muted'
                }`}
                onClick={() => {
                  setSelectedImage(image.url);
                  setSelectedColor(null);
                  setBackgroundType('image');
                }}
              >
                <img 
                  src={image.url} 
                  alt="Background option" 
                  className={`w-full h-full object-cover transition-all ${
                    grayscale ? 'grayscale' : ''
                  }`}
                  style={{ opacity }}
                  loading="lazy"
                />
                {selectedImage === image.url && (
                  <div className="absolute top-2 right-2 bg-biobloom-600 text-white rounded-full p-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          
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
          
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {colorPalette.map((color, index) => (
              <div 
                key={index}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedColor === color 
                    ? 'border-biobloom-600 ring-2 ring-biobloom-300' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedImage(null);
                  setBackgroundType('color');
                }}
              >
                {selectedColor === color && (
                  <div className="flex items-center justify-center h-full">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke={parseInt(color.slice(1), 16) > 0xffffff / 2 ? 'black' : 'white'} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t mt-4">
            <h4 className="font-medium mb-3">Ou decida você mesmo!</h4>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-1/2">
                <div className="flex items-center space-x-2 mb-2">
                  <Label htmlFor="customColor">Código hexadecimal:</Label>
                  <Input
                    id="customColor"
                    type="text"
                    placeholder="#RRGGBB"
                    value={selectedColor || ''}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      setSelectedImage(null);
                      setBackgroundType('color');
                    }}
                    className="w-32"
                  />
                  {selectedColor && (
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                  )}
                </div>
                <button 
                  onClick={() => setShowColorPicker(!showColorPicker)} 
                  className="text-sm text-primary underline mt-1"
                >
                  {showColorPicker ? 'Fechar seletor' : 'Abrir seletor de cores'}
                </button>
              </div>
              
              {showColorPicker && (
                <div className="w-full md:w-1/2">
                  <HexColorPicker 
                    color={selectedColor || '#893bf2'} 
                    onChange={(color) => {
                      setSelectedColor(color);
                      setSelectedImage(null);
                      setBackgroundType('color');
                    }}
                    className="w-full max-w-[240px]"
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
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
        <Label htmlFor="opacity">Opacidade</Label>
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
        className="w-full"
      />
    </div>
    
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="grayscale"
        checked={grayscale}
        onChange={(e) => setGrayscale(e.target.checked)}
        className="rounded border-gray-300"
      />
      <Label htmlFor="grayscale">Preto e branco</Label>
    </div>
  </div>
);
