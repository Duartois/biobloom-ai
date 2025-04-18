
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ProfileTabProps {
  name: string;
  bio: string;
  username: string;
  usernameError?: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ 
  name, 
  bio, 
  username, 
  usernameError, 
  onInputChange 
}) => {
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
          Este nome será exibido no seu Bio Link
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Nome de Usuário</Label>
        <Input
          id="username"
          name="username"
          value={username}
          onChange={onInputChange}
          placeholder="username"
          className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-800"
        />
        <p className="text-xs text-muted-foreground">
          Este nome será usado na URL do seu Bio Link: biobloom.com/{username || 'username'}
        </p>
        {usernameError && (
          <Alert variant="destructive" className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{usernameError}</AlertDescription>
          </Alert>
        )}
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
    </div>
  );
};
