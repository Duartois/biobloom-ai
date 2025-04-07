
import React from 'react';
import { Label } from "@/components/ui/label";

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
      <input
        type="range"
        id="opacity"
        min="0.2"
        max="1"
        step="0.05"
        value={opacity}
        onChange={(e) => setOpacity(parseFloat(e.target.value))}
        className="w-full accent-blue-800"
      />
    </div>
    
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="grayscale"
        checked={grayscale}
        onChange={(e) => setGrayscale(e.target.checked)}
        className="rounded border-gray-300 accent-blue-800"
      />
      <Label htmlFor="grayscale">Preto e branco</Label>
    </div>
  </div>
);
