import React, { useState } from 'react';
import { Card } from '../common/Card';
import { FileTextIcon } from '../Icons';
import { Student } from '../../types';

interface LoginPageProps {
  students: Student[];
  onLogin: (user: { role: 'admin' | 'student'; id?: string; name?: string; }) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ students, onLogin, showToast }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'admin@example.com') {
      onLogin({ role: 'admin' });
    } else if (email.toLowerCase() === 'student@example.com') {
      if (students.length > 0) {
        // Log in as the first student for demonstration purposes
        const studentUser = students[0];
        onLogin({ role: 'student', id: studentUser.id, name: studentUser.name });
      } else {
        showToast('Nenhum aluno cadastrado no sistema para login.', 'error');
      }
    } else {
        showToast('Credenciais inválidas. Use admin@example.com ou student@example.com.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                 <FileTextIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">AI Test Correction System</h1>
            <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">A correção simplificada, inteligente e rápida.</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com ou student@example.com"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Entrar
              </button>
            </div>
          </form>
        </Card>
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="font-semibold">Para demonstração, use:</p>
          <p><strong className="text-gray-700 dark:text-gray-200">Admin:</strong> admin@example.com</p>
          <p><strong className="text-gray-700 dark:text-gray-200">Aluno:</strong> student@example.com</p>
        </div>
      </div>
    </div>
  );
};
