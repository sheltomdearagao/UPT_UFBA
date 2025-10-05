import React from 'react';
import { LogOutIcon } from './Icons';
import { supabase } from '../src/integrations/supabase/client';

interface StudentLayoutProps {
  children: React.ReactNode;
  studentName: string;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children, studentName }) => {
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Portal do Aluno</h1>
          <div className="flex items-center">
            <span className="mr-4">Olá, {studentName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium hover:text-blue-500"
              aria-label="Sair"
            >
              <LogOutIcon className="w-5 h-5 mr-1" />
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
};