
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, PlanType } from './types';

export const useAuthMethods = (user: UserProfile | null) => {
  const [loading, setLoading] = useState(false);

  // Função para verificar se o input é um email
  const isEmail = (input: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  // Function to normalize username (all lowercase, remove invalid chars)
  const normalizeUsername = (username: string): string => {
    return username.toLowerCase().replace(/[^a-z0-9_]/g, '');
  };

  // Login modificado para aceitar username ou email
  const login = async (usernameOrEmail: string, password: string) => {
    try {
      setLoading(true);
      
      let emailToUse = usernameOrEmail;
      
      // Se não for um email, buscar o email correspondente ao username
      if (!isEmail(usernameOrEmail)) {
        // Normalize username for consistency
        const normalizedUsername = normalizeUsername(usernameOrEmail);
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .ilike('username', normalizedUsername)
          .maybeSingle();
          
        if (userError || !userData || !userData.email) {
          console.error('Error finding user by username:', userError);
          throw new Error("Usuário não encontrado. Verifique seu nome de usuário.");
        }
        
        emailToUse = userData.email;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password
      });

      if (error) {
        console.error('Login error:', error);
        // Personalizar a mensagem de erro
        if (error.message.includes('Invalid login credentials')) {
          throw new Error("Credenciais inválidas. Verifique seu email/usuário e senha.");
        }
        throw error;
      }

      if (!data.user) {
        throw new Error("Falha no login. Por favor verifique suas credenciais.");
      }

      // Verificar se o email foi confirmado
      if (!data.user.email_confirmed_at) {
        // Fazer logout e informar o usuário que precisa confirmar o email
        await supabase.auth.signOut();
        throw new Error("Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.");
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
      
      // Normalize username for consistency
      const normalizedUsername = normalizeUsername(username);
      
      console.log('Registering user:', email, normalizedUsername);
      
      // First check if username is taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .ilike('username', normalizedUsername)
        .maybeSingle();
      
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
            username: normalizedUsername,
            name: normalizedUsername, // Default name to username initially
          },
          emailRedirectTo: window.location.origin + '/login',
        }
      });

      console.log('User registration response:', data, error);

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success("Cadastro realizado com sucesso! Verifique seu email para ativar sua conta.");
        
        // Deslogar o usuário após o registro para que ele só faça login após confirmar o email
        await supabase.auth.signOut();

        // Wait a moment for the database trigger to create the user
        await new Promise(resolve => setTimeout(resolve, 500));
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
      
      // The user state will be updated by the auth state listener
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

  // Helper to check if trial is active
  const isTrialActive = () => {
    if (!user) return false;
    if (user.plan !== 'trial') return false;
    if (!user.trialEndDate) return false;
    
    const now = new Date();
    return now < user.trialEndDate;
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

  return {
    login,
    register,
    logout,
    updateUserPlan,
    getRemainingTrialDays,
    isTrialActive,
    loading,
    normalizeUsername
  };
};
