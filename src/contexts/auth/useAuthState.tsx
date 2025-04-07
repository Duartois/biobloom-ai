
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from './types';
import { createUserRecord } from './userOperations';

export const useAuthState = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        
        // Only perform synchronous updates in the callback
        if (currentSession?.user) {
          // Defer Supabase calls with setTimeout to avoid deadlocks
          setTimeout(() => {
            fetchUserData(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
          setNeedsOnboarding(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Checking existing session:', currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      // Fetch user data from our custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setLoading(false);
        
        // Verificar se o usuário existe na auth mas não na tabela users
        if (userError.code === 'PGRST116') {
          // O usuário existe na autenticação mas não na tabela users
          // Vamos criar o usuário manualmente
          await createUserRecord();
          return;
        }
        
        setUser(null);
        return;
      }

      if (userData) {
        console.log('User data fetched:', userData);
        // Convert string dates to Date objects
        const userProfile: UserProfile = {
          id: userData.id,
          username: userData.username,
          email: userData.email || '',
          name: userData.name,
          plan: userData.plano_atual as any,
          createdAt: new Date(userData.created_at),
          trialStartDate: userData.teste_ativo ? new Date(userData.created_at) : undefined,
          trialEndDate: userData.teste_expira_em ? new Date(userData.teste_expira_em) : undefined,
        };

        // Verificar se o usuário precisa passar pelo onboarding
        const { data: profileData } = await supabase
          .from('profiles')
          .select('bio, imagem_fundo, background_type, cor_fundo')
          .eq('user_id', userId)
          .maybeSingle();

        // Considerar que precisa de onboarding se não tiver bio ou plano de fundo definidos
        const requiresOnboarding = !profileData || 
          !profileData.bio || 
          (!profileData.background_type && !profileData.cor_fundo);
           
        setNeedsOnboarding(requiresOnboarding);
        console.log('Needs onboarding?', requiresOnboarding, profileData);
        
        // Set the needsOnboarding property on the user profile
        userProfile.needsOnboarding = requiresOnboarding;
        setUser(userProfile);
        
        // Check if trial has expired
        if (userProfile.plan === 'trial' && !isTrialActive(userProfile)) {
          // Trial expired, downgrade to free
          await updateUserPlanInDb(userId, 'free');
          userProfile.plan = 'free';
          toast.info("Seu período de teste gratuito expirou. Seu plano foi alterado para gratuito.");
        }
      } else {
        // Usuário não encontrado na tabela users
        await createUserRecord();
        await fetchUserData(userId);
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if trial is active
  const isTrialActive = (userToCheck: UserProfile | null) => {
    if (!userToCheck) return false;
    if (userToCheck.plan !== 'trial') return false;
    if (!userToCheck.trialEndDate) return false;
    
    const now = new Date();
    return now < userToCheck.trialEndDate;
  };

  const updateUserPlanInDb = async (userId: string, plan: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ plano_atual: plan })
        .eq('id', userId);

      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error updating user plan:', error);
      throw error;
    }
  };

  return { user, setUser, session, loading, needsOnboarding };
};
