
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';
import { Student, Simulado, CorrecaoRedacao, RedacaoSituation } from '../../types';
import { COMPETENCY_LEVELS, COMPETENCY_2_LEVELS, REDACAO_SITUATIONS } from '../../constants';
import { UploadCloudIcon } from '../Icons';

interface CompetencyGraderProps {
    name: string;
    competencyKey: 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
    levels: { level: number; score: number }[];
    currentScore: number;
    onScoreChange: (key: CompetencyGraderProps['competencyKey'], score: number) => void;
    disabled: boolean;
}

const CompetencyGrader: React.FC<CompetencyGraderProps> = ({ name, competencyKey, levels, currentScore, onScoreChange, disabled }) => {
    return (
        <div className={`p-3 rounded-lg ${disabled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-900'}`}>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{name}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {levels.map(({ level, score }) => (
                    <label key={level} className={`flex items-center space-x-2 text-sm p-2 rounded-md cursor-pointer ${currentScore === score ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'} ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-100 dark:hover:bg-gray-600'}`}>
                        <input
                            type="radio"
                            name={competencyKey}
                            value={score}
                            checked={currentScore === score}
                            onChange={() => onScoreChange(competencyKey, score)}
                            disabled={disabled}
                            className="hidden"
                        />
                        <span>{score}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};


export const CorrigirRedacaoPage: React.FC<{
  students: Student[];
  simulados: Simulado[];
  correcoesRedacao: CorrecaoRedacao[];
  setCorrecoesRedacao: React.Dispatch<React.SetStateAction<CorrecaoRedacao[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
}> = ({ students, simulados, setCorrecoesRedacao, showToast }) => {
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedSimuladoId, setSelectedSimuladoId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isCorrecting, setIsCorrecting] = useState(false);
    
    // FIX: Add explicit type to state to help TypeScript infer types correctly for Object.values().
    const [scores, setScores] = useState<CorrecaoRedacao['scores']>({ c1: -1, c2: -1, c3: -1, c4: -1, c5: -1 });
    const [situation, setSituation] = useState<RedacaoSituation | ''>('');
    const [observations, setObservations] = useState('');
    const [finalScore, setFinalScore] = useState(0);

    useEffect(() => {
        if (situation) {
            setScores({ c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 });
            setFinalScore(0);
            return;
        }
        // FIX: Cast Object.values to number[] to fix type inference issues where `s`, `acc`, and `curr` were `unknown`.
        const newTotal = (Object.values(scores) as number[]).filter(s => s >= 0).reduce((acc, curr) => acc + curr, 0);
        setFinalScore(newTotal);
    }, [scores, situation]);

    const handleScoreChange = (key: keyof typeof scores, score: number) => {
        setScores(prev => ({ ...prev, [key]: score }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const startCorrection = () => {
        if (!selectedStudentId || !selectedSimuladoId || !imageFile) {
            showToast('Selecione um aluno, uma prova objetiva e a imagem da redação.', 'error');
            return;
        }
        setIsCorrecting(true);
    };

    const resetForm = () => {
        setSelectedStudentId('');
        setSelectedSimuladoId('');
        setImageFile(null);
        setImagePreview(null);
        setScores({ c1: -1, c2: -1, c3: -1, c4: -1, c5: -1 });
        setSituation('');
        setObservations('');
        setIsCorrecting(false);
    }

    const saveCorrection = () => {
        // FIX: Cast Object.values to number[] to fix type inference issue where `s` was `unknown`.
        if ((Object.values(scores) as number[]).some(s => s < 0) && !situation) {
            showToast('Todas as competências devem ser avaliadas.', 'error');
            return;
        }

        const newCorrection: CorrecaoRedacao = {
            id: new Date().toISOString(),
            studentId: selectedStudentId,
            simuladoId: selectedSimuladoId,
            submittedAt: new Date().toISOString(),
            redacaoImageUrl: imagePreview!,
            scores: scores as { c1: number; c2: number; c3: number; c4: number; c5: number; },
            finalScore,
            situation: situation || undefined,
            observations: observations.trim() || undefined,
        };

        setCorrecoesRedacao(prev => [...prev, newCorrection]);
        showToast('Correção salva com sucesso!', 'success');
        resetForm();
    };

    if (isCorrecting) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
                <div className="lg:col-span-2 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-auto p-4 flex items-center justify-center">
                    <img src={imagePreview!} alt="Redação do aluno" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg p-4 overflow-y-auto flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Painel de Correção</h2>
                    <div className="flex-grow space-y-3">
                       <CompetencyGrader name="Competência 1" competencyKey="c1" levels={COMPETENCY_LEVELS} currentScore={scores.c1} onScoreChange={handleScoreChange} disabled={!!situation} />
                       <CompetencyGrader name="Competência 2" competencyKey="c2" levels={COMPETENCY_2_LEVELS} currentScore={scores.c2} onScoreChange={handleScoreChange} disabled={!!situation} />
                       <CompetencyGrader name="Competência 3" competencyKey="c3" levels={COMPETENCY_LEVELS} currentScore={scores.c3} onScoreChange={handleScoreChange} disabled={!!situation} />
                       <CompetencyGrader name="Competência 4" competencyKey="c4" levels={COMPETENCY_LEVELS} currentScore={scores.c4} onScoreChange={handleScoreChange} disabled={!!situation} />
                       <CompetencyGrader name="Competência 5" competencyKey="c5" levels={COMPETENCY_LEVELS} currentScore={scores.c5} onScoreChange={handleScoreChange} disabled={!!situation} />

                       <div className="pt-2">
                           <label htmlFor="situation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Situações (Anula a Redação)</label>
                           <select 
                                id="situation"
                                value={situation}
                                onChange={(e) => setSituation(e.target.value as RedacaoSituation | '')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                           >
                               <option value="">Nenhuma</option>
                               {REDACAO_SITUATIONS.map(sit => <option key={sit} value={sit}>{sit}</option>)}
                           </select>
                       </div>
                       <div className="pt-2">
                           <label htmlFor="observations" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações do Corretor</label>
                           <textarea
                                id="observations"
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Insira comentários e sugestões para o aluno..."
                           />
                       </div>
                    </div>
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        <div className="text-center mb-4">
                            <p className="text-lg text-gray-600 dark:text-gray-300">Nota Final</p>
                            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{finalScore}</p>
                        </div>
                        <button onClick={saveCorrection} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">Salvar Correção</button>
                        <button onClick={resetForm} className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-lg">Cancelar</button>
                    </div>
                </div>
            </div>
        )
    }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Corrigir Redação</h1>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="student" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecione o Aluno</label>
            <select id="student" value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="" disabled>-- Alunos --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="simulado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associar à Prova Objetiva</label>
            <select id="simulado" value={selectedSimuladoId} onChange={(e) => setSelectedSimuladoId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="" disabled>-- Provas Objetivas --</option>
              {simulados.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagem da Redação</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {imagePreview ? <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-contain" /> : <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Carregar um arquivo</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, etc.</p>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <button onClick={startCorrection} className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">
                Iniciar Correção
            </button>
        </div>
      </Card>
    </div>
  );
};
