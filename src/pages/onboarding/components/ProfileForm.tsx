
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ProfileFormProps = {
  profile: {
    name: string;
    bio: string;
    interests: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const ProfileForm = ({ profile, onChange }: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          placeholder="Seu nome ou nome da marca"
          value={profile.name}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Usaremos isso para sugerir o plano de fundo perfeito para sua página
        </p>
      </div>
    </div>
  );
};
