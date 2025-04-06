
import { supabase } from "@/integrations/supabase/client";

// Função para criar o registro do usuário quando ele existe na auth mas não na tabela users
export const createUserRecord = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('Erro ao obter usuário da autenticação:', error);
      return;
    }

    const userEmail = user.email || '';
    const username = user.user_metadata?.username || userEmail.split('@')[0];
    const name = user.user_metadata?.name || username;

    const { error: insertError } = await supabase
      .from('users')
      .insert([
          {
         id: user.id,
         email: userEmail,
         username,
         name,
         plano_atual: 'trial',
         }
      ]);

    if (insertError) {
      console.error('Erro ao criar registro do usuário:', insertError);
   } else {
      console.log('Registro do usuário criado com sucesso.');
   }

  } catch (error) {
   console.error('Falha ao criar registro do usuário:', error);
 }
};
