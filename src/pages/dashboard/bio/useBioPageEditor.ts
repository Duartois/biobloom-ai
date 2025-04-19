
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks, ProfileData } from '@/contexts/LinksContext';
import { supabase } from "@/integrations/supabase/client";

interface BioPageFormData {
  name: string;
  bio: string;
  theme: ProfileData['theme'];
  themeColor: string;
  background_type: 'color' | 'image';
  backgroundImage: string;
  opacity: number;
  grayscale: boolean;
}

export const useBioPageEditor = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useLinks();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [formData, setFormData] = useState<BioPageFormData>({
    name: profile.name || user?.name || '',
    bio: profile.bio || '',
    theme: profile.theme || 'default',
    themeColor: profile.themeColor || '#F8F9FA',
    background_type: (profile.background_type as 'color' | 'image') || 'color',
    backgroundImage: profile.backgroundImage || '',
    opacity: profile.opacity !== undefined ? profile.opacity : 1.0,
    grayscale: profile.grayscale || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any previous error when user is typing
    if (name === 'name') {
      setUsernameError(null);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'theme') {
      // Ensure theme is one of the allowed values
      const themeValue = value as ProfileData['theme'];
      setFormData(prev => ({ ...prev, [name]: themeValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBackgroundTypeChange = (type: 'color' | 'image') => {
    setFormData(prev => ({ ...prev, background_type: type }));
  };

  const handleBackgroundSelection = (url: string) => {
    setFormData(prev => ({ 
      ...prev, 
      backgroundImage: url,
      background_type: 'image'
    }));
  };

  const handleColorSelection = (color: string) => {
    setFormData(prev => ({ 
      ...prev, 
      themeColor: color,
      background_type: 'color'
    }));
  };

  const handleOpacityChange = (opacity: number) => {
    setFormData(prev => ({ ...prev, opacity }));
  };

  const handleGrayscaleChange = (grayscale: boolean) => {
    setFormData(prev => ({ ...prev, grayscale }));
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // Skip check if username hasn't changed from what the user already has
      if (username === user?.username) {
        return true;
      }
      
      // Check if username is available in the database
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
      
      // If no data returned, username is available
      return !data && !error;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setUsernameError(null);
    
    try {
      // Generate username from name (lowercase, no special characters)
      const sanitizedUsername = formData.name.toLowerCase().replace(/[^a-z0-9_]/g, '');
      
      if (!sanitizedUsername) {
        setUsernameError("Nome inválido para gerar um nome de usuário");
        setIsSaving(false);
        return;
      }
      
      // Check if username is available (only if it changed)
      if (sanitizedUsername !== user?.username) {
        const isAvailable = await checkUsernameAvailability(sanitizedUsername);
        
        if (!isAvailable) {
          setUsernameError("Este nome já está em uso por outro usuário");
          setIsSaving(false);
          return;
        }
        
        // Update username in users table if it changed
        const { error: updateError } = await supabase
          .from('users')
          .update({ username: sanitizedUsername })
          .eq('id', user?.id);
        
        if (updateError) {
          console.error('Error updating username:', updateError);
          setUsernameError("Erro ao atualizar nome de usuário");
          setIsSaving(false);
          return;
        }
      }
      
      // Update profile including username derived from name
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        username: sanitizedUsername,
        theme: formData.theme,
        themeColor: formData.themeColor,
        background_type: formData.background_type,
        backgroundImage: formData.background_type === 'image' ? formData.backgroundImage : undefined,
        opacity: formData.opacity,
        grayscale: formData.grayscale,
      });
      
      toast.success('Alterações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar alterações.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Create a modified profile for the preview
  const previewProfile = {
    ...profile,
    name: formData.name,
    bio: formData.bio,
    username: formData.name.toLowerCase().replace(/[^a-z0-9_]/g, ''),
    theme: formData.theme,
    themeColor: formData.themeColor,
    background_type: formData.background_type,
    backgroundImage: formData.backgroundImage,
    opacity: formData.opacity,
    grayscale: formData.grayscale,
  };

  return {
    user,
    formData,
    activeTab,
    setActiveTab,
    isSaving,
    previewProfile,
    usernameError,
    handleInputChange,
    handleSelectChange,
    handleBackgroundTypeChange,
    handleBackgroundSelection,
    handleColorSelection,
    handleOpacityChange,
    handleGrayscaleChange,
    handleSubmit
  };
};
