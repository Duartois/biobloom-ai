
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackgroundSelector } from '@/components/backgrounds/BackgroundSelector';

interface AppearanceTabProps {
  theme: string;
  backgroundType: 'color' | 'image';
  backgroundImage: string;
  themeColor: string;
  opacity: number;
  grayscale: boolean;
  onSelectChange: (name: string, value: string) => void;
  onBackgroundTypeChange: (type: 'color' | 'image') => void;
  onBackgroundSelection: (url: string) => void;
  onColorSelection: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  onGrayscaleChange: (grayscale: boolean) => void;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({
  theme,
  backgroundType,
  backgroundImage,
  themeColor,
  opacity,
  grayscale,
  onSelectChange,
  onBackgroundTypeChange,
  onBackgroundSelection,
  onColorSelection,
  onOpacityChange,
  onGrayscaleChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="theme">Estilo dos Links</Label>
        <Select
          value={theme}
          onValueChange={(value) => onSelectChange('theme', value)}
        >
          <SelectTrigger className="w-full focus:ring-2 focus:ring-offset-1 focus:ring-blue-800">
            <SelectValue placeholder="Selecione um estilo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Padrão</SelectItem>
            <SelectItem value="minimal">Minimalista</SelectItem>
            <SelectItem value="neobrutal">Neo-brutal</SelectItem>
            <SelectItem value="glass">Vidro</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Escolha como seus links serão exibidos
        </p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-base font-medium">Plano de Fundo</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Personalize o fundo da sua Bio-page
        </p>
        
        <BackgroundSelector
          backgroundType={backgroundType}
          setBackgroundType={onBackgroundTypeChange}
          selectedImage={backgroundImage}
          setSelectedImage={onBackgroundSelection}
          selectedColor={themeColor}
          setSelectedColor={onColorSelection}
          opacity={opacity}
          setOpacity={onOpacityChange}
          grayscale={grayscale}
          setGrayscale={onGrayscaleChange}
          showOpacityOnPreviewOnly={true}
        />
      </div>
    </div>
  );
};
