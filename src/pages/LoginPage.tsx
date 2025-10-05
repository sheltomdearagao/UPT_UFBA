import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../components/common/Card';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Plataforma de Simulados</h1>
        <Card>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Seu e-mail',
                    password_label: 'Sua senha',
                    button_label: 'Entrar',
                    social_provider_text: 'Entrar com {{provider}}',
                    link_text: 'Já tem uma conta? Entre',
                  },
                  sign_up: {
                    email_label: 'Seu e-mail',
                    password_label: 'Crie uma senha',
                    button_label: 'Cadastrar',
                    social_provider_text: 'Cadastrar com {{provider}}',
                    link_text: 'Não tem uma conta? Cadastre-se',
                  },
                   forgotten_password: {
                    email_label: 'Seu e-mail',
                    button_label: 'Enviar instruções',
                    link_text: 'Esqueceu sua senha?',
                  },
                },
              }}
            />
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;