
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';

interface BioPageFormData {
  name: string;
  bio: string;
  theme: string;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        theme: formData.theme as any,
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
