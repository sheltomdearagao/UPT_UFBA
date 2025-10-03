import React from 'react';
import { Card } from '../common/Card';
import { Student, Simulado, CorrectionResult, CorrecaoRedacao } from '../../types';
import { FileTextIcon } from '../Icons';

interface StudentDashboardPageProps {
  student: Student;
  simulados: Simulado[];
  corrections: CorrectionResult[];
  correcoesRedacao: CorrecaoRedacao[];
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ student, simulados, corrections, correcoesRedacao }) => {
  
  const studentCorrections = corrections.filter(c => c.studentId === student.id);
  const studentRedacoes = correcoesRedacao.filter(c => c.studentId === student.id);

  const results = simulados.map(simulado => {
    const mcq = studentCorrections.find(c => c.simuladoId === simulado.id);
    const redacao = studentRedacoes.find(r => r.simuladoId === simulado.id);
    return {
      simulado,
      mcq,
      redacao,
    };
  }).filter(r => r.mcq || r.redacao);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Meu Desempenho</h1>
      {results.length > 0 ? (
        <div className="space-y-6">
          {results.map(({ simulado, mcq, redacao }) => (
            <Card key={simulado.id}>
              <h2 className="text-xl font-bold mb-3">{simulado.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mcq && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-lg">Prova Objetiva</h3>
                    <p className="text-2xl">{mcq.score} / {mcq.details.length} <span className="text-base text-gray-500">acertos</span></p>
                  </div>
                )}
                {redacao && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-lg">Redação</h3>
                    <p className="text-2xl">{redacao.finalScore} / 1000</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FileTextIcon className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-sm font-medium">Nenhum resultado encontrado</h3>
            <p className="mt-1 text-sm">Suas notas aparecerão aqui assim que forem corrigidas.</p>
          </div>
        </Card>
      )}
    </div>
  );
};