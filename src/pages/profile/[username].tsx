
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLinks, ProfileData } from '@/contexts/LinksContext';
import { Loader2 } from 'lucide-react';
import BioLinkPreview from '@/components/profile/BioLinkPreview';

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
        console.log('Profile data loaded:', profileData);
      } catch (err) {
        setError('Erro ao carregar o perfil');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username, fetchProfileByUsername]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-800 dark:text-white" />
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
        <Button asChild className="bg-blue-800 hover:bg-blue-700 text-white">
          <Link to="/">
            Voltar para o Início
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <BioLinkPreview 
          profile={profile}
          username={username}
          className="w-full h-[600px] mx-auto"
        />
      </div>
    </div>
  );
};

export default PublicProfile;
