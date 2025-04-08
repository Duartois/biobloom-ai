
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { createUserRecord } from './userOperations';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Função para verificar se o usuário precisa fazer onboarding
  const checkNeedsOnboarding = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('bio, imagem_fundo, background_type, cor_fundo')
        .eq('user_id', userId)
        .single();

      console.info('Needs onboarding?', !data?.bio, data);
      
      // Usuário precisa de onboarding se não tiver um perfil com bio definida
      setNeedsOnboarding(!data?.bio);
      return !data?.bio;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Em caso de erro, assumimos que o usuário precisa de onboarding
      setNeedsOnboarding(true);
      return true;
    }
  };

  // Função para buscar dados do usuário
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.info('User data fetched:', data);

      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }

      await checkNeedsOnboarding(userId);
      return data;
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      return null;
    }
  };

  // Marcar onboarding como concluído
  const setOnboardingCompleted = () => {
    setNeedsOnboarding(false);
  };

  useEffect(() => {
    // Configurar o listener de mudança de estado de autenticação
    console.info('Setting up auth state listener');
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info('Auth state changed:', event, session?.user?.id);
      setSession(session);

      if (session?.user) {
        console.info('Fetching user data for:', session.user.id);
        const userData = await fetchUserData(session.user.id);
        
        // Configurar o objeto de usuário com dados do banco e da sessão
        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: userData?.username || session.user.user_metadata.username || '',
          name: userData?.name || session.user.user_metadata.name || '',
          plan: userData?.plano_atual || 'trial',
          createdAt: session.user.created_at || '',
          trialExpiresAt: userData?.teste_expira_em || null,
          trialActive: userData?.teste_ativo || false,
        });
      } else {
        setUser(null);
      }
    });

    // Verificar sessão existente ao inicializar
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.info('Checking existing session:', data.session?.user?.id);
      
      setSession(data.session);
      
      if (data.session?.user) {
        console.info('Fetching user data for:', data.session.user.id);
        const userData = await fetchUserData(data.session.user.id);
        
        if (userData) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email!,
            username: userData.username || data.session.user.user_metadata.username || '',
            name: userData.name || data.session.user.user_metadata.name || '',
            plan: userData.plano_atual || 'trial',
            createdAt: data.session.user.created_at || '',
            trialExpiresAt: userData.teste_expira_em || null,
            trialActive: userData.teste_ativo || false,
          });
        } else {
          // Se não conseguir buscar dados do usuário, tentar criar um registro
          await createUserRecord();
        }
      }
      
      setLoading(false);
    };

    initSession();

    // Limpar listener ao desmontar componente
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return {
    user,
    session,
    loading,
    needsOnboarding,
    setOnboardingCompleted,
  };
}
