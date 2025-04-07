
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import BioPagePreview from '@/components/profile/BioPagePreview';
import { BackgroundSelector } from '@/components/backgrounds/BackgroundSelector';

const BioPageEditor = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useLinks();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [formData, setFormData] = useState({
    name: profile.name || user?.name || '',
    bio: profile.bio || '',
    theme: profile.theme || 'default',
    themeColor: profile.themeColor || '#FFFFFF',
    background_type: profile.background_type || 'color',
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Editar Bio-Page</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            asChild
          >
            <Link to={`/${user?.username}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Link>
          </Button>
          <Button 
            type="submit"
            form="bio-form"
            className="bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
            </TabsList>
            
            <form id="bio-form" onSubmit={handleSubmit}>
              <TabsContent value="profile" className="p-4 border rounded-md mt-2">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome de Exibição</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome ou nome da marca"
                      className="focus:ring-2 focus:ring-offset-1 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Este nome será exibido na sua Bio-page
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Uma breve descrição sobre você ou sua marca"
                      rows={3}
                      className="resize-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Máximo de 160 caracteres
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      URL da sua bio-page
                    </span>
                    <div className="flex items-center bg-muted/50 px-3 py-1 rounded-md">
                      <span className="text-sm text-muted-foreground mr-1">biobloom.com/</span>
                      <span className="text-sm font-medium">{user?.username || 'username'}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="p-4 border rounded-md mt-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Estilo dos Links</Label>
                    <Select
                      value={formData.theme}
                      onValueChange={(value) => handleSelectChange('theme', value)}
                    >
                      <SelectTrigger className="w-full focus:ring-2 focus:ring-offset-1 focus:ring-primary/50">
                        <SelectValue placeholder="Selecione um estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão</SelectItem>
                        <SelectItem value="minimal">Minimalista</SelectItem>
                        <SelectItem value="neobrutal">Neo-brutal</SelectItem>
                        <SelectItem value="glass">Vidro</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Escolha como seus links serão exibidos
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Plano de Fundo</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Personalize o fundo da sua Bio-page
                    </p>
                    
                    <BackgroundSelector
                      backgroundType={formData.background_type as 'image' | 'color'}
                      setBackgroundType={handleBackgroundTypeChange}
                      selectedImage={formData.backgroundImage}
                      setSelectedImage={handleBackgroundSelection}
                      selectedColor={formData.themeColor}
                      setSelectedColor={handleColorSelection}
                      opacity={formData.opacity}
                      setOpacity={handleOpacityChange}
                      grayscale={formData.grayscale}
                      setGrayscale={handleGrayscaleChange}
                      showOpacityOnPreviewOnly={true}
                    />
                  </div>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Pré-visualização
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-2">
              <BioPagePreview 
                profile={previewProfile} 
                username={user?.username}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BioPageEditor;
