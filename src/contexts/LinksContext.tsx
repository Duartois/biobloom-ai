
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

export type Link = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  style?: 'default' | 'outline' | 'ghost' | 'neobrutal' | 'glass';
};

export type ProfileData = {
  name: string;
  username: string;
  bio: string;
  profilePicture?: string;
  backgroundImage?: string;
  links: Link[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
  };
  theme: 'default' | 'minimal' | 'neobrutal' | 'glass';
  themeColor: string;
};

type LinksContextType = {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  addLink: (link: Omit<Link, 'id'>) => void;
  updateLink: (id: string, link: Partial<Omit<Link, 'id'>>) => void;
  removeLink: (id: string) => void;
  loading: boolean;
};

const defaultProfile: ProfileData = {
  name: '',
  username: '',
  bio: '',
  links: [],
  theme: 'default',
  themeColor: '#893bf2',
};

const LinksContext = createContext<LinksContextType | undefined>(undefined);

export const LinksProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);

  // Load profile data
  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem(`biobloom-profile-${user.id}`);
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch (error) {
          console.error('Failed to parse stored profile', error);
        }
      } else {
        // Initialize with user data if available
        setProfile({
          ...defaultProfile,
          name: user.name || '',
          username: user.username || '',
        });
      }
    } else {
      setProfile(defaultProfile);
    }
    setLoading(false);
  }, [user]);

  // Save profile data when it changes
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`biobloom-profile-${user.id}`, JSON.stringify(profile));
    }
  }, [profile, user, loading]);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile(prev => {
      const updated = { ...prev, ...data };
      toast.success("Profile updated successfully!");
      return updated;
    });
  };

  const addLink = (linkData: Omit<Link, 'id'>) => {
    const newLink: Link = {
      ...linkData,
      id: `link-${Date.now()}`,
    };
    setProfile(prev => {
      const updated = { 
        ...prev, 
        links: [...prev.links, newLink] 
      };
      toast.success("Link added successfully!");
      return updated;
    });
  };

  const updateLink = (id: string, linkData: Partial<Omit<Link, 'id'>>) => {
    setProfile(prev => {
      const updatedLinks = prev.links.map(link => 
        link.id === id ? { ...link, ...linkData } : link
      );
      toast.success("Link updated successfully!");
      return { ...prev, links: updatedLinks };
    });
  };

  const removeLink = (id: string) => {
    setProfile(prev => {
      const updatedLinks = prev.links.filter(link => link.id !== id);
      toast.success("Link removed successfully!");
      return { ...prev, links: updatedLinks };
    });
  };

  return (
    <LinksContext.Provider
      value={{
        profile,
        updateProfile,
        addLink,
        updateLink,
        removeLink,
        loading,
      }}
    >
      {children}
    </LinksContext.Provider>
  );
};

export const useLinks = () => {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error('useLinks must be used within a LinksProvider');
  }
  return context;
};
