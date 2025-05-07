
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLinks, ProfileData } from '@/contexts/LinksContext';
import { Loader2 } from 'lucide-react';
import BioLinkPreview from '@/components/profile/BioLinkPreview';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { fetchProfileByUsername } = useLinks();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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
      }, 8000); // 8 seconds timeout
      
      try {
        if (!username) {
          setError('Username não especificado');
          return;
        }

        console.log(`Tentando carregar perfil para username: ${username}`);
        
        // First, try to find the user with normalized username (all lowercase)
        const normalizedUsername = username.toLowerCase();
        
        // Attempt to fetch user first to get the correct user_id
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username')
          .ilike('username', normalizedUsername)
          .maybeSingle();
          
        if (userError) {
          console.error('Error fetching user:', userError);
          if (isMounted) {
            setError('Erro ao buscar usuário');
            setIsLoading(false);
          }
          clearTimeout(timeoutId);
          return;
        }
        
        if (!userData) {
          console.log('User not found in database');
          if (isMounted) {
            setError('Perfil não encontrado');
            setIsLoading(false);
          }
          clearTimeout(timeoutId);
          return;
        }
        
        console.log('User found:', userData);
        
        // With user_id, get profile data
        const profileData = await fetchProfileByUsername(normalizedUsername);
        
        if (!profileData && isMounted) {
          console.log('Profile data not found for user');
          setError('Dados do perfil não encontrados');
          setIsLoading(false);
          clearTimeout(timeoutId);
          return;
        }
        
        console.log('Profile data loaded successfully');
        
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
  }, [username, fetchProfileByUsername, retryCount]);

  // Handle retry button click
  const handleRetry = () => {
    setTimedOut(false);
    setError(null);
    setRetryCount(prev => prev + 1);
    toast.info("Tentando carregar perfil novamente...");
  };

  if (isLoading && !timedOut) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-festa-amarelo" aria-hidden="true" />
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
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleRetry} className="bg-festa-amarelo hover:bg-festa-laranja text-white">
            Tentar novamente
          </Button>
          <Button asChild variant="outline" className="border-festa-amarelo text-festa-amarelo">
            <Link to="/">
              Voltar para o Início
            </Link>
          </Button>
        </div>
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
