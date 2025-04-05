
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-xl mx-auto px-4 py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Clock className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-8">
          Esta página está em desenvolvimento e será lançada em breve. 
          Estamos trabalhando duro para trazer novos recursos e melhorar sua experiência.
        </p>
        
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o início
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Ir para o Dashboard</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComingSoon;
