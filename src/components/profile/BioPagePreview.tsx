
import React from 'react';
import { ProfileData } from '@/contexts/LinksContext';
import { ExternalLink } from 'lucide-react';

interface BioPagePreviewProps {
  profile: Partial<ProfileData>;
  username?: string;
  compact?: boolean;
  className?: string;
}

const BioPagePreview: React.FC<BioPagePreviewProps> = ({ 
  profile, 
  username, 
  compact = false,
  className = '' 
}) => {
  // Get styles for links based on theme selection
  const getLinkClassName = (style?: string) => {
    const baseClasses = "w-full p-2 rounded-lg mb-2 text-center transition-all text-sm duration-200";
    
    switch(style || profile.theme) {
      case 'minimal':
        return `${baseClasses} bg-white/90 dark:bg-black/80 border border-gray-200 dark:border-gray-800 hover:shadow-md`;
      case 'neobrutal':
        return `${baseClasses} neo-card border-2 border-black dark:border-white bg-white dark:bg-black hover:-translate-y-1`;
      case 'glass':
        return `${baseClasses} glass-card hover:bg-white/40 dark:hover:bg-black/40`;
      case 'default':
      default:
        return `${baseClasses} bg-white/90 dark:bg-black/80 shadow hover:shadow-md`;
    }
  };

  // Function to ensure URL has a protocol
  const ensureProtocol = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  const containerClasses = compact 
    ? "w-full h-full max-w-full" 
    : "w-56 h-96 border rounded-xl shadow-lg";

  return (
    <div className={`${containerClasses} overflow-hidden relative ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        {profile.background_type === 'image' && profile.backgroundImage ? (
          <img 
            src={profile.backgroundImage}
            alt="Background" 
            className={`w-full h-full object-cover ${profile.grayscale ? 'grayscale' : ''}`}
            style={{ opacity: profile.opacity }}
          />
        ) : (
          <div 
            className={`w-full h-full ${profile.grayscale ? 'grayscale' : ''}`}
            style={{ 
              backgroundColor: profile.themeColor || '#893bf2',
              opacity: profile.opacity
            }}
          ></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center p-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-white border-2 border-white mt-6 mb-2">
          {profile.profilePicture ? (
            <img 
              src={profile.profilePicture} 
              alt={profile.name || ''} 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-biobloom-600 flex items-center justify-center text-white text-xl font-bold">
              {profile.name?.[0] || '?'}
            </div>
          )}
        </div>
        
        {/* Name & Bio */}
        <h3 className="text-lg font-bold text-white mb-1">{profile.name || 'Seu Nome'}</h3>
        <p className="text-xs text-white/80 mb-4 text-center line-clamp-3">
          {profile.bio || 'Sua descrição aparecerá aqui'}
        </p>
        
        {/* Links */}
        <div className="w-full space-y-2 flex-grow overflow-y-auto scrollbar-none">
          {profile.links?.slice(0, 4).map((link, index) => (
            <div 
              key={index} 
              className={getLinkClassName(link.style)}
              style={{
                backgroundColor: link.style === 'default' ? (profile.themeColor || '#893bf2') : undefined,
                borderColor: link.style === 'outline' ? (profile.themeColor || '#893bf2') : undefined,
                color: link.style === 'default' ? '#fff' : undefined,
              }}
            >
              <span>{link.title}</span>
            </div>
          ))}
          
          {(!profile.links || profile.links.length === 0) && (
            <>
              <div className={getLinkClassName()}>
                <span>Seu Primeiro Link</span>
              </div>
              <div className={getLinkClassName()}>
                <span>Segundo Link</span>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        {username && (
          <div className="mt-2 pt-1 text-white/60 text-xs flex items-center">
            <a href={`/${username}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
              Ver página <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
        
        <div className="text-white/50 text-xs mt-1">
          BioBloom
        </div>
      </div>
    </div>
  );
};

export default BioPagePreview;
