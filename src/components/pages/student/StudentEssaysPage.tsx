import React, { useState } from 'react';
import { Card } from '../../common/Card';
import { Modal } from '../../common/Modal';
import { CorrecaoRedacao, Simulado, Student } from '../../../types';
import { EditIcon } from '../../Icons';

interface StudentEssaysPageProps {
  student: Student;
  correcoesRedacao: CorrecaoRedacao[];
  simulados: Simulado[];
}

const EssayResultDisplay: React.FC<{ correction: CorrecaoRedacao }> = ({ correction }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 dark:bg-gray-900 rounded-lg p-2 flex items-center justify-center">
                <img src={correction.redacaoImageUrl} alt="Redação do aluno" className="max-w-full max-h-[70vh] object-contain" />
            </div>
            <div className="space-y-4">
                <div className="text-center mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-lg text-gray-600 dark:text-gray-300">Nota Final</p>
                    <p className={`text-5xl font-bold ${correction.situation ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                        {correction.situation ? 0 : correction.finalScore}
                    </p>
                     {correction.situation && <p className="text-red-500 font-semibold mt-1">({correction.situation})</p>}
                </div>

                <div className="space-y-2">
                    {Object.entries(correction.scores).map(([key, score]) => (
                        <div key={key} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                            <span className="font-semibold uppercase text-gray-700 dark:text-gray-200">{key}</span>
                            <span className="font-mono text-lg">{score}</span>
                        </div>
                    ))}
                </div>
                
                {correction.observations && (
                     <div className="mt-4 p-3 bg-blue-50 dark:bg-gray-700 rounded-md border-l-4 border-blue-400">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Observações do Corretor:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-1">{correction.observations}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const StudentEssaysPage: React.FC<StudentEssaysPageProps> = ({ student, correcoesRedacao, simulados }) => {
  const [selectedCorrection, setSelectedCorrection] = useState<CorrecaoRedacao | null>(null);

  const getSimuladoName = (simuladoId: string) => {
    return simulados.find(s => s.id === simuladoId)?.name || 'Redação Avulsa';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Minhas Redações Corrigidas</h1>
      
      <Card>
        {correcoesRedacao.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {correcoesRedacao.sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map(correction => (
              <li key={correction.id} className="py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-4">
                        <EditIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{getSimuladoName(correction.simuladoId)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Corrigida em: {new Date(correction.submittedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                   <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{correction.finalScore}</p>
                   <button 
                    onClick={() => setSelectedCorrection(correction)} 
                    className="text-sm text-blue-500 hover:underline"
                   >
                     Ver Correção
                   </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Nenhuma redação corrigida foi encontrada.</p>
            <p className="text-sm">Suas notas aparecerão aqui após a correção.</p>
          </div>
        )}
      </Card>

      {selectedCorrection && (
        <Modal isOpen={!!selectedCorrection} onClose={() => setSelectedCorrection(null)} title={`Correção: ${getSimuladoName(selectedCorrection.simuladoId)}`}>
            <EssayResultDisplay correction={selectedCorrection} />
        </Modal>
      )}
    </div>
  );
};
