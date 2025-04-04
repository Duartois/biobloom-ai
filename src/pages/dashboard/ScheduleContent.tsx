
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar as CalendarIcon, Clock, Plus, Sparkles, Loader2, Instagram, Twitter, Linkedin } from 'lucide-react';
import { toast } from "sonner";

// Posts agendados simulados para demonstração
const mockPosts = [
  {
    id: '1',
    content: 'Confira meu último post sobre como criar conteúdo envolvente para seu público.',
    scheduledFor: new Date(2025, 4, 10, 12, 0),
    platform: 'instagram',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: '2',
    content: 'Acabei de lançar meu novo site de portfólio! Tão animado para compartilhar meu trabalho com todos vocês.',
    scheduledFor: new Date(2025, 4, 15, 15, 30),
    platform: 'twitter',
  }
];

const ScheduleContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const [newPost, setNewPost] = useState({
    content: '',
    scheduledDate: new Date(),
    scheduledTime: '12:00',
    platform: 'instagram',
    image: '',
  });

  const handleAiGenerate = () => {
    if (!aiPrompt) {
      toast.error("Por favor, informe um tópico para a IA gerar conteúdo");
      return;
    }
    
    setIsGenerating(true);
    // Simulação de geração de IA
    setTimeout(() => {
      setAiSuggestions([
        `📸 Novo conteúdo! Acabei de atualizar meu portfólio com ${aiPrompt} recentes. Confira o link na minha bio para ver a coleção completa. #TrabalhosCriativos #Portfolio`,
        `Animado para compartilhar meu mais recente projeto de ${aiPrompt}! O que você acha desse estilo? Adoraria ouvir seu feedback nos comentários abaixo! ✨ #ProcessoCriativo`,
        `Acabei de concluir uma incrível sessão de ${aiPrompt} hoje! Aqui está uma prévia do que está chegando ao meu feed na próxima semana. Fique ligado para a revelação completa! 🚀`
      ]);
      setIsGenerating(false);
      toast.success("Sugestões da IA geradas!");
    }, 2000);
  };

  const handleUseAiSuggestion = (suggestion: string) => {
    setNewPost(prev => ({ ...prev, content: suggestion }));
    setShowAiAssistant(false);
    toast.success("Adicionado à sua postagem!");
  };

  const handleSchedulePost = () => {
    // Em um app real, isso enviaria os dados da postagem para o servidor
    toast.success("Post agendado com sucesso!");
    // Resetar formulário
    setNewPost({
      content: '',
      scheduledDate: new Date(),
      scheduledTime: '12:00',
      platform: 'instagram',
      image: '',
    });
  };

  // Função auxiliar para formatar data para exibição
  const formatScheduleDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Obter ícone da plataforma
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <Instagram className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Agendamento de Conteúdo</h1>
        <Button className="bg-festa-amarelo hover:bg-festa-laranja text-festa-dark">
          <Plus className="mr-2 h-4 w-4" />
          Nova Publicação
        </Button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna esquerda - Agendar nova publicação */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Agendar Nova Publicação</CardTitle>
              <CardDescription>
                Crie e agende seu conteúdo para mídias sociais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={newPost.platform === 'instagram' ? 'default' : 'outline'}
                      className={newPost.platform === 'instagram' ? 'bg-festa-amarelo hover:bg-festa-laranja text-festa-dark' : ''}
                      onClick={() => setNewPost(prev => ({ ...prev, platform: 'instagram' }))}
                    >
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </Button>
                    <Button
                      type="button"
                      variant={newPost.platform === 'twitter' ? 'default' : 'outline'}
                      className={newPost.platform === 'twitter' ? 'bg-festa-amarelo hover:bg-festa-laranja text-festa-dark' : ''}
                      onClick={() => setNewPost(prev => ({ ...prev, platform: 'twitter' }))}
                    >
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Button>
                    <Button
                      type="button"
                      variant={newPost.platform === 'linkedin' ? 'default' : 'outline'}
                      className={newPost.platform === 'linkedin' ? 'bg-festa-amarelo hover:bg-festa-laranja text-festa-dark' : ''}
                      onClick={() => setNewPost(prev => ({ ...prev, platform: 'linkedin' }))}
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content">Conteúdo da Publicação</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-festa-laranja"
                      onClick={() => setShowAiAssistant(!showAiAssistant)}
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      Assistente IA
                    </Button>
                  </div>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="O que você quer compartilhar?"
                    rows={4}
                  />
                </div>
                
                {showAiAssistant && (
                  <div className="space-y-3 bg-muted/30 p-3 rounded-md">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Sobre qual tema a IA deve escrever?"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="flex-grow"
                      />
                      <Button 
                        type="button" 
                        disabled={isGenerating}
                        onClick={handleAiGenerate}
                        className="bg-festa-amarelo hover:bg-festa-laranja text-festa-dark"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Gerando
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Gerar
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {aiSuggestions.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-auto">
                        <p className="text-sm font-medium">Sugestões:</p>
                        {aiSuggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            className="p-2 border rounded-md bg-background cursor-pointer hover:bg-accent"
                            onClick={() => handleUseAiSuggestion(suggestion)}
                          >
                            <p className="text-sm">{suggestion}</p>
                            <p className="text-xs text-right text-festa-amarelo mt-1">
                              Usar esta sugestão
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Agendamento</Label>
                    <div className="border rounded-md overflow-hidden">
                      <Calendar
                        mode="single"
                        selected={newPost.scheduledDate}
                        onSelect={(date) => date && setNewPost(prev => ({ ...prev, scheduledDate: date }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário de Agendamento</Label>
                    <div className="flex gap-2 items-center">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        value={newPost.scheduledTime}
                        onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      />
                    </div>
                    
                    <div className="pt-6 space-y-2">
                      <Label htmlFor="image">Imagem (Opcional)</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          // Em um app real, isso trataria o upload de arquivos
                          console.log("Imagem selecionada", e.target.files?.[0]);
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Faça upload de uma imagem para incluir na sua publicação
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        className="w-full bg-festa-amarelo hover:bg-festa-laranja text-festa-dark"
                        disabled={!newPost.content}
                        onClick={handleSchedulePost}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Agendar Publicação
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Coluna direita - Publicações agendadas */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Publicações Agendadas</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                  <TabsTrigger value="published">Publicadas</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="upcoming" className="h-[500px] overflow-auto">
                <div className="space-y-3">
                  {mockPosts.length > 0 ? 
                    mockPosts.map(post => (
                      <div key={post.id} className="border rounded-md p-3 relative">
                        <div className="absolute top-3 right-3 flex gap-1 items-center">
                          {getPlatformIcon(post.platform)}
                        </div>
                        <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                        {post.image && (
                          <div className="w-full h-24 mb-2 rounded-md overflow-hidden">
                            <img src={post.image} alt="Visual da publicação" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatScheduleDate(post.scheduledFor)}
                          </div>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                            Editar
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Sem publicações agendadas</h3>
                        <p className="text-muted-foreground text-sm max-w-[200px] mt-1 mb-4">
                          Use o formulário para criar e agendar sua primeira publicação
                        </p>
                      </div>
                    )
                  }
                </div>
              </TabsContent>
              
              <TabsContent value="published" className="h-[500px] overflow-auto">
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Sem publicações ainda</h3>
                  <p className="text-muted-foreground text-sm max-w-[200px] mt-1">
                    Suas publicações aparecerão aqui
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleContent;
