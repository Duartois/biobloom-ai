import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks, ProfileData } from '@/contexts/LinksContext';
import { supabase } from "@/integrations/supabase/client";
import { BioPageFormData, DEFAULT_BACKGROUND_COLOR } from '@/types/bio';

export const useBioPageEditor = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useLinks();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [formData, setFormData] = useState<BioPageFormData>({
    name: profile.name || user?.name || '',
    bio: profile.bio || '',
    theme: profile.theme || 'default',
    themeColor: profile.themeColor || DEFAULT_BACKGROUND_COLOR,
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
      const themeValue = value as BioPageFormData['theme'];
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

  // Implementação completa de handleOpacityChange
  const handleOpacityChange = (opacity: number) => {
    if (opacity < 0.2) opacity = 0.2; // Mínimo de 20% de opacidade para manter legibilidade
    if (opacity > 1.0) opacity = 1.0; // Máximo de 100% de opacidade
    
    setFormData(prev => ({ ...prev, opacity }));
  };

  const handleGrayscaleChange = (grayscale: boolean) => {
    setFormData(prev => ({ ...prev, grayscale }));
  };

  // Function to normalize username consistently across the app
  const sanitizeUsername = (name: string): string => {
    // Remove caracteres especiais e espaços, converter para minúsculas
    return name.toLowerCase().replace(/[^a-z0-9_]/g, '');
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // Validação básica do nome de usuário
      if (!username || username.length < 3) {
        return false;
      }
      
      // Skip check if username hasn't changed from what the user already has
      if (username === user?.username) {
        return true;
      }
      
      // Normalize username before checking
      const normalizedUsername = username.toLowerCase();
      
      // Check if username is available in the database
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .ilike('username', normalizedUsername)
        .maybeSingle();
      
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
      const sanitizedUsername = sanitizeUsername(formData.name);
      
      if (!sanitizedUsername || sanitizedUsername.length < 3) {
        setUsernameError("Nome inválido para gerar um nome de usuário. Deve ter pelo menos 3 caracteres alfanuméricos.");
        setIsSaving(false);
        return;
      }
      
      // Check if username is available (only if it changed)
      if (sanitizedUsername !== user?.username) {
        const isAvailable = await checkUsernameAvailability(sanitizedUsername);
        
        if (!isAvailable) {
          setUsernameError("Este nome já está em uso por outro usuário ou é inválido");
          setIsSaving(false);
          return;
        }
        
        console.log('Updating username from', user?.username, 'to', sanitizedUsername);
        
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
    username: sanitizeUsername(formData.name),
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
    handleSelectChange: formData.handleSelectChange || ((name, value) => {}),
    handleBackgroundTypeChange: formData.handleBackgroundTypeChange || ((type) => {}),
    handleBackgroundSelection: formData.handleBackgroundSelection || ((url) => {}),
    handleColorSelection: formData.handleColorSelection || ((color) => {}),
    handleOpacityChange: formData.handleOpacityChange || ((opacity) => {}),
    handleGrayscaleChange: formData.handleGrayscaleChange || ((grayscale) => {}),
    handleSubmit,
    sanitizeUsername
  };
};
