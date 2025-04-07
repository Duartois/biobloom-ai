
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLinks, ProfileData } from '@/contexts/LinksContext';
import { Instagram, Twitter, Linkedin, Youtube, Loader2, ExternalLink } from 'lucide-react';

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { fetchProfileByUsername } = useLinks();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      try {
        if (!username) {
          setError('Username não especificado');
          return;
        }

        const profileData = await fetchProfileByUsername(username);
        
        if (!profileData) {
          setError('Perfil não encontrado');
          return;
        }
        
        setProfile(profileData);
      } catch (err) {
        setError('Erro ao carregar o perfil');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username, fetchProfileByUsername]);

  // Generate a className for links based on the theme
  const getLinkClassName = (style?: string) => {
    const baseClasses = "w-full p-3.5 rounded-lg mb-3 transition-all text-center flex items-center justify-center";
    
    switch(style || profile?.theme) {
      case 'minimal':
        return `${baseClasses} bg-white/90 dark:bg-black/80 border border-gray-200 dark:border-gray-700 hover:scale-[1.01] hover:shadow-sm`;
      case 'neobrutal':
        return `${baseClasses} border-2 border-black dark:border-white bg-white/90 dark:bg-black/80 hover:-translate-y-1 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff]`;
      case 'glass':
        return `${baseClasses} backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/20 dark:border-black/20 hover:bg-white/30 dark:hover:bg-black/30`;
      case 'outline':
        return `${baseClasses} bg-transparent border-2 hover:bg-white/10 dark:hover:bg-black/10`;
      case 'ghost':
        return `${baseClasses} bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20`;
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Perfil não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          O perfil que você está procurando não existe ou foi removido.
        </p>
        <Button asChild className="bg-black hover:bg-black/90 text-white">
          <Link to="/">
            Voltar para o Início
          </Link>
        </Button>
      </div>
    );
  }

  const isDarkBg = profile.background_type === 'color' && 
    parseInt((profile.themeColor || '#FFFFFF').replace('#', ''), 16) < 0xffffff / 2;

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
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
              backgroundColor: profile.themeColor || '#FFFFFF',
              opacity: profile.opacity
            }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center px-4 py-10 max-w-md mx-auto w-full">
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
          {profile.profilePicture ? (
            <img 
              src={profile.profilePicture} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold">
              {profile.name?.[0] || '?'}
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <h1 className="text-xl font-bold text-white mb-2 text-center">{profile.name}</h1>
        <div className="w-12 h-1 bg-white/50 rounded-full mb-3"></div>
        {profile.bio && (
          <p className="text-white/90 text-center mb-6 max-w-xs">{profile.bio}</p>
        )}
        
        {/* Social Links */}
        {profile.socialLinks && (
          <div className="flex space-x-3 mb-6">
            {profile.socialLinks.instagram && (
              <a 
                href={profile.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
            )}
            {profile.socialLinks.twitter && (
              <a 
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>
            )}
            {profile.socialLinks.linkedin && (
              <a 
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-white" />
              </a>
            )}
            {profile.socialLinks.youtube && (
              <a 
                href={profile.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Youtube className="h-5 w-5 text-white" />
              </a>
            )}
          </div>
        )}
        
        {/* Links */}
        <div className="w-full max-w-sm space-y-3 mt-2">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={ensureProtocol(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={getLinkClassName(link.style)}
              style={{
                backgroundColor: link.style === 'default' ? (profile.themeColor || '#F5F5F5') : undefined,
                borderColor: link.style === 'outline' ? (profile.themeColor || '#F5F5F5') : undefined,
                color: link.style === 'default' && 
                  profile.background_type === 'color' && 
                  parseInt((profile.themeColor || '#FFFFFF').replace('#', ''), 16) > 0xffffff / 2 ? 
                  '#000' : '#fff',
              }}
            >
              <span className="font-medium">{link.title}</span>
            </a>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-10 text-center">
          <a
            href="/"
            className="text-white/70 text-xs hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            Criado com BioBloom
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
