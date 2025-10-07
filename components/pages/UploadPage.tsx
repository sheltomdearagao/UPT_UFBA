
import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Student, Simulado, Correction } from '../../types';
import { SCORE_AREAS, OBJECTIVE_SCORE_AREAS } from '../../constants';

type ScoresState = Record<string, Partial<Correction['scores']>>;

export const EnterScoresPage: React.FC<{
  students: Student[];
  simulados: Simulado[];
  corrections: Correction[];
  setCorrections: React.Dispatch<React.SetStateAction<Correction[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
  simuladoId: string;
}> = ({ students, simulados, corrections, setCorrections, showToast, simuladoId }) => {
  
  const simulado = useMemo(() => simulados.find(s => s.id === simuladoId), [simulados, simuladoId]);

  const initialScores = useMemo(() => {
    const scores: ScoresState = {};
    students.forEach(student => {
      const existingCorrection = corrections.find(c => c.studentId === student.id && c.simuladoId === simuladoId);
      scores[student.id] = existingCorrection ? existingCorrection.scores : {};
    });
    return scores;
  }, [students, corrections, simuladoId]);

  const [scores, setScores] = useState<ScoresState>(initialScores);

  const handleScoreChange = (studentId: string, area: keyof Correction['scores'], value: string) => {
    const newScore = Math.max(0, Math.min(1000, Number(value)));
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [area]: isNaN(newScore) ? undefined : newScore,
      }
    }));
  };

  const handleSave = () => {
    const updatedCorrections = [...corrections];
    let changesMade = false;

    Object.entries(scores).forEach(([studentId, studentScores]) => {
      const allScoresPresent = SCORE_AREAS.every(area => typeof studentScores[area.id] === 'number');
      
      if (!allScoresPresent) {
        // You might want to handle incomplete scores, e.g., by skipping them or showing an error.
        // For now, we only save complete entries.
        return;
      }
      
      changesMade = true;
      const existingIndex = updatedCorrections.findIndex(c => c.studentId === studentId && c.simuladoId === simuladoId);

      const objectiveScores = OBJECTIVE_SCORE_AREAS.map(area => studentScores[area.id]!);
      const objectiveAverage = objectiveScores.reduce((sum, score) => sum + score, 0) / objectiveScores.length;

      const allScores = SCORE_AREAS.map(area => studentScores[area.id]!);
      const generalAverage = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;

      const newCorrection: Correction = {
        id: existingIndex > -1 ? updatedCorrections[existingIndex].id : new Date().toISOString(),
        studentId,
        simuladoId,
        submittedAt: new Date().toISOString(),
        scores: studentScores as Correction['scores'],
        objectiveAverage: parseFloat(objectiveAverage.toFixed(2)),
        generalAverage: parseFloat(generalAverage.toFixed(2)),
      };

      if (existingIndex > -1) {
        updatedCorrections[existingIndex] = newCorrection;
      } else {
        updatedCorrections.push(newCorrection);
      }
    });
    
    if (changesMade) {
        setCorrections(updatedCorrections);
        showToast('Notas salvas com sucesso!', 'success');
    } else {
        showToast('Nenhuma nota completa para salvar.', 'error');
    }
  };

  if (!simulado) {
    return (
        <Card>
            <p>Prova não encontrada. Volte para a página de Provas e tente novamente.</p>
        </Card>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200">Lançar Notas</h1>
      <h2 className="text-xl font-semibold mb-6 text-blue-600 dark:text-blue-400">{simulado.name}</h2>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-800">Aluno</th>
                {SCORE_AREAS.map(area => (
                  <th key={area.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{area.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {students.map(student => (
                <tr key={student.id}>
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-900">{student.name}</td>
                  {SCORE_AREAS.map(area => (
                    <td key={area.id} className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={scores[student.id]?.[area.id] ?? ''}
                        onChange={(e) => handleScoreChange(student.id, area.id, e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0-1000"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
            <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
            >
                Salvar Alterações
            </button>
        </div>
      </Card>
    </div>
  );
};
