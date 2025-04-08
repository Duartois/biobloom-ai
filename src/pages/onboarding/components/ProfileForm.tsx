
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type ProfileFormData = {
  name: string;
  bio: string;
  username?: string;
};

export type ProfileFormProps = {
  name: string;
  bio: string;
  username?: string;
  onSubmit: (data: ProfileFormData) => void;
  onChange?: (data: ProfileFormData) => void;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  name = "", 
  bio = "", 
  username = "", 
  onSubmit,
  onChange
}) => {
  const [formData, setFormData] = React.useState<ProfileFormData>({
    name,
    bio,
    username
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    
    // For real-time preview updates
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Passo 1 de 3</span>
          <span>33% completo</span>
        </div>
        <Progress value={33} className="h-2" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Nome de Exibição</Label>
          <Input
            id="name"
            name="name"
            placeholder="Seu nome ou nome da marca"
            value={formData.name}
            onChange={handleChange}
            className="focus:ring-2 focus:ring-offset-1 focus:ring-primary/50"
            required
          />
          <p className="text-xs text-muted-foreground">
            Este nome será exibido na sua página de bio
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Nome de Usuário</Label>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">biobloom.com/</span>
            <Input
              id="username"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-offset-1 focus:ring-primary/50"
              disabled={!!username}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {username ? "Seu nome de usuário não pode ser alterado" : "Escolha um nome de usuário único"}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Uma breve descrição sobre você ou sua marca"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            className="resize-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50"
          />
          <p className="text-xs text-muted-foreground">
            Máximo de 160 caracteres
          </p>
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full sm:w-auto flex items-center justify-center text-white bg-[#1B3B5A] hover:bg-[#1B3B5A]/90"
          >
            Próximo
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
