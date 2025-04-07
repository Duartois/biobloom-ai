
import React from 'react';
import { Input } from "@/components/ui/input";
import { HexColorPicker } from 'react-colorful';
import { Label } from '@/components/ui/label';

interface ColorPickerSectionProps {
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export const ColorPickerSection: React.FC<ColorPickerSectionProps> = ({ 
  selectedColor, 
  onSelectColor 
}) => {
  return (
    <div className="pt-6 mt-6 border-t">
      <h4 className="text-base font-medium mb-4 text-center">Ou escolha uma cor personalizada</h4>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-xs mx-auto">
          <HexColorPicker 
            color={selectedColor || '#F8F9FA'} 
            onChange={onSelectColor}
            className="w-full"
          />
          
          <div className="mt-4 flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-md border border-gray-200" 
              style={{ backgroundColor: selectedColor || '#F8F9FA' }}
            >
            </div>
            
            <div className="flex-grow">
              <Label htmlFor="colorHex" className="sr-only">Código da cor</Label>
              <Input
                id="colorHex"
                type="text"
                placeholder="#RRGGBB"
                value={selectedColor || ''}
                onChange={(e) => onSelectColor(e.target.value)}
                className="font-mono text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
