
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/auth/AuthContext';
import { Sparkles, LockIcon } from 'lucide-react';
import { toast } from "sonner";

type AiSuggestionProps = {
  onSelectBackground: (url: string) => void;
  onSelectColor: (color: string) => void;
  className?: string;
};

// Imagens para demonstração de geração por IA
const aiSuggestionBackgrounds = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546928686-286c9fbde1ec?q=80&w=1000&auto=format&fit=crop'
];

export const AiBackgroundSuggestor: React.FC<AiSuggestionProps> = ({ 
  onSelectBackground,
  onSelectColor,
  className = ''
}) => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBackgrounds, setGeneratedBackgrounds] = useState<string[]>([]);
  
  // Verificar se o usuário pode usar recursos de IA (plano "starter" ou superior)
  const canUseAI = user?.plan && 
    ['starter', 'pro', 'premium', 'trial'].includes(user.plan);
    
  const handleGenerate = async () => {
    if (!canUseAI) {
      toast.error('Faça upgrade para o plano Inicial ou superior para usar a geração de planos de fundo com IA.');
      return;
    }

    if (!prompt) {
      toast.error('Por favor, digite uma descrição para gerar o plano de fundo.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Em um cenário real, aqui faríamos uma chamada à API para gerar imagens
      // Por enquanto, usamos os backgrounds de demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGeneratedBackgrounds(aiSuggestionBackgrounds);
      toast.success('Sugestões de fundo geradas com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      toast.error('Ocorreu um erro ao gerar as sugestões.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!canUseAI) {
    return (
      <div 
        className={`${className} border rounded-lg p-4 relative`}
        aria-disabled="true"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg z-10">
          <LockIcon className="h-8 w-8 text-muted-foreground mb-2" aria-hidden="true" />
          <p className="text-sm text-center text-muted-foreground font-medium">
            Disponível no plano Inicial ou superior
          </p>
          <Button 
            size="sm" 
            variant="outline"
            className="mt-2"
            asChild
          >
            <a href="/dashboard/settings">Fazer upgrade</a>
          </Button>
        </div>
        
        <div className="opacity-30 pointer-events-none">
          <h3 className="text-lg font-medium mb-2">Sugestões de Fundo com IA</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Descreva como deseja seu plano de fundo e nossa IA criará sugestões personalizadas para você.
          </p>
          <Textarea 
            placeholder="Descreva o plano de fundo que deseja..." 
            disabled
            className="mb-3 h-20"
          />
          <Button disabled>
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar sugestões
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} border rounded-lg p-4`}>
      <h3 className="text-lg font-medium mb-2">Sugestões de Fundo com IA</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Descreva como deseja seu plano de fundo e nossa IA criará sugestões personalizadas para você.
      </p>
      
      <Textarea
        placeholder="Ex: Gradiente suave em tons de azul e roxo com estilo minimalista."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-3 h-20"
        disabled={isGenerating}
        maxLength={200}
      />
      
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !prompt}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" aria-hidden="true"></div>
            Gerando...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
            Gerar sugestões
          </>
        )}
      </Button>
      
      {generatedBackgrounds.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <h4 className="col-span-2 text-sm font-medium mt-2">Sugestões geradas:</h4>
          {generatedBackgrounds.map((bg, index) => (
            <div 
              key={index}
              className="aspect-[9/16] rounded-lg overflow-hidden cursor-pointer border hover:border-primary"
              onClick={() => onSelectBackground(bg)}
              role="button"
              aria-label={`Selecionar sugestão ${index + 1}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectBackground(bg);
                }
              }}
            >
              <img 
                src={bg} 
                alt={`Sugestão ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
