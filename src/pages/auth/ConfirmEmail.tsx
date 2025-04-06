
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Mail } from 'lucide-react';
import MainLayout from "@/components/layout/MainLayout";

const ConfirmEmail = () => {
  return (
    <MainLayout>
      <div className="container max-w-md mx-auto px-4 py-12">
        <div className="bg-background p-6 rounded-lg border shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Verifique seu e-mail</h1>
            <p className="text-muted-foreground">
              Enviamos um e-mail de confirmação para o endereço informado. Por favor, acesse sua caixa de entrada e clique no link para ativar sua conta.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Não recebeu o e-mail? Verifique sua caixa de spam ou solicite um novo e-mail de confirmação.
            </p>
            
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link to="/login">Voltar para o Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ConfirmEmail;
