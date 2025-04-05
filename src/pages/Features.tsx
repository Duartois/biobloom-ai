
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  LinkIcon, 
  LayoutDashboard, 
  Calendar, 
  ImageIcon, 
  LineChart, 
  Sparkles, 
  GanttChart,
  Share2,
  Smartphone
} from 'lucide-react';

const Features = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Recursos incríveis para sua bio-page</h1>
          <p className="text-xl text-muted-foreground">
            Descubra as ferramentas que o BioBloom oferece para elevar sua presença online
          </p>
        </div>

        {/* Main features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-background border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <LinkIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Links ilimitados</h3>
            <p className="text-muted-foreground mb-4">
              Adicione todos os seus links importantes em um só lugar, de forma organizada e personalizada.
            </p>
          </div>

          <div className="bg-background border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Agendamento</h3>
            <p className="text-muted-foreground mb-4">
              Programe o aparecimento de links em datas específicas para campanhas, lançamentos e eventos.
            </p>
          </div>

          <div className="bg-background border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Fundos com IA</h3>
            <p className="text-muted-foreground mb-4">
              Gere planos de fundo únicos para sua bio-page usando nossa tecnologia de inteligência artificial.
            </p>
          </div>

          <div className="bg-background border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Temas personalizados</h3>
            <p className="text-muted-foreground mb-4">
              Escolha entre vários temas e personalize cores, fontes e estilos para combinar com sua marca.
            </p>
          </div>

          <div className="bg-background border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Análise de cliques</h3>
            <p className="text-muted-foreground mb-4">
              Acompanhe o desempenho dos seus links com métricas detalhadas sobre cliques e engajamento.
            </p>
          </div>

          <div className="bg-background border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">100% Responsivo</h3>
            <p className="text-muted-foreground mb-4">
              Sua bio-page funciona perfeitamente em qualquer dispositivo, de smartphones a desktops.
            </p>
          </div>
        </div>

        {/* Featured callout */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Impulsione sua presença online</h2>
              <p className="text-lg mb-6">
                O BioBloom fornece todas as ferramentas necessárias para conectar seu público a todo seu conteúdo através de uma única página personalizada.
              </p>
              <Button asChild size="lg">
                <Link to="/register">Comece agora</Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-96 border-4 border-primary rounded-3xl overflow-hidden shadow-xl">
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-full h-full p-4">
                    <div className="w-16 h-16 rounded-full bg-white mx-auto mt-8 mb-2"></div>
                    <div className="h-4 bg-white/80 rounded mx-auto w-32 mb-8"></div>
                    <div className="space-y-3">
                      <div className="h-10 bg-white/80 rounded-lg"></div>
                      <div className="h-10 bg-white/80 rounded-lg"></div>
                      <div className="h-10 bg-white/80 rounded-lg"></div>
                      <div className="h-10 bg-white/80 rounded-lg"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  Teste<br/>Grátis!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compare plans */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Compare nossos planos</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Escolha o plano perfeito para suas necessidades
          </p>
          <Button asChild size="lg" variant="outline">
            <Link to="/pricing">Ver planos e preços</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Features;
