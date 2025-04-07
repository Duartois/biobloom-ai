
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
    const baseClasses = "w-full p-3 rounded-lg mb-3 text-center transition-all flex items-center justify-center";
    
    switch(style || profile.theme) {
      case 'minimal':
        return `${baseClasses} bg-white/90 dark:bg-black/80 border border-gray-200 dark:border-gray-700 hover:scale-[1.01] hover:shadow-sm`;
      case 'neobrutal':
        return `${baseClasses} border-2 border-black dark:border-white bg-white/90 dark:bg-black/80 hover:-translate-y-1 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff]`;
      case 'glass':
        return `${baseClasses} backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/20 dark:border-black/20 hover:bg-white/30 dark:hover:bg-black/30`;
      case 'default':
      default:
        return `${baseClasses} bg-white/90 dark:bg-black/80 shadow-sm hover:shadow`;
    }
  };

  // Function to ensure URL has a protocol
  const ensureProtocol = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  // Use a default light gray color if no theme color is set
  const defaultBackgroundColor = '#F8F9FA';
  const containerClasses = compact 
    ? "w-full h-full max-w-full" 
    : "w-[280px] h-[560px] border rounded-3xl shadow-lg";

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
              backgroundColor: profile.themeColor || defaultBackgroundColor,
              opacity: profile.opacity
            }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center px-6 py-10">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-white border-4 border-white mb-4 flex items-center justify-center overflow-hidden">
          {profile.profilePicture ? (
            <img 
              src={profile.profilePicture} 
              alt={profile.name || ''} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold">
              {profile.name?.[0] || '?'}
            </div>
          )}
        </div>
        
        {/* Name & Bio */}
        <h3 className="text-lg font-bold text-white text-center mb-2">
          {profile.name || 'Seu Nome'}
        </h3>
        <div className="w-12 h-1 bg-white/50 rounded-full mb-3"></div>
        <p className="text-xs text-white/90 mb-6 text-center max-w-[90%] line-clamp-3">
          {profile.bio || 'Sua descrição aparecerá aqui. Adicione uma biografia curta para compartilhar quem você é.'}
        </p>
        
        {/* Links */}
        <div className="w-full space-y-2 flex-grow overflow-y-auto scrollbar-none px-1">
          {profile.links?.slice(0, 5).map((link, index) => (
            <div 
              key={index} 
              className={getLinkClassName(link.style)}
              style={{
                backgroundColor: link.style === 'default' ? (profile.themeColor || '#F5F5F5') : undefined,
                borderColor: link.style === 'outline' ? (profile.themeColor || '#F5F5F5') : undefined,
                color: link.style === 'default' && parseInt((profile.themeColor || '#FFFFFF').replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff',
              }}
            >
              <span className="font-medium">{link.title || 'Link'}</span>
            </div>
          ))}
          
          {(!profile.links || profile.links.length === 0) && (
            <>
              <div className={getLinkClassName('default')}>
                <span className="font-medium">Meu Primeiro Link</span>
              </div>
              <div className={getLinkClassName('default')}>
                <span className="font-medium">Meu Site</span>
              </div>
              <div className={getLinkClassName('default')}>
                <span className="font-medium">Contato</span>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        {username && (
          <div className="pt-2 text-white/70 text-xs flex items-center">
            <a href={`/${username}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
              Ver página <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
        
        <div className="text-white/60 text-xs mt-2 flex items-center">
          <span>BioBloom</span>
        </div>
      </div>
    </div>
  );
};

export default BioPagePreview;
