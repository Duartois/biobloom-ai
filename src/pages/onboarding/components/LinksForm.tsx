
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

export type LinkData = {
  title: string;
  url: string;
  style?: string;
};

export type LinksFormProps = {
  links: LinkData[];
  onSubmit: (links: LinkData[]) => void;
  onBack: () => void;
  onChange: (links: LinkData[]) => void;
};

export const LinksForm: React.FC<LinksFormProps> = ({
  links = [],
  onSubmit,
  onBack,
  onChange
}) => {
  const [formLinks, setFormLinks] = useState<LinkData[]>(links.length ? links : [{ title: '', url: '', style: 'default' }]);
  
  const addLink = () => {
    if (formLinks.length < 5) {
      const updatedLinks = [...formLinks, { title: '', url: '', style: 'default' }];
      setFormLinks(updatedLinks);
      onChange(updatedLinks);
    }
  };
  
  const removeLink = (index: number) => {
    const updatedLinks = formLinks.filter((_, i) => i !== index);
    setFormLinks(updatedLinks);
    onChange(updatedLinks);
  };
  
  const updateLink = (index: number, field: string, value: string) => {
    const updatedLinks = [...formLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    
    // If adding a URL without a protocol, add https:// automatically
    if (field === 'url' && value && !value.startsWith('http://') && !value.startsWith('https://')) {
      updatedLinks[index].url = `https://${value}`;
    }
    
    setFormLinks(updatedLinks);
    onChange(updatedLinks);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out incomplete links before submitting
    const validLinks = formLinks.filter(link => link.title.trim() && link.url.trim());
    onSubmit(validLinks);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Passo 2 de 3</span>
          <span>66% completo</span>
        </div>
        <Progress value={66} className="h-2" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium text-base">Adicione seus links</h3>
          <p className="text-sm text-muted-foreground">
            Adicione links para seus perfis sociais, sites ou qualquer lugar que você queira compartilhar.
          </p>
        </div>

        {formLinks.map((link, index) => (
          <Card key={index} className="p-4 relative space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`title-${index}`}>Título do link</Label>
              <Input
                id={`title-${index}`}
                value={link.title}
                onChange={(e) => updateLink(index, 'title', e.target.value)}
                placeholder="Ex: Instagram, Website, Contato"
                className="focus:ring-2 focus:ring-offset-1 focus:ring-primary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`url-${index}`}>URL</Label>
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`url-${index}`}
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    placeholder="https://seusite.com"
                    className="pl-10 focus:ring-2 focus:ring-offset-1 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
            
            {formLinks.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLink(index)}
                className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </Card>
        ))}

        {formLinks.length < 5 && (
          <Button
            type="button"
            variant="outline"
            onClick={addLink}
            className="w-full border-dashed border-2 py-6 flex items-center justify-center gap-2 bg-background"
          >
            <Plus className="h-4 w-4" />
            Adicionar link
          </Button>
        )}
        
        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            type="submit" 
            className="flex items-center justify-center text-white bg-[#1B3B5A] hover:bg-[#1B3B5A]/90"
          >
            Próximo
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
