
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from './types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUserPlan: (plan: string) => Promise<void>;
  getRemainingTrialDays: () => number;
  isTrialActive: () => boolean;
  needsOnboarding: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, loading, needsOnboarding } = useAuthState();
  const { 
    login, 
    register, 
    logout, 
    updateUserPlan, 
    getRemainingTrialDays, 
    isTrialActive 
  } = useAuthMethods(user);

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
        needsOnboarding,
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
