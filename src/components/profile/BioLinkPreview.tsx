
import React, { useMemo } from 'react';
import { ProfileData } from '@/contexts/LinksContext';
import { ExternalLink, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ensureProtocol, DEFAULT_BACKGROUND_COLOR } from '@/types/bio';

interface BioLinkPreviewProps {
  profile: Partial<ProfileData>;
  username: string;
  compact?: boolean;
  className?: string;
  'aria-label'?: string;
}

const BioLinkPreview: React.FC<BioLinkPreviewProps> = ({ 
  profile, 
  username, 
  compact = false,
  className = '',
  'aria-label': ariaLabel
}) => {
  // Get styles for links based on theme selection
  const getLinkClassName = useMemo(() => (style?: string) => {
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
        return `${baseClasses} bg-[#1B3B5A]/90 text-white hover:bg-[#1B3B5A]/80 shadow-sm hover:shadow`;
    }
  }, [profile.theme]);
  
  const containerClasses = compact 
    ? "w-full h-full max-w-full" 
    : "w-[320px] h-[600px] border rounded-3xl shadow-lg";
    
  // Verificamos se a URL tem protocolo para links de redes sociais
  const socialLinks = useMemo(() => {
    if (!profile.socialLinks) return null;
    
    return {
      instagram: profile.socialLinks.instagram ? ensureProtocol(profile.socialLinks.instagram) : null,
      twitter: profile.socialLinks.twitter ? ensureProtocol(profile.socialLinks.twitter) : null,
      linkedin: profile.socialLinks.linkedin ? ensureProtocol(profile.socialLinks.linkedin) : null,
      youtube: profile.socialLinks.youtube ? ensureProtocol(profile.socialLinks.youtube) : null,
    };
  }, [profile.socialLinks]);

  return (
    <div 
      className={cn(containerClasses, "overflow-hidden relative", className)}
      aria-label={ariaLabel}
    >
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        {profile.background_type === 'image' && profile.backgroundImage ? (
          <img 
            src={profile.backgroundImage}
            alt="" 
            className={`w-full h-full object-cover ${profile.grayscale ? 'grayscale' : ''}`}
            style={{ opacity: profile.opacity !== undefined ? profile.opacity : 1 }}
            aria-hidden="true"
          />
        ) : (
          <div 
            className={`w-full h-full ${profile.grayscale ? 'grayscale' : ''}`}
            style={{ 
              backgroundColor: profile.themeColor || DEFAULT_BACKGROUND_COLOR,
              opacity: profile.opacity !== undefined ? profile.opacity : 1
            }}
            aria-hidden="true"
          ></div>
        )}
        {/* Overlay gradient for better text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"
          aria-hidden="true"
        ></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center px-6 py-10 overflow-auto scrollbar-none">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-white border-4 border-white mb-4 flex items-center justify-center overflow-hidden shadow-lg">
          {profile.profilePicture ? (
            <img 
              src={profile.profilePicture} 
              alt={profile.name ? `Foto de ${profile.name}` : 'Foto de perfil'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold">
              {profile.name?.[0] || '?'}
            </div>
          )}
        </div>
        
        {/* Name & Bio */}
        <h3 className="text-xl font-bold text-white text-center mb-1">
          {profile.name || 'Seu Nome'}
        </h3>
        
        <div className="text-sm text-white/80 mb-2 text-center">
          @{username || 'username'}
        </div>
        
        <div className="w-12 h-1 bg-white/50 rounded-full mb-4" aria-hidden="true"></div>
        
        <p className="text-sm text-white/90 mb-6 text-center max-w-[90%] line-clamp-3">
          {profile.bio || 'Sua descrição aparecerá aqui. Adicione uma biografia curta para compartilhar quem você é.'}
        </p>
        
        {/* Links */}
        <div className="w-full space-y-3 flex-grow overflow-y-auto scrollbar-none px-1">
          {profile.links?.slice(0, 8).map((link, index) => (
            <a 
              key={index} 
              href={ensureProtocol(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={getLinkClassName(link.style)}
              style={{
                backgroundColor: link.style === 'default' ? (profile.themeColor || '#1B3B5A') : undefined,
                borderColor: link.style === 'outline' ? (profile.themeColor || '#1B3B5A') : undefined,
              }}
              aria-label={`Link para ${link.title || 'site'}`}
            >
              <span className="font-medium">{link.title || 'Link'}</span>
            </a>
          ))}
          
          {(!profile.links || profile.links.length === 0) && (
            <>
              <div className={getLinkClassName()} aria-hidden="true">
                <span className="font-medium">Meu Primeiro Link</span>
              </div>
              <div className={getLinkClassName()} aria-hidden="true">
                <span className="font-medium">Meu Site</span>
              </div>
              <div className={getLinkClassName()} aria-hidden="true">
                <span className="font-medium">Contato</span>
              </div>
            </>
          )}
        </div>
        
        {/* Social Links */}
        {socialLinks && (
          <div className="flex space-x-4 mt-4 mb-3">
            {socialLinks.instagram && (
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" aria-hidden="true" />
              </a>
            )}
            {socialLinks.twitter && (
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-white" aria-hidden="true" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-white" aria-hidden="true" />
              </a>
            )}
            {socialLinks.youtube && (
              <a 
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-white" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
        
        {/* Footer */}
        {username && !compact && (
          <div className="pt-2 text-white/70 text-xs flex items-center">
            <a 
              href={`/${username}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center hover:text-white transition-colors"
              aria-label="Ver bio link em nova janela"
            >
              Ver bio link <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
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

export default BioLinkPreview;
