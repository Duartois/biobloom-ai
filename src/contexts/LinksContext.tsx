
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './auth/AuthContext'; // Changed from './AuthContext' to './auth/AuthContext'
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

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
  background_type?: 'image' | 'color';
  opacity?: number;
  grayscale?: boolean;
};

type LinksContextType = {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  addLink: (link: Omit<Link, 'id'>) => Promise<void>;
  updateLink: (id: string, link: Partial<Omit<Link, 'id'>>) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
  loading: boolean;
  fetchProfileByUsername: (username: string) => Promise<ProfileData | null>;
};

const defaultProfile: ProfileData = {
  name: '',
  username: '',
  bio: '',
  links: [],
  theme: 'default',
  themeColor: '#893bf2',
  background_type: 'color',
  opacity: 1.0,
  grayscale: false,
};

const LinksContext = createContext<LinksContextType | undefined>(undefined);

export const LinksProvider = ({ children }: { children: ReactNode }) => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);

  // Load profile data when user authentication changes
  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    } else {
      setProfile(defaultProfile);
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch profile data from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, we handle that separately
        console.error('Error fetching profile data:', profileError);
        throw profileError;
      }

      // Fetch user data for name and username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('name, username')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw userError;
      }

      // Fetch links data
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('ordem', { ascending: true });

      if (linksError) {
        console.error('Error fetching links data:', linksError);
        throw linksError;
      }

      // Transform links data to our Link type
      const links: Link[] = linksData?.map(link => ({
        id: link.id,
        title: link.titulo,
        url: link.url,
        style: (link.style as Link['style']) || 'default',
      })) || [];

      // Build the profile object
      const updatedProfile: ProfileData = {
        name: userData?.name || '',
        username: userData?.username || '',
        bio: profileData?.bio || '',
        profilePicture: profileData?.logotipo || undefined,
        backgroundImage: profileData?.imagem_fundo || undefined,
        links: links,
        theme: (profileData?.theme as ProfileData['theme']) || 'default',
        themeColor: profileData?.cor_fundo || '#893bf2',
        background_type: (profileData?.background_type as ProfileData['background_type']) || 'color',
        opacity: profileData?.opacity || 1.0,
        grayscale: profileData?.grayscale || false,
      };

      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to load profile data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileByUsername = async (username: string): Promise<ProfileData | null> => {
    try {
      // First get the user by username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, username')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user by username:', userError);
        return null;
      }

      // Then get the profile by user_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile data:', profileError);
        return null;
      }

      // Get links for this user
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userData.id)
        .order('ordem', { ascending: true });

      if (linksError) {
        console.error('Error fetching links data:', linksError);
        return null;
      }

      // Transform links data
      const links: Link[] = linksData?.map(link => ({
        id: link.id,
        title: link.titulo,
        url: link.url,
        style: (link.style as Link['style']) || 'default',
      })) || [];

      // Build the profile object
      return {
        name: userData?.name || '',
        username: userData?.username || '',
        bio: profileData?.bio || '',
        profilePicture: profileData?.logotipo || undefined,
        backgroundImage: profileData?.imagem_fundo || undefined,
        links: links,
        theme: (profileData?.theme as ProfileData['theme']) || 'default',
        themeColor: profileData?.cor_fundo || '#893bf2',
        background_type: (profileData?.background_type as ProfileData['background_type']) || 'color',
        opacity: profileData?.opacity || 1.0,
        grayscale: profileData?.grayscale || false,
      };
    } catch (error) {
      console.error('Failed to fetch profile by username', error);
      return null;
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user || !session) {
      toast.error("Você precisa estar logado para atualizar seu perfil");
      return;
    }

    try {
      const updates: Record<string, any> = {};
      
      // Map profile fields to database columns
      if (data.bio !== undefined) updates['bio'] = data.bio;
      if (data.backgroundImage !== undefined) updates['imagem_fundo'] = data.backgroundImage;
      if (data.themeColor !== undefined) updates['cor_fundo'] = data.themeColor;
      if (data.theme !== undefined) updates['theme'] = data.theme;
      if (data.background_type !== undefined) updates['background_type'] = data.background_type;
      if (data.opacity !== undefined) updates['opacity'] = data.opacity;
      if (data.grayscale !== undefined) updates['grayscale'] = data.grayscale;
      if (data.profilePicture !== undefined) updates['logotipo'] = data.profilePicture;

      // Update users table with name and username if provided
      const userUpdates: Record<string, any> = {};
      if (data.name !== undefined) userUpdates.name = data.name;
      if (data.username !== undefined) userUpdates.username = data.username;
      
      if (Object.keys(userUpdates).length > 0) {
        const { error: userError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', user.id);

        if (userError) throw userError;
      }

      // Only update profiles table if there are profile updates
      if (Object.keys(updates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', user.id);

        if (profileError) throw profileError;
      }

      // Update the local state
      setProfile(prev => {
        const updated = { ...prev, ...data };
        return updated;
      });
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erro ao atualizar perfil. Por favor, tente novamente.");
    }
  };

  const addLink = async (linkData: Omit<Link, 'id'>) => {
    if (!user || !session) {
      toast.error("Você precisa estar logado para adicionar links");
      return;
    }

    try {
      // Get the highest order number to place this link at the end
      const { data: maxOrderData } = await supabase
        .from('links')
        .select('ordem')
        .eq('user_id', user.id)
        .order('ordem', { ascending: false })
        .limit(1);

      const nextOrder = maxOrderData && maxOrderData.length > 0 && maxOrderData[0]?.ordem 
        ? maxOrderData[0].ordem + 1 
        : 0;

      // Insert into the links table
      const { data: newLink, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          titulo: linkData.title,
          url: linkData.url,
          style: linkData.style || 'default',
          ordem: nextOrder
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      if (newLink) {
        const link: Link = {
          id: newLink.id,
          title: newLink.titulo,
          url: newLink.url,
          style: (newLink.style as Link['style']) || 'default',
        };

        setProfile(prev => {
          const updated = { 
            ...prev, 
            links: [...prev.links, link] 
          };
          return updated;
        });
      }
      
      toast.success("Link adicionado com sucesso!");
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error("Erro ao adicionar link. Por favor, tente novamente.");
    }
  };

  const updateLink = async (id: string, linkData: Partial<Omit<Link, 'id'>>) => {
    if (!user || !session) {
      toast.error("Você precisa estar logado para atualizar links");
      return;
    }

    try {
      const updates: Record<string, any> = {};
      if (linkData.title !== undefined) updates['titulo'] = linkData.title;
      if (linkData.url !== undefined) updates['url'] = linkData.url;
      if (linkData.style !== undefined) updates['style'] = linkData.style;

      // Update in the database
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => {
        const updatedLinks = prev.links.map(link => 
          link.id === id 
            ? { ...link, ...linkData } 
            : link
        );
        
        return { ...prev, links: updatedLinks };
      });
      
      toast.success("Link atualizado com sucesso!");
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error("Erro ao atualizar link. Por favor, tente novamente.");
    }
  };

  const removeLink = async (id: string) => {
    if (!user || !session) {
      toast.error("Você precisa estar logado para remover links");
      return;
    }

    try {
      // Delete from the database
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove from local state
      setProfile(prev => {
        const updatedLinks = prev.links.filter(link => link.id !== id);
        return { ...prev, links: updatedLinks };
      });
      
      toast.success("Link removido com sucesso!");
    } catch (error) {
      console.error('Error removing link:', error);
      toast.error("Erro ao remover link. Por favor, tente novamente.");
    }
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
        fetchProfileByUsername,
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
