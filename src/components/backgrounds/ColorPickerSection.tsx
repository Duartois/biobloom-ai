
import React from 'react';
import { Input } from "@/components/ui/input";
import { HexColorPicker } from 'react-colorful';

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
      <h4 className="font-medium mb-4 text-center">Ou decida você mesmo!</h4>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-xs mx-auto">
          <HexColorPicker 
            color={selectedColor || '#0f172a'} 
            onChange={onSelectColor}
            className="w-full"
          />
          
          <div className="mt-4 flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-md border border-gray-200" 
              style={{ backgroundColor: selectedColor || '#0f172a' }}
            >
            </div>
            
            <Input
              type="text"
              placeholder="#RRGGBB"
              value={selectedColor || ''}
              onChange={(e) => onSelectColor(e.target.value)}
              className="flex-grow font-mono text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
