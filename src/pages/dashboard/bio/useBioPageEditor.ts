
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks, ProfileData } from '@/contexts/LinksContext';

interface BioPageFormData {
  name: string;
  bio: string;
  username: string;  // Added username field
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
    username: user?.username || '',  // Initialize with user's username
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
    
    if (name === 'username') {
      // For username fields, enforce lowercase and remove special characters except underscores
      const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      // Clear any previous error when user is typing
      setUsernameError(null);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
      // Skip check if username hasn't changed
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
      // If username has changed, check availability
      if (formData.username !== user?.username) {
        const isAvailable = await checkUsernameAvailability(formData.username);
        
        if (!isAvailable) {
          setUsernameError("Este nome de usuário já está em uso");
          setIsSaving(false);
          return;
        }
      }
      
      // Update profile including username if changed
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        username: formData.username,
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
    username: formData.username,  // Add username to preview
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

