
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Sparkles, Link2, Calendar, PanelLeft, Star, Clock, Zap } from 'lucide-react';

const Index = () => {
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MainLayout>
      {/* Seção Hero */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-festa-amarelo/20 text-festa-laranja max-w-fit gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Powered by AI</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Sua Bio-Página Inteligente para{' '}
                <span className="bg-gradient-to-r from-festa-laranja to-festa-rosa bg-clip-text text-transparent">
                  Crescimento & Conexão
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Crie uma bio-página incrível que reúne todo o seu conteúdo, links e redes sociais. 
                Aprimorada com IA para ajudar você a crescer e engajar com seu público.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-festa-amarelo hover:bg-festa-laranja text-white">
                  <Link to="/register">Comece grátis</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pricing">Ver preços</Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-xl">
              <div className="bg-gradient-to-br from-festa-rosa/20 via-festa-amarelo/10 to-festa-roxo/20 p-6">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[250px] overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-festa-amarelo/10 p-4 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-festa-amarelo mx-auto mb-3"></div>
                    <div className="h-4 w-32 bg-white/80 rounded-md mb-6"></div>
                    <div className="h-3 w-48 bg-white/60 rounded-md mb-8"></div>
                    <div className="w-full space-y-2">
                      <div className="h-10 w-full bg-white/80 rounded-md"></div>
                      <div className="h-10 w-full bg-white/80 rounded-md"></div>
                      <div className="h-10 w-full bg-white/80 rounded-md"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <div className="h-8 w-8 rounded-full bg-festa-amarelo flex items-center justify-center text-festa-roxo">
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-festa-laranja">
                    <Link2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Recursos */}
      <section ref={featuresRef} className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-foreground">
                Por que BioBloom
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Tudo que você precisa para crescer sua audiência
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Nossa plataforma combina bio-páginas incríveis com agendamento de conteúdo potencializado por IA para ajudar você a expandir sua presença online.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                <Link2 className="h-6 w-6 text-festa-amarelo" />
              </div>
              <h3 className="text-xl font-bold">Bio-página & Links</h3>
              <p className="text-muted-foreground mt-2">
                Crie uma bio-página incrível com links ilimitados, estilos personalizados e temas.
              </p>
              <Button 
                variant="link" 
                onClick={scrollToFeatures}
                className="mt-4 flex items-center text-sm text-festa-amarelo p-0 h-auto"
              >
                Saiba mais
              </Button>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                <Calendar className="h-6 w-6 text-festa-amarelo" />
              </div>
              <h3 className="text-xl font-bold">Agendamento de Conteúdo</h3>
              <p className="text-muted-foreground mt-2">
                Agende suas postagens de redes sociais com antecedência com nosso assistente de conteúdo com IA.
              </p>
              <Button 
                variant="link" 
                asChild
                className="mt-4 flex items-center text-sm text-festa-amarelo p-0 h-auto"
              >
                <Link to="/features">Saiba mais</Link>
              </Button>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                <Sparkles className="h-6 w-6 text-festa-amarelo" />
              </div>
              <h3 className="text-xl font-bold">Assistência de IA</h3>
              <p className="text-muted-foreground mt-2">
                Receba sugestões potencializadas por IA para sua biografia, links e conteúdo de mídias sociais.
              </p>
              <Button 
                variant="link" 
                asChild
                className="mt-4 flex items-center text-sm text-festa-amarelo p-0 h-auto"
              >
                <Link to="/features">Saiba mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Preços */}
      <section ref={pricingRef} className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-foreground">
                Preços
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Escolha o plano ideal para você
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Comece gratuitamente e atualize conforme você cresce. Todos os planos incluem um período de testes de 7 dias.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Plano Gratuito */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Gratuito</h3>
                <div className="mt-2 flex items-baseline text-foreground">
                  <span className="text-3xl font-bold tracking-tight">R$ 0</span>
                  <span className="ml-1 text-sm text-muted-foreground">/mês</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfeito para experimentar.
                </p>
              </div>
              <div className="space-y-3 mt-2 flex-grow">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Até 5 links</span>
                </div>
                <div className="flex items-center">
                  <PanelLeft className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Tema básico</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Personalização limitada</span>
                </div>
              </div>
              <Button className="mt-6" variant="outline" asChild>
                <Link to="/register">Começar grátis</Link>
              </Button>
            </div>
            
            {/* Plano Inicial */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Inicial</h3>
                <div className="mt-2 flex items-baseline text-foreground">
                  <span className="text-3xl font-bold tracking-tight">R$ 9</span>
                  <span className="ml-1 text-sm text-muted-foreground">/mês</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfeito para quem está começando.
                </p>
              </div>
              <div className="space-y-3 mt-2 flex-grow">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Links ilimitados</span>
                </div>
                <div className="flex items-center">
                  <PanelLeft className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Temas de bio-page variados</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Plano de fundo com IA</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Até 20 posts/mês</span>
                </div>
              </div>
              <Button className="mt-6 bg-festa-amarelo hover:bg-festa-laranja text-white" asChild>
                <Link to="/register?plan=starter">Começar agora</Link>
              </Button>
            </div>
            
            {/* Plano Pro */}
            <div className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-background to-muted/30 p-6 shadow-lg flex flex-col ring-2 ring-festa-amarelo">
              <div className="absolute -top-2 -right-12 w-36 bg-festa-rosa text-white text-xs py-1 transform rotate-45 text-center font-bold">
                Popular
              </div>
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="mt-2 flex items-baseline text-foreground">
                  <span className="text-3xl font-bold tracking-tight">R$ 19</span>
                  <span className="ml-1 text-sm text-muted-foreground">/mês</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Para criadores e empreendedores.
                </p>
              </div>
              <div className="space-y-3 mt-2 flex-grow">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Tudo do Inicial</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Remover branding do SaaS</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Adicionar logotipo próprio</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Publicação automática com IA</span>
                </div>
              </div>
              <Button className="mt-6 bg-festa-amarelo hover:bg-festa-laranja text-white" asChild>
                <Link to="/register?plan=pro">Começar agora</Link>
              </Button>
            </div>
            
            {/* Plano Premium */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Premium</h3>
                <div className="mt-2 flex items-baseline text-foreground">
                  <span className="text-3xl font-bold tracking-tight">R$ 39</span>
                  <span className="ml-1 text-sm text-muted-foreground">/mês</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Para equipes, marcas e empresas.
                </p>
              </div>
              <div className="space-y-3 mt-2 flex-grow">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Tudo do Pro</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Análises avançadas</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Posts ilimitados (3 marcas)</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-festa-amarelo mr-2" />
                  <span className="text-sm">Colaboração em equipe</span>
                </div>
              </div>
              <Button className="mt-6 bg-festa-amarelo hover:bg-festa-laranja text-white" asChild>
                <Link to="/register?plan=premium">Começar agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção CTA */}
      <section className="py-12 md:py-16 bg-festa-amarelo/10 dark:bg-festa-roxo/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Pronto para aumentar sua presença online?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Junte-se a milhares de criadores, freelancers e marcas que já usam o BioBloom.
              </p>
            </div>
            <Button asChild size="lg" className="mt-4 bg-festa-amarelo hover:bg-festa-laranja text-white">
              <Link to="/register">Comece gratuitamente</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
