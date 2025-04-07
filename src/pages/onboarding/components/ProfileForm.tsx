
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type ProfileFormProps = {
  defaultValues: {
    name: string;
    bio: string;
  };
  onSubmit: (data: { name: string; bio: string }) => void;
};

export const ProfileForm = ({ defaultValues, onSubmit }: ProfileFormProps) => {
  const [formData, setFormData] = React.useState(defaultValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          placeholder="Seu nome ou nome da marca"
          value={formData.name}
          onChange={handleChange}
        />
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
        />
      </div>
      <div className="pt-4">
        <Button type="submit" className="w-full sm:w-auto flex items-center justify-center">
          Próximo
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
