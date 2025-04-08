
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Eye, Save } from 'lucide-react';

interface ActionsHeaderProps {
  username?: string;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ActionsHeader: React.FC<ActionsHeaderProps> = ({ username, isSaving, onSubmit }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Editar Bio-Page</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          asChild
        >
          <Link to={`/${username}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </Link>
        </Button>
        <Button 
          type="submit"
          form="bio-form"
          className="bg-blue-800 hover:bg-blue-700 text-white"
          onClick={onSubmit}
        >
          {isSaving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
