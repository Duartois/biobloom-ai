
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLinks, ProfileData } from '@/contexts/LinksContext';
import { Loader2 } from 'lucide-react';
import BioLinkPreview from '@/components/profile/BioLinkPreview';
import { supabase } from '@/integrations/supabase/client';

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { fetchProfileByUsername } = useLinks();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (isMounted && isLoading) {
          setTimedOut(true);
          setError('Tempo esgotado ao carregar o perfil. Por favor, tente novamente.');
        }
      }, 8000); // Reduced to 8 seconds timeout
      
      try {
        if (!username) {
          setError('Username não especificado');
          return;
        }

        // Attempt to fetch profile directly from database first for faster loading
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username')
          .eq('username', username)
          .single();
          
        if (userError || !userData) {
          console.log('User not found in database:', userError);
          if (isMounted) {
            setError('Perfil não encontrado');
            setIsLoading(false);
          }
          clearTimeout(timeoutId);
          return;
        }
        
        const profileData = await fetchProfileByUsername(username);
        
        if (!profileData && isMounted) {
          setError('Perfil não encontrado');
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }
        
        if (isMounted) {
          setProfile(profileData);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        if (isMounted) {
          setError('Erro ao carregar o perfil');
          setIsLoading(false);
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();
    
    return () => {
      isMounted = false;
    };
  }, [username, fetchProfileByUsername, isLoading]);

  if (isLoading && !timedOut) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-800 dark:text-white" aria-hidden="true" />
          <p className="text-gray-600 dark:text-gray-300">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile || timedOut) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Perfil não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          {error || 'O perfil que você está procurando não existe ou foi removido.'}
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
          username={username || ''}
          className="w-full h-[600px] mx-auto"
          aria-label={`Perfil público de ${profile.name || username}`}
        />
      </div>
    </div>
  );
};

export default PublicProfile;
