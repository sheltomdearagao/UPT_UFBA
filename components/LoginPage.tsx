import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../src/integrations/supabase/client';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
            Plataforma de Simulados
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Faça login ou crie sua conta para continuar
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="dark"
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Registrar',
                loading_button_label: 'Registrando...',
                link_text: 'Não tem uma conta? Registre-se',
              },
              forgotten_password: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Enviar instruções',
                loading_button_label: 'Enviando...',
                link_text: 'Esqueceu sua senha?',
              },
            },
          }}
        />
      </div>
    </div>
  );
};