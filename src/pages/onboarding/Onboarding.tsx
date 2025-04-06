
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowRight, Loader2, Image, Palette } from 'lucide-react';
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useLinks } from '@/contexts/LinksContext';

// Background image suggestions - acrescentando mais opções
const backgroundImages = [
  { id: 1, url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500&auto=format&fit=crop" },
  { id: 2, url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&auto=format&fit=crop" },
  { id: 3, url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop" },
  { id: 4, url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop" },
  { id: 5, url: "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=500&auto=format&fit=crop" },
  { id: 6, url: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=500&auto=format&fit=crop" },
  { id: 7, url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=500&auto=format&fit=crop" },
  { id: 8, url: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?q=80&w=500&auto=format&fit=crop" },
  { id: 9, url: "https://images.unsplash.com/photo-1560015534-cee980ba7e13?q=80&w=500&auto=format&fit=crop" },
  { id: 10, url: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=500&auto=format&fit=crop" },
  { id: 11, url: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=500&auto=format&fit=crop" },
  { id: 12, url: "https://images.unsplash.com/photo-1508614999368-9260051292e5?q=80&w=500&auto=format&fit=crop" },
  { id: 13, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop" },
  { id: 14, url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=500&auto=format&fit=crop" },
  { id: 15, url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=500&auto=format&fit=crop" },
  { id: 16, url: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=500&auto=format&fit=crop" },
  { id: 17, url: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?q=80&w=500&auto=format&fit=crop" },
  { id: 18, url: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=500&auto=format&fit=crop" },
  { id: 19, url: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=500&auto=format&fit=crop" },
  { id: 20, url: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=500&auto=format&fit=crop" },
];

// Palette of solid colors
const colorPalette = [
  "#F8F9FA", // White
  "#E9ECEF", // Light Gray
  "#DEE2E6", // Gray
  "#CED4DA", // Medium Gray
  "#ADB5BD", // Dark Gray
  "#6C757D", // Charcoal
  "#495057", // Dark Charcoal
  "#343A40", // Almost Black
  "#212529", // Black
  "#F8BBD0", // Light Pink
  "#F48FB1", // Pink
  "#FF80AB", // Hot Pink
  "#D0F0C0", // Light Green
  "#A8E6CF", // Mint Green
  "#1DE9B6", // Teal
  "#90CAF9", // Light Blue
  "#64B5F6", // Blue
  "#42A5F5", // Medium Blue
  "#FFF176", // Light Yellow
  "#FFEE58", // Yellow
  "#FFCA28", // Amber
  "#FFA726", // Orange
  "#FF7043", // Deep Orange
  "#8C9EFF", // Light Indigo
  "#536DFE", // Indigo
  "#7C4DFF", // Purple
  "#E1BEE7", // Light Lavender
  "#CE93D8", // Lavender
  "#BA68C8", // Deep Purple
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile } = useLinks();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundType, setBackgroundType] = useState<'image' | 'color'>('image');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [opacity, setOpacity] = useState<number>(1);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  
  // Form state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: '',
    interests: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // In a real app, here we would send profile.interests to an AI service
      // to get background suggestions based on interests
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 1000);
    } else if (step === 2 && (selectedImage || selectedColor)) {
      // Final step completion - save everything and go to dashboard
      setIsLoading(true);
      
      try {
        await updateProfile({
          name: profile.name,
          bio: profile.bio,
          backgroundImage: selectedImage,
          background_type: backgroundType,
          cor_fundo: selectedColor || undefined,
          opacity,
          grayscale,
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <MainLayout hideFooter>
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <div className="flex justify-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-biobloom-100 text-biobloom-700 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Vamos configurar sua página BioBloom</h1>
          <p className="text-muted-foreground">Ajudaremos você a criar uma página bonita que reflita sua marca</p>
        </div>

        <div className="bg-background p-6 rounded-lg border shadow-sm">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step >= 1 ? 'border-biobloom-600 bg-biobloom-600 text-white' : 'border-muted'
              }`}>
                1
              </div>
              <div className={`h-1 w-12 ${step >= 2 ? 'bg-biobloom-600' : 'bg-muted'}`}></div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step >= 2 ? 'border-biobloom-600 bg-biobloom-600 text-white' : 'border-muted'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Step 1: Basic info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome ou nome da marca"
                  value={profile.name}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Uma breve descrição sobre você ou sua marca"
                  rows={3}
                  value={profile.bio}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">
                  Quais são seus interesses ou o foco do seu conteúdo?
                </Label>
                <Textarea
                  id="interests"
                  name="interests"
                  placeholder="Ex: fotografia, fitness, reviews de tecnologia, moda, coaching..."
                  rows={3}
                  value={profile.interests}
                  onChange={handleProfileChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Usaremos isso para sugerir o plano de fundo perfeito para sua página
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Background selection */}
          {step === 2 && (
            <div className="space-y-6">
              <Tabs defaultValue="image" onValueChange={(value) => setBackgroundType(value as 'image' | 'color')}>
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
                  <TabsTrigger value="image" className="flex items-center justify-center">
                    <Image className="h-4 w-4 mr-2" />
                    Imagens
                  </TabsTrigger>
                  <TabsTrigger value="color" className="flex items-center justify-center">
                    <Palette className="h-4 w-4 mr-2" />
                    Cores
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Escolha uma imagem de fundo para sua página
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {backgroundImages.map(image => (
                      <div 
                        key={image.id}
                        className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImage === image.url 
                            ? 'border-biobloom-600 ring-2 ring-biobloom-300' 
                            : 'border-transparent hover:border-muted'
                        }`}
                        onClick={() => {
                          setSelectedImage(image.url);
                          setSelectedColor(null);
                        }}
                      >
                        <img 
                          src={image.url} 
                          alt="Background option" 
                          className={`w-full h-full object-cover transition-all ${
                            grayscale ? 'grayscale' : ''
                          }`}
                          style={{ opacity }}
                          loading="lazy"
                        />
                        {selectedImage === image.url && (
                          <div className="absolute top-2 right-2 bg-biobloom-600 text-white rounded-full p-1 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {selectedImage && (
                    <div className="space-y-4 pt-4 border-t mt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="opacity">Opacidade</Label>
                          <span className="text-sm text-muted-foreground">{Math.round(opacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          id="opacity"
                          min="0.2"
                          max="1"
                          step="0.05"
                          value={opacity}
                          onChange={(e) => setOpacity(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="grayscale"
                          checked={grayscale}
                          onChange={(e) => setGrayscale(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="grayscale">Preto e branco</Label>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="color" className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Escolha uma cor sólida para o fundo da sua página
                  </p>
                  
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {colorPalette.map((color, index) => (
                      <div 
                        key={index}
                        className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedColor === color 
                            ? 'border-biobloom-600 ring-2 ring-biobloom-300' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImage(null);
                        }}
                      >
                        {selectedColor === color && (
                          <div className="flex items-center justify-center h-full">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke={parseInt(color.slice(1), 16) > 0xffffff / 2 ? 'black' : 'white'} 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="customColor">Ou digite um código de cor:</Label>
                      <Input
                        id="customColor"
                        type="text"
                        placeholder="#RRGGBB"
                        value={selectedColor || ''}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-32"
                      />
                      {selectedColor && (
                        <div 
                          className="w-6 h-6 rounded-full border" 
                          style={{ backgroundColor: selectedColor }}
                        ></div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-end mt-8">
            {step === 2 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="mr-2"
                disabled={isLoading}
              >
                Voltar
              </Button>
            )}
            <Button 
              onClick={handleNextStep}
              className="bg-biobloom-600 hover:bg-biobloom-700"
              disabled={
                (step === 1 && (!profile.name || !profile.bio)) || 
                (step === 2 && !selectedImage && !selectedColor) ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando
                </>
              ) : step === 2 ? (
                'Concluir Configuração'
              ) : (
                <>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Onboarding;
