import React from 'react';
import { Card } from '../../common/Card';
import { FileTextIcon, EditIcon } from '../../Icons';
import { Student, CorrectionResult, CorrecaoRedacao, Simulado } from '../../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StudentDashboardPageProps {
  student: Student;
  corrections: CorrectionResult[];
  correcoesRedacao: CorrecaoRedacao[];
  simulados: Simulado[];
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ student, corrections, correcoesRedacao, simulados }) => {
  const latestCorrection = corrections.length > 0 ? corrections.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0] : null;
  const latestRedacao = correcoesRedacao.length > 0 ? correcoesRedacao.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0] : null;

  const chartData = corrections
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
    .map(c => ({
      name: simulados.find(s => s.id === c.simuladoId)?.name.substring(0, 15) + '...' || 'Prova',
      Nota: c.score,
    }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Bem-vindo(a), {student.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FileTextIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Última Nota (Prova Objetiva)</p>
              {latestCorrection ? (
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{latestCorrection.score} / {latestCorrection.details.length}</p>
              ) : (
                <p className="text-xl text-gray-600 dark:text-gray-400">N/A</p>
              )}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <EditIcon className="w-6 h-6 text-green-500 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Última Nota (Redação)</p>
              {latestRedacao ? (
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{latestRedacao.finalScore}</p>
              ) : (
                <p className="text-xl text-gray-600 dark:text-gray-400">N/A</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Sua Evolução (Provas Objetivas)</h2>
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
              <Line type="monotone" dataKey="Nota" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Você ainda não completou nenhuma prova objetiva.</p>
                <p className="text-sm">Seus resultados aparecerão aqui.</p>
            </div>
        )}
      </Card>
    </div>
  );
};
