import React from 'react';
import { Card } from '../common/Card';
import { UsersIcon, FileTextIcon, EditIcon } from '../Icons';
import { Profile, Simulado, CorrecaoRedacao } from '../../types';

interface DashboardPageProps {
  students: Profile[];
  simulados: Simulado[];
  correcoesRedacao: CorrecaoRedacao[];
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ students, simulados, correcoesRedacao, setActivePage }) => {

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div onClick={() => setActivePage('students')} className="cursor-pointer hover:scale-105 transition-transform">
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <UsersIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Alunos</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{students.length}</p>
                </div>
              </div>
            </Card>
        </div>
        <div onClick={() => setActivePage('simulados')} className="cursor-pointer hover:scale-105 transition-transform">
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <FileTextIcon className="w-6 h-6 text-green-500 dark:text-green-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Provas Objetivas</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{simulados.length}</p>
                </div>
              </div>
            </Card>
        </div>
        <div onClick={() => setActivePage('reports')} className="cursor-pointer hover:scale-105 transition-transform">
            <Card>
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <EditIcon className="w-6 h-6 text-purple-500 dark:text-purple-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Correções de Redação</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{correcoesRedacao.length}</p>
                </div>
              </div>
            </Card>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Atividade Recente</h2>
      <Card>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Nenhuma atividade recente para mostrar.</p>
            <p className="text-sm">As correções de redação aparecerão aqui.</p>
        </div>
      </Card>
    </div>
  );
};