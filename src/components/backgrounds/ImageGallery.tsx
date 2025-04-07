
import React from 'react';
import { Check } from 'lucide-react';

// Background image suggestions - same 20 images used across all pages
export const backgroundImages = [
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

interface ImageGalleryProps {
  selectedImage: string | null;
  onSelectImage: (url: string) => void;
  grayscale: boolean;
  opacity: number;
  showOpacityOnPreviewOnly?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  selectedImage, 
  onSelectImage,
  grayscale,
  opacity,
  showOpacityOnPreviewOnly = false
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {backgroundImages.map(image => (
        <div 
          key={image.id}
          className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
            selectedImage === image.url 
              ? 'border-blue-800 ring-2 ring-blue-400' 
              : 'border-transparent hover:border-muted'
          }`}
          onClick={() => onSelectImage(image.url)}
        >
          <img 
            src={image.url} 
            alt="Background option" 
            className={`w-full h-full object-cover transition-all ${
              grayscale ? 'grayscale' : ''
            }`}
            style={{ opacity: showOpacityOnPreviewOnly ? 1 : opacity }}
            loading="lazy"
          />
          {selectedImage === image.url && (
            <div className="absolute top-2 right-2 bg-blue-800 text-white rounded-full p-1 shadow-sm">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
