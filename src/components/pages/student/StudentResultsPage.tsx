import React, { useState } from 'react';
import { Card } from '../../common/Card';
import { Modal } from '../../common/Modal';
import { Correction, Simulado, Student } from '../../../types';
import { FileTextIcon } from '../../Icons';
import { SCORE_AREAS } from '../../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const ScoreDetailsDisplay: React.FC<{ correction: Correction }> = ({ correction }) => {
    const chartData = SCORE_AREAS.map(area => ({
        name: area.name,
        Nota: correction.scores[area.id]
    }));

    return (
        <div className="space-y-4">
            <div className="text-center mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-lg text-gray-600 dark:text-gray-300">Média Geral</p>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    {correction.generalAverage.toFixed(2)}
                </p>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 1000]} />
                        <YAxis dataKey="name" type="category" width={110} />
                        <Tooltip />
                        <Bar dataKey="Nota" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const StudentResultsPage: React.FC<{
  student: Student;
  corrections: Correction[];
  simulados: Simulado[];
}> = ({ student, corrections, simulados }) => {
  const [selectedCorrection, setSelectedCorrection] = useState<Correction | null>(null);

  const getSimuladoName = (simuladoId: string) => {
    return simulados.find(s => s.id === simuladoId)?.name || 'Prova Desconhecida';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Meus Resultados</h1>
      
      <Card>
        {corrections.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {corrections.sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map(correction => (
              <li key={correction.id} className="py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-4">
                        <FileTextIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{getSimuladoName(correction.simuladoId)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Realizada em: {new Date(correction.submittedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                   <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{correction.generalAverage.toFixed(2)}</p>
                   <button 
                    onClick={() => setSelectedCorrection(correction)} 
                    className="text-sm text-blue-500 hover:underline"
                   >
                     Ver Detalhes
                   </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Nenhum resultado de prova encontrado.</p>
            <p className="text-sm">Suas notas aparecerão aqui após a correção.</p>
          </div>
        )}
      </Card>

      {selectedCorrection && (
        <Modal isOpen={!!selectedCorrection} onClose={() => setSelectedCorrection(null)} title={`Detalhes: ${getSimuladoName(selectedCorrection.simuladoId)}`}>
          <ScoreDetailsDisplay 
            correction={selectedCorrection} 
          />
        </Modal>
      )}
    </div>
  );
};
