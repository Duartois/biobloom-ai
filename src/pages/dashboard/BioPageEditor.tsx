
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
import { Save, Eye, Crown, Lock } from 'lucide-react';
import { BackgroundSelector } from '@/components/backgrounds/BackgroundSelector';
import { AiBackgroundSuggestor } from '@/components/backgrounds/AiBackgroundSuggestor';
import { toast } from 'sonner';
import BioPagePreview from '@/components/profile/BioPagePreview';

const BioPageEditor = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useLinks();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [formData, setFormData] = useState({
    name: profile.name || user?.name || '',
    bio: profile.bio || '',
    theme: profile.theme || 'default',
    themeColor: profile.themeColor || '#893bf2',
    background_type: profile.background_type || 'color',
    backgroundImage: profile.backgroundImage || '',
    opacity: profile.opacity !== undefined ? profile.opacity : 1.0,
    grayscale: profile.grayscale || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const isPaidUser = user?.plan === 'starter' || user?.plan === 'pro' || user?.plan === 'premium';

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
            className="bg-biobloom-600 hover:bg-biobloom-700"
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome de Exibição</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome ou nome da marca"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Uma breve descrição sobre você ou sua marca"
                      rows={4}
                    />
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
                    <Label htmlFor="theme">Tema da Página</Label>
                    <Select
                      value={formData.theme}
                      onValueChange={(value) => handleSelectChange('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão</SelectItem>
                        <SelectItem value="minimal">Minimalista</SelectItem>
                        <SelectItem value="neobrutal">Neo-brutal</SelectItem>
                        <SelectItem value="glass">Vidro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
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
            <CardContent className="flex justify-center pt-0">
              <BioPagePreview 
                profile={previewProfile} 
                username={user?.username}
              />
            </CardContent>
          </Card>
          
          {/* AI Background Suggestions Component - Only for paid plans */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <Crown className="mr-2 h-4 w-4 text-amber-500" />
                Sugestões de plano de fundo com IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPaidUser ? (
                <AiBackgroundSuggestor 
                  onSelectBackground={handleBackgroundSelection}
                  onSelectColor={handleColorSelection}
                />
              ) : (
                <div className="relative rounded-lg p-4 border border-dashed">
                  <div className="backdrop-blur-sm bg-black/5 absolute inset-0 rounded-lg flex items-center justify-center flex-col">
                    <Lock className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm text-center text-muted-foreground mb-2">
                      Recurso exclusivo para planos pagos
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/pricing">
                        Fazer upgrade
                      </Link>
                    </Button>
                  </div>
                  <div className="h-24 flex items-center justify-center opacity-30">
                    Obtenha sugestões de plano de fundo personalizadas com IA
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BioPageEditor;
