import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
import { Laptop, Save, Sparkles, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock background images
const backgroundImages = [
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513036191774-b2badb8fcb76?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506259091721-347e791bab0f?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521747116042-5a810fda9664?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586672806791-3a67d24186c0?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558470598-a5dda9640f68?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?q=80&w=500&auto=format&fit=crop",
];

const BioPageEditor = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useLinks();
  const [activeTab, setActiveTab] = useState("profile");
  const [showAllBackgrounds, setShowAllBackgrounds] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile.name || user?.name || '',
    bio: profile.bio || '',
    theme: profile.theme || 'default',
    themeColor: profile.themeColor || '#893bf2',
    background_type: profile.background_type || 'color',
    backgroundImage: profile.backgroundImage || backgroundImages[0],
    opacity: profile.opacity !== undefined ? profile.opacity : 1.0,
    grayscale: profile.grayscale || false,
  });

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

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, opacity }));
  };

  const handleGrayscaleChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, grayscale: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  // Get styles for the preview based on theme selection
  const getPreviewStyles = () => {
    switch(formData.theme) {
      case 'minimal':
        return 'border border-gray-200 dark:border-gray-800';
      case 'neobrutal':
        return 'neo-card border-2 border-black dark:border-white';
      case 'glass':
        return 'glass-card';
      case 'default':
      default:
        return 'bg-white dark:bg-black shadow-lg';
    }
  };

  // Display only first 10 backgrounds unless "show all" is clicked
  const visibleBackgrounds = showAllBackgrounds 
    ? backgroundImages 
    : backgroundImages.slice(0, 10);

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
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
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
                  
                  <div className="space-y-3">
                    <Label>Tipo de Plano de Fundo</Label>
                    <div className="flex space-x-2">
                      <Button 
                        type="button"
                        variant={formData.background_type === 'color' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => handleBackgroundTypeChange('color')}
                      >
                        Cor Sólida
                      </Button>
                      <Button 
                        type="button"
                        variant={formData.background_type === 'image' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => handleBackgroundTypeChange('image')}
                      >
                        Imagem
                      </Button>
                    </div>
                  </div>
                  
                  {formData.background_type === 'color' ? (
                    <div className="space-y-2">
                      <Label htmlFor="themeColor">Cor do Tema</Label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          id="themeColor"
                          name="themeColor"
                          value={formData.themeColor}
                          onChange={handleInputChange}
                          className="w-10 h-10 rounded border overflow-hidden"
                        />
                        <Input
                          value={formData.themeColor}
                          onChange={handleInputChange}
                          name="themeColor"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Imagem de Fundo</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {visibleBackgrounds.map((bg, index) => (
                          <div 
                            key={index}
                            className={`relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                              formData.backgroundImage === bg 
                                ? 'border-biobloom-600 ring-2 ring-biobloom-300' 
                                : 'border-transparent hover:border-muted'
                            }`}
                            onClick={() => handleBackgroundSelection(bg)}
                          >
                            <img 
                              src={bg} 
                              alt={`Fundo ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                      
                      {!showAllBackgrounds && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowAllBackgrounds(true)}
                          className="mt-2 w-full"
                        >
                          Ver mais fundos
                        </Button>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Ajustes visuais</Label>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label htmlFor="opacity" className="block mb-1">Opacidade</Label>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(formData.opacity * 100)}%
                        </span>
                      </div>
                      <Input
                        id="opacity"
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={formData.opacity}
                        onChange={handleOpacityChange}
                        className="w-1/2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="grayscale" className="block">Monocromático</Label>
                        <span className="text-sm text-muted-foreground">
                          Converte seu plano de fundo para preto e branco
                        </span>
                      </div>
                      <Switch
                        id="grayscale"
                        checked={formData.grayscale}
                        onCheckedChange={handleGrayscaleChange}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base font-medium">
                <Laptop className="mr-2 h-4 w-4" />
                Pré-visualização
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <div className="w-56 h-[460px] overflow-hidden rounded-xl relative">
                {/* Background */}
                <div className="absolute inset-0 w-full h-full">
                  {formData.background_type === 'image' ? (
                    <img 
                      src={formData.backgroundImage} 
                      alt="Background"
                      className={`w-full h-full object-cover ${formData.grayscale ? 'grayscale' : ''}`}
                      style={{ opacity: formData.opacity }}
                    />
                  ) : (
                    <div 
                      className={`w-full h-full ${formData.grayscale ? 'grayscale' : ''}`}
                      style={{ 
                        backgroundColor: formData.themeColor, 
                        opacity: formData.opacity 
                      }}
                    ></div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center p-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-white mt-6 mb-3"></div>
                  
                  {/* Name & Bio */}
                  <h3 className="text-lg font-bold text-white mb-1">{formData.name || 'Seu Nome'}</h3>
                  <p className="text-xs text-white/80 mb-6 text-center">{formData.bio || 'Sua descrição aparecerá aqui'}</p>
                  
                  {/* Links */}
                  <div className="w-full space-y-2">
                    {profile.links.slice(0, 4).map((link, index) => (
                      <div 
                        key={index} 
                        className={`link-card ${getPreviewStyles()}`}
                        style={{
                          backgroundColor: link.style === 'default' ? formData.themeColor : 'transparent',
                          borderColor: link.style === 'outline' ? formData.themeColor : 'transparent',
                        }}
                      >
                        <span className="text-sm">{link.title}</span>
                      </div>
                    ))}
                    
                    {profile.links.length === 0 && (
                      <>
                        <div className={`link-card ${getPreviewStyles()}`}>
                          <span className="text-sm">Seu Primeiro Link</span>
                        </div>
                        <div className={`link-card ${getPreviewStyles()}`}>
                          <span className="text-sm">Segundo Link</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BioPageEditor;
