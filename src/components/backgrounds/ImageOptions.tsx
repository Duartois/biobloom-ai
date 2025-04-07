
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface ImageOptionsProps {
  opacity: number;
  setOpacity: (opacity: number) => void;
  grayscale: boolean;
  setGrayscale: (grayscale: boolean) => void;
}

export const ImageOptions: React.FC<ImageOptionsProps> = ({ 
  opacity, 
  setOpacity, 
  grayscale, 
  setGrayscale 
}) => (
  <div className="space-y-4 pt-4 border-t mt-4">
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="opacity">Opacidade</Label>
        <span className="text-sm text-muted-foreground">{Math.round(opacity * 100)}%</span>
      </div>
      <div className="px-1">
        <Slider
          id="opacity"
          min={20}
          max={100}
          step={5}
          value={[opacity * 100]}
          onValueChange={(values) => setOpacity(values[0] / 100)}
          className="w-full"
        />
      </div>
    </div>
    
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="grayscale">Preto e branco</Label>
      <Switch
        id="grayscale"
        checked={grayscale}
        onCheckedChange={setGrayscale}
      />
    </div>
  </div>
);
