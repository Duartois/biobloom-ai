
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt-BR' | 'en-US';

// Tipo atualizado para corresponder à estrutura aninhada das traduções
type TranslationSection = {
  [key: string]: string;
};

type Translations = {
  [key: string]: {
    [section: string]: TranslationSection;
  };
};

// Traduções em português do Brasil
const ptBR = {
  common: {
    welcome: 'Bem-vindo ao BioBloom',
    login: 'Entrar',
    register: 'Registrar',
    dashboard: 'Painel',
    profile: 'Perfil',
    logout: 'Sair',
    settings: 'Configurações',
  },
  home: {
    title: 'BioBloom',
    subtitle: 'Sua presença online em um só lugar',
    getStarted: 'Começar agora',
    learnMore: 'Saiba mais',
  },
  auth: {
    email: 'E-mail',
    password: 'Senha',
    forgotPassword: 'Esqueceu a senha?',
    noAccount: 'Não tem uma conta?',
    hasAccount: 'Já tem uma conta?',
    signUp: 'Cadastre-se',
    signIn: 'Entre',
  },
  dashboard: {
    welcome: 'Bem-vindo ao seu painel',
    bioPage: 'Página Bio',
    links: 'Links',
    schedule: 'Agendamentos',
    analytics: 'Análises',
  },
};

// Traduções em inglês dos EUA
const enUS = {
  common: {
    welcome: 'Welcome to BioBloom',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    settings: 'Settings',
  },
  home: {
    title: 'BioBloom',
    subtitle: 'Your online presence in one place',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
  },
  auth: {
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
  },
  dashboard: {
    welcome: 'Welcome to your dashboard',
    bioPage: 'Bio Page',
    links: 'Links',
    schedule: 'Schedule',
    analytics: 'Analytics',
  },
};

const translations: Translations = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, section?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'pt-BR' 
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Tentar obter o idioma do localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || defaultLanguage;
  });

  // Atualizar localStorage quando o idioma muda
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Função de tradução
  const t = (key: string, section: string = 'common'): string => {
    const keys = key.split('.');
    if (keys.length > 1) {
      section = keys[0];
      key = keys[1];
    }
    
    try {
      return translations[language][section][key] || key;
    } catch (error) {
      console.warn(`Translation missing: ${language}.${section}.${key}`);
      return key;
    }
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
