import React from 'react';
import { Card } from '../common/Card';
import { UsersIcon, FileTextIcon, UploadCloudIcon, EditIcon } from '../Icons';
import { Student, Simulado, CorrectionResult, CorrecaoRedacao } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardPageProps {
  students: Student[];
  simulados: Simulado[];
  corrections: CorrectionResult[];
  correcoesRedacao: CorrecaoRedacao[];
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ students, simulados, corrections, correcoesRedacao, setActivePage }) => {

  const chartData = corrections
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .map(c => ({
      name: new Date(c.submittedAt).toLocaleDateString('pt-BR'),
      score: c.score,
      student: students.find(s => s.id === c.studentId)?.name || 'Unknown',
    }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                    <UploadCloudIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Correções de Provas Objetivas</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{corrections.length}</p>
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

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Histórico de Notas (Provas Objetivas)</h2>
      <Card>
        {corrections.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700"/>
              <XAxis dataKey="name" className="text-xs text-gray-600 dark:text-gray-400"/>
              <YAxis className="text-xs text-gray-600 dark:text-gray-400"/>
              <Tooltip
                contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(5px)',
                    border: '1px solid #ccc',
                    borderRadius: '0.5rem',
                    color: '#333'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} name="Nota"/>
            </LineChart>
          </ResponsiveContainer>
        ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Nenhuma correção de prova objetiva foi realizada ainda.</p>
                <p className="text-sm">Faça o upload de um gabarito para começar.</p>
            </div>
        )}
      </Card>
    </div>
  );
};