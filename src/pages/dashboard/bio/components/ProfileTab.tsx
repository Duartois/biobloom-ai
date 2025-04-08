
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileTabProps {
  name: string;
  bio: string;
  username?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ name, bio, username, onInputChange }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nome de Exibição</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onInputChange}
          placeholder="Seu nome ou nome da marca"
          className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-800"
        />
        <p className="text-xs text-muted-foreground">
          Este nome será exibido na sua Bio-page
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={onInputChange}
          placeholder="Uma breve descrição sobre você ou sua marca"
          rows={3}
          className="resize-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-800"
        />
        <p className="text-xs text-muted-foreground">
          Máximo de 160 caracteres
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-muted-foreground">
          URL da sua bio-page
        </span>
        <div className="flex items-center bg-muted/50 px-3 py-1 rounded-md">
          <span className="text-sm text-muted-foreground mr-1">biobloom.com/</span>
          <span className="text-sm font-medium">{username || 'username'}</span>
        </div>
      </div>
    </div>
  );
};
