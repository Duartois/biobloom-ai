
import React, { useState } from 'react';
import { toast } from "sonner";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Image as ImageIcon, Palette, Download } from 'lucide-react';
import { useLinks } from '@/contexts/LinksContext';

// Backgrounds simulados de IA
const mockBackgrounds = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546928686-286c9fbde1ec?q=80&w=1000&auto=format&fit=crop'
];

// Fundos temáticos pré-definidos
const presetBackgrounds = [
  { name: 'Gradiente Roxo', url: 'https://images.unsplash.com/photo-1557682260-96655317b5e9?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Ondulação Azul', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Minimalista', url: 'https://images.unsplash.com/photo-1558591710-8570b99f5292?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Cores Vibrantes', url: 'https://images.unsplash.com/photo-1558591710-8a42d7059a9e?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Neon Moderno', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Vintage', url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1000&auto=format&fit=crop' }
];

const BackgroundGenerator = () => {
  const { profile, updateProfile } = useLinks();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string | undefined>(profile.backgroundImage);

  const canUseAI = user?.plan && user.plan !== 'free';

  const handleGenerate = () => {
    if (!canUseAI) {
      toast.error('Faça upgrade para o plano Inicial ou superior para usar a geração de planos de fundo com IA.');
      return;
    }

    if (!prompt) {
      toast.error('Por favor, digite uma descrição para gerar o plano de fundo.');
      return;
    }

    setIsGenerating(true);
    // Simulando o tempo de geração da IA
    setTimeout(() => {
      setGeneratedBackgrounds(mockBackgrounds);
      setIsGenerating(false);
      toast.success('Fundos gerados com sucesso!');
    }, 2000);
  };

  const handleSelectBackground = (url: string) => {
    setSelectedBackground(url);
  };

  const handleApplyBackground = () => {
    if (selectedBackground) {
      updateProfile({ backgroundImage: selectedBackground });
      toast.success('Plano de fundo aplicado com sucesso!');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Gerador de Plano de Fundo</h1>

        <Tabs defaultValue="ai" className="mb-6">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="ai" className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              Geração por IA
            </TabsTrigger>
            <TabsTrigger value="preset" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Fundos Prontos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gere planos de fundo com IA</CardTitle>
                <CardDescription>
                  Descreva como deseja que seu plano de fundo seja, e nossa IA criará opções personalizadas.
                </CardDescription>
                {!canUseAI && (
                  <div className="bg-secondary/10 text-secondary p-3 rounded-md mt-2 text-sm">
                    Este recurso está disponível apenas para planos pagos. 
                    <Button variant="link" className="p-0 h-auto text-secondary" asChild>
                      <a href="/pricing">Fazer upgrade</a>
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Descreva o plano de fundo que você deseja. Exemplo: Gradiente colorido suave com ondas em azul e roxo"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px]"
                      disabled={!canUseAI}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating || !canUseAI}
                    >
                      {isGenerating ? 'Gerando...' : 'Gerar opções'}
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {generatedBackgrounds.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-medium">Resultados</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {generatedBackgrounds.map((bg, index) => (
                          <div 
                            key={index}
                            className={`relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border-2 ${
                              selectedBackground === bg ? 'border-primary' : 'border-transparent'
                            }`}
                            onClick={() => handleSelectBackground(bg)}
                          >
                            <img 
                              src={bg} 
                              alt={`Fundo gerado ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button variant="secondary" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Selecionar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preset" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Fundos Pré-definidos</CardTitle>
                <CardDescription>
                  Escolha entre nossos designs profissionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {presetBackgrounds.map((bg, index) => (
                    <div 
                      key={index}
                      className={`relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border-2 ${
                        selectedBackground === bg.url ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => handleSelectBackground(bg.url)}
                    >
                      <img 
                        src={bg.url} 
                        alt={bg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 p-2">
                        <p className="text-white text-sm truncate">{bg.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedBackground && (
          <div className="flex justify-end">
            <Button onClick={handleApplyBackground}>
              Aplicar plano de fundo
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BackgroundGenerator;
