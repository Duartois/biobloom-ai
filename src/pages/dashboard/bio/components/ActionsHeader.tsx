
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Eye, Save } from 'lucide-react';
import { ensureProtocol } from '@/types/bio';

interface ActionsHeaderProps {
  username?: string;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ActionsHeader: React.FC<ActionsHeaderProps> = ({ username, isSaving, onSubmit }) => {
  const appUrl = window.location.origin;
  const profileUrl = username ? `${appUrl}/${username}` : undefined;

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Editar Bio Link</h1>
      <div className="flex gap-2">
        {username && (
          <Button 
            variant="outline"
            asChild
            aria-label="Visualizar seu bio link"
          >
            <Link to={`/${username}`} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
              Visualizar
            </Link>
          </Button>
        )}
        <Button 
          type="submit"
          form="bio-form"
          className="bg-blue-800 hover:bg-blue-700 text-white"
          onClick={onSubmit}
          disabled={isSaving}
          aria-label={isSaving ? "Salvando alterações..." : "Salvar alterações"}
        >
          {isSaving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
