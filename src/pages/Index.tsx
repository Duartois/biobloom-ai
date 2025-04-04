
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Sparkles, Link2, Calendar, PanelLeft, Star, Clock, Zap } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-biobloom-200 text-biobloom-900 dark:bg-biobloom-800 dark:text-biobloom-50 max-w-fit gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Powered by AI</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Your Smart Bio-Page for{' '}
                <span className="bg-gradient-to-r from-biobloom-600 to-biobloom-800 bg-clip-text text-transparent">
                  Growth & Connection
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Create a stunning bio-page that brings together all your content, links and social media. 
                Enhanced with AI to help you grow and engage with your audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-biobloom-600 hover:bg-biobloom-700">
                  <Link to="/register">Start for free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-xl">
              <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-6 dark:from-pink-950 dark:via-purple-900 dark:to-indigo-950">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[250px] overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-biobloom-100 to-biobloom-50 p-4 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-biobloom-500 mx-auto mb-3"></div>
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
                  <div className="h-8 w-8 rounded-full bg-biobloom-500 flex items-center justify-center text-white">
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-biobloom-500">
                    <Link2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-foreground">
                Why BioBloom
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything you need to grow your audience
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Our platform combines beautiful bio-pages with AI-powered content scheduling to help you grow your online presence.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                <Link2 className="h-6 w-6 text-biobloom-600" />
              </div>
              <h3 className="text-xl font-bold">Bio-page & Links</h3>
              <p className="text-muted-foreground mt-2">
                Create a beautiful bio-page with unlimited links, custom styles and themes.
              </p>
              <div className="mt-4 flex items-center text-sm text-biobloom-600 group-hover:underline">
                Learn more
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                <Calendar className="h-6 w-6 text-biobloom-600" />
              </div>
              <h3 className="text-xl font-bold">Content Scheduling</h3>
              <p className="text-muted-foreground mt-2">
                Schedule your social media posts in advance with our AI-powered content assistant.
              </p>
              <div className="mt-4 flex items-center text-sm text-biobloom-600 group-hover:underline">
                Learn more
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                <Sparkles className="h-6 w-6 text-biobloom-600" />
              </div>
              <h3 className="text-xl font-bold">AI Assistance</h3>
              <p className="text-muted-foreground mt-2">
                Get AI-powered suggestions for your bio, links, and social media content.
              </p>
              <div className="mt-4 flex items-center text-sm text-biobloom-600 group-hover:underline">
                Learn more
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-foreground">
                Pricing
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Choose the right plan for you
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Start for free and upgrade as you grow. All plans include a 7-day free trial.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Starter Plan */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Starter</h3>
                <div className="mt-2 flex items-baseline text-foreground">
                  <span className="text-3xl font-bold tracking-tight">R$ 15</span>
                  <span className="ml-1 text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for those just getting started.
                </p>
              </div>
              <div className="space-y-3 mt-2 flex-grow">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Links ilimitados</span>
                </div>
                <div className="flex items-center">
                  <PanelLeft className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Temas de bio-page variados</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Plano de fundo com IA</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Agendamento de até 20 posts/mês</span>
                </div>
              </div>
              <Button className="mt-6 bg-biobloom-600 hover:bg-biobloom-700" asChild>
                <Link to="/register?plan=starter">Get started</Link>
              </Button>
            </div>
            
            {/* Pro Plan */}
            <div className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-background to-muted/30 p-6 shadow-lg flex flex-col ring-2 ring-biobloom-500">
              <div className="absolute top-0 right-0">
                <div className="bg-biobloom-600 text-white text-xs px-3 py-1 rotate-45 translate-x-[30%] translate-y-[30%]">
                  Popular
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="mt-2 flex items-baseline text-foreground">
                  <span className="text-3xl font-bold tracking-tight">R$ 29</span>
                  <span className="ml-1 text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  For creators and solopreneurs.
                </p>
              </div>
              <div className="space-y-3 mt-2 flex-grow">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Tudo do Starter</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Remover branding do SaaS</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Adicionar logotipo da própria marca</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Publicação automática com IA</span>
                </div>
              </div>
              <Button className="mt-6 bg-biobloom-600 hover:bg-biobloom-700" asChild>
                <Link to="/register?plan=pro">Get started</Link>
              </Button>
            </div>
            
            {/* Premium Plan */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Premium</h3>
                <div className="mt-2 flex items-baseline text-foreground">
                  <span className="text-3xl font-bold tracking-tight">R$ 85</span>
                  <span className="ml-1 text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  For teams, brands, and companies.
                </p>
              </div>
              <div className="space-y-3 mt-2 flex-grow">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Tudo do Pro</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Análises avançadas da bio-page</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Postagens ilimitadas para até 3 marcas</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-biobloom-600 mr-2" />
                  <span className="text-sm">Colaboração em equipe</span>
                </div>
              </div>
              <Button className="mt-6 bg-biobloom-600 hover:bg-biobloom-700" asChild>
                <Link to="/register?plan=premium">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-biobloom-50 dark:bg-biobloom-950/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to grow your online presence?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Join thousands of creators, freelancers, and brands using BioBloom.
              </p>
            </div>
            <Button asChild size="lg" className="mt-4 bg-biobloom-600 hover:bg-biobloom-700">
              <Link to="/register">Get started for free</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
