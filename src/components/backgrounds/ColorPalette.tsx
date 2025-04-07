
import React from 'react';
import { Check } from 'lucide-react';

// Palette of solid colors - consistent across all pages
export const colorPalette = [
  "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD", 
  "#6C757D", "#495057", "#343A40", "#212529", "#F8BBD0", 
  "#F48FB1", "#FF80AB", "#D0F0C0", "#A8E6CF", "#1DE9B6", 
  "#90CAF9", "#64B5F6", "#42A5F5", "#FFF176", "#FFEE58", 
  "#FFCA28", "#FFA726", "#FF7043", "#8C9EFF", "#536DFE", 
  "#7C4DFF", "#E1BEE7", "#CE93D8", "#BA68C8",
];

interface ColorPaletteProps {
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
      {colorPalette.map((color, index) => (
        <div 
          key={index}
          className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
            selectedColor === color 
              ? 'border-blue-800 ring-2 ring-blue-400' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
        >
          {selectedColor === color && (
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
  );
};
