import React, { useState } from 'react';
import { Card } from '../../common/Card';
import { Modal } from '../../common/Modal';
import { CorrectionResult, Simulado, Student } from '../../../types';
import { CorrectionResultDisplay } from '../../common/CorrectionResultDisplay';
import { FileTextIcon } from '../../Icons';

interface StudentResultsPageProps {
  student: Student;
  corrections: CorrectionResult[];
  simulados: Simulado[];
}

export const StudentResultsPage: React.FC<StudentResultsPageProps> = ({ student, corrections, simulados }) => {
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionResult | null>(null);

  const getSimuladoName = (simuladoId: string) => {
    return simulados.find(s => s.id === simuladoId)?.name || 'Prova Desconhecida';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Meus Resultados - Provas Objetivas</h1>
      
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
                   <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{correction.score} / {correction.details.length}</p>
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
            <p>Nenhum resultado de prova objetiva encontrado.</p>
            <p className="text-sm">Suas notas aparecerão aqui após a correção.</p>
          </div>
        )}
      </Card>

      {selectedCorrection && (
        <Modal isOpen={!!selectedCorrection} onClose={() => setSelectedCorrection(null)} title="Detalhes da Correção">
          <CorrectionResultDisplay 
            result={selectedCorrection} 
            studentName={student.name} 
            simuladoName={getSimuladoName(selectedCorrection.simuladoId)}
          />
        </Modal>
      )}
    </div>
  );
};
