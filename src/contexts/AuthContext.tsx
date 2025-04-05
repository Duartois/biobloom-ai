
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from "sonner";

type PlanType = 'free' | 'starter' | 'pro' | 'premium' | 'trial';

type User = {
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
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('biobloom-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Convert string dates back to Date objects
        if (parsedUser.createdAt) parsedUser.createdAt = new Date(parsedUser.createdAt);
        if (parsedUser.trialStartDate) parsedUser.trialStartDate = new Date(parsedUser.trialStartDate);
        if (parsedUser.trialEndDate) parsedUser.trialEndDate = new Date(parsedUser.trialEndDate);
        
        setUser(parsedUser);
        
        // Check if trial has expired
        if (parsedUser.plan === 'trial' && !isTrialActive(parsedUser)) {
          // Trial expired, downgrade to free
          const updatedUser = { ...parsedUser, plan: 'free' as PlanType };
          setUser(updatedUser);
          localStorage.setItem('biobloom-user', JSON.stringify(updatedUser));
          toast.info("Seu período de teste gratuito expirou. Seu plano foi alterado para gratuito.");
        }
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('biobloom-user');
      }
    }
    setLoading(false);
  }, []);

  // Helper to check if trial is active
  const isTrialActive = (userToCheck: User | null = user) => {
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
      
      // Mock login for demo purposes
      if (email && password) {
        // This would be replaced with actual auth call
        const mockUser: User = {
          id: 'user-123',
          username: email.split('@')[0],
          email,
          name: 'Usuário Demo',
          bio: 'Este é um perfil de demonstração',
          plan: 'free',
          createdAt: new Date(),
        };
        
        setUser(mockUser);
        localStorage.setItem('biobloom-user', JSON.stringify(mockUser));
        toast.success("Login realizado com sucesso!");
      } else {
        throw new Error('Email e senha são obrigatórios');
      }
    } catch (error) {
      toast.error("Falha no login. Por favor verifique suas credenciais.");
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      // Mock registration
      if (email && password && username) {
        // Initialize trial period (7 days)
        const trialStartDate = new Date();
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        // This would be replaced with actual auth registration
        const mockUser: User = {
          id: 'user-' + Date.now(),
          username,
          email,
          name: username,
          bio: '',
          plan: 'trial', // Start with trial plan
          createdAt: new Date(),
          trialStartDate,
          trialEndDate,
        };
        
        setUser(mockUser);
        localStorage.setItem('biobloom-user', JSON.stringify(mockUser));
        toast.success("Cadastro realizado com sucesso! Você tem acesso ao plano Pro por 7 dias.");
      } else {
        throw new Error('Todos os campos são obrigatórios');
      }
    } catch (error) {
      toast.error("Falha no cadastro. Por favor tente novamente.");
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (plan: PlanType) => {
    try {
      if (!user) throw new Error('Usuário não encontrado');
      
      const updatedUser = { ...user, plan };
      setUser(updatedUser);
      localStorage.setItem('biobloom-user', JSON.stringify(updatedUser));
      toast.success(`Seu plano foi atualizado para ${plan}!`);
    } catch (error) {
      toast.error("Falha ao atualizar plano.");
      console.error('Update plan error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear user data
      setUser(null);
      localStorage.removeItem('biobloom-user');
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
