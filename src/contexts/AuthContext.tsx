
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { Database } from "@/integrations/supabase/types";

type PlanType = 'free' | 'starter' | 'pro' | 'premium' | 'trial';

type UserProfile = {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  plan: PlanType;
  createdAt: Date;
  trialStartDate?: Date;
  trialEndDate?: Date;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUserPlan: (plan: PlanType) => Promise<void>;
  getRemainingTrialDays: () => number;
  isTrialActive: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setUser(null);
        setLoading(false);
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
          plan: userData.plano_atual as PlanType,
          createdAt: new Date(userData.created_at),
          trialStartDate: userData.teste_ativo ? new Date(userData.created_at) : undefined,
          trialEndDate: userData.teste_expira_em ? new Date(userData.teste_expira_em) : undefined,
        };

        setUser(userProfile);
        
        // Check if trial has expired
        if (userProfile.plan === 'trial' && !isTrialActive(userProfile)) {
          // Trial expired, downgrade to free
          await updateUserPlanInDb(userId, 'free');
          userProfile.plan = 'free';
          toast.info("Seu período de teste gratuito expirou. Seu plano foi alterado para gratuito.");
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if trial is active
  const isTrialActive = (userToCheck: UserProfile | null = user) => {
    if (!userToCheck) return false;
    if (userToCheck.plan !== 'trial') return false;
    if (!userToCheck.trialEndDate) return false;
    
    const now = new Date();
    return now < userToCheck.trialEndDate;
  };

  // Helper to calculate remaining days in trial
  const getRemainingTrialDays = () => {
    if (!user || !isTrialActive()) return 0;
    if (!user.trialEndDate) return 0;
    
    const now = new Date();
    const diffTime = user.trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success("Login realizado com sucesso!");
      // User data will be set by the auth state listener
      
    } catch (error: any) {
      toast.error(error.message || "Falha no login. Por favor verifique suas credenciais.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      console.log('Registering user:', email, username);
      
      // First check if username is taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
      
      if (existingUser) {
        toast.error("Este nome de usuário já está em uso.");
        throw new Error("Este nome de usuário já está em uso.");
      }

      // Create user in auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name: username, // Default name to username initially
          },
        }
      });

      console.log('User registration response:', data, error);

      if (error) {
        throw error;
      }

      if (data.user) {
        // The trigger should create the profile, but let's give it a second to complete
        toast.success("Cadastro realizado com sucesso! Você tem acesso ao plano Pro por 7 dias.");
        
        // Wait a moment for the database trigger to create the user
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify the user was created correctly in the database
        await fetchUserData(data.user.id);
      } else {
        toast.info("Por favor, verifique seu email para confirmar o cadastro.");
      }
      
    } catch (error: any) {
      toast.error(error.message || "Falha no cadastro. Por favor tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlanInDb = async (userId: string, plan: PlanType) => {
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

  const updateUserPlan = async (plan: PlanType) => {
    try {
      if (!user) throw new Error('Usuário não encontrado');
      
      await updateUserPlanInDb(user.id, plan);
      
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, plan };
      });
      
      toast.success(`Seu plano foi atualizado para ${plan}!`);
    } catch (error: any) {
      toast.error("Falha ao atualizar plano.");
      console.error('Update plan error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info("Você foi desconectado");
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUserPlan,
        getRemainingTrialDays,
        isTrialActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
