
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

  // Login modificado para aceitar username ou email
  const login = async (usernameOrEmail: string, password: string) => {
    try {
      setLoading(true);
      
      let emailToUse = usernameOrEmail;
      
      // Se não for um email, buscar o email correspondente ao username
      if (!isEmail(usernameOrEmail)) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', usernameOrEmail)
          .maybeSingle();
          
        if (userError || !userData || !userData.email) {
          throw new Error("Usuário não encontrado. Verifique seu username.");
        }
        
        emailToUse = userData.email;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
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
          emailRedirectTo: window.location.origin + '/login',
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
        // (Não precisamos mais verificar aqui já que redirecionaremos para a página de confirmação)
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
    loading
  };
};
