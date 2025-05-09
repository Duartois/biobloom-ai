
import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProfileData } from '@/contexts/LinksContext';
import { Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

// Mock profile data - In a real app, this would come from an API
const mockProfiles: Record<string, ProfileData> = {
  'demo': {
    name: 'Demo User',
    username: 'demo',
    bio: 'This is a demo bio-page to showcase BioBloom features',
    profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    backgroundImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
    links: [
      { id: '1', title: 'My Portfolio', url: 'https://example.com/portfolio' },
      { id: '2', title: 'Latest Project', url: 'https://example.com/project' },
      { id: '3', title: 'Book a Call', url: 'https://calendly.com' },
      { id: '4', title: 'Join Newsletter', url: 'https://substack.com' },
    ],
    socialLinks: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
    },
    theme: 'default',
    themeColor: '#893bf2',
  }
};

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call to fetch the user profile
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if we have a mock profile or load from localStorage
        if (username && mockProfiles[username]) {
          setProfile(mockProfiles[username]);
        } else if (username) {
          // Try to load from localStorage (for testing user-created profiles)
          const storedProfiles = localStorage.getItem('biobloom-profiles');
          if (storedProfiles) {
            const profiles = JSON.parse(storedProfiles);
            if (profiles[username]) {
              setProfile(profiles[username]);
            } else {
              setError('Profile not found');
            }
          } else {
            setError('Profile not found');
          }
        } else {
          setError('Invalid username');
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // Generate a className for links based on the theme
  const getLinkClassName = (style?: string) => {
    const baseClasses = "w-full p-3 rounded-lg mb-3 transition-all duration-200";
    
    switch(style || profile?.theme) {
      case 'minimal':
        return `${baseClasses} bg-white/90 dark:bg-black/80 border border-gray-200 dark:border-gray-800 hover:shadow-md`;
      case 'neobrutal':
        return `${baseClasses} neo-card border-2 border-black dark:border-white bg-white dark:bg-black hover:-translate-y-1`;
      case 'glass':
        return `${baseClasses} glass-card hover:bg-white/40 dark:hover:bg-black/40`;
      case 'outline':
        return `${baseClasses} bg-transparent border-2 hover:bg-white/10 dark:hover:bg-black/10`;
      case 'ghost':
        return `${baseClasses} bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20`;
      case 'default':
      default:
        return `${baseClasses} bg-white/90 dark:bg-black/80 shadow hover:shadow-md`;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-biobloom-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <RouterLink to="/">
            Return to Home
          </RouterLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        {profile.backgroundImage ? (
          <img 
            src={profile.backgroundImage}
            alt="Background" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-biobloom-400 to-biobloom-700"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center px-4 py-8 max-w-md mx-auto w-full">
        {/* Profile */}
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white shadow-lg">
          {profile.profilePicture ? (
            <img 
              src={profile.profilePicture} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-biobloom-600 flex items-center justify-center text-white text-xl font-bold">
              {profile.name?.[0] || '?'}
            </div>
          )}
        </div>
        
        <h1 className="text-xl font-bold text-white mb-1">{profile.name}</h1>
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
        <div className="w-full max-w-xs space-y-3 mt-2">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={getLinkClassName(link.style)}
              style={{
                backgroundColor: link.style === 'default' ? (profile.themeColor || '#893bf2') : undefined,
                borderColor: link.style === 'outline' ? (profile.themeColor || '#893bf2') : undefined,
                color: link.style === 'default' ? '#fff' : undefined,
              }}
            >
              <span>{link.title}</span>
            </a>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-10 text-center">
          <a
            href="/"
            className="text-white/70 text-xs hover:text-white transition-colors"
          >
            Created with BioBloom
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
