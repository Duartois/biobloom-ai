
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from "sonner";

type User = {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  plan: 'free' | 'starter' | 'pro' | 'premium';
  createdAt: Date;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
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
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('biobloom-user');
      }
    }
    setLoading(false);
  }, []);

  // In a real app, these would connect to Firebase, Supabase, or another auth provider
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
          name: 'Demo User',
          bio: 'This is a demo account',
          plan: 'starter',
          createdAt: new Date(),
        };
        
        setUser(mockUser);
        localStorage.setItem('biobloom-user', JSON.stringify(mockUser));
        toast.success("Login successful!");
      } else {
        throw new Error('Email and password required');
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
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
        // This would be replaced with actual auth registration
        const mockUser: User = {
          id: 'user-' + Date.now(),
          username,
          email,
          name: username,
          bio: '',
          plan: 'free',
          createdAt: new Date(),
        };
        
        setUser(mockUser);
        localStorage.setItem('biobloom-user', JSON.stringify(mockUser));
        toast.success("Registration successful!");
      } else {
        throw new Error('All fields are required');
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear user data
      setUser(null);
      localStorage.removeItem('biobloom-user');
      toast.info("You've been logged out");
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
