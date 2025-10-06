
import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Student, Simulado, CorrectionResult, CorrectionDetail } from '../../types';
import { UploadCloudIcon } from '../Icons';

type StudentAnswerOptions = 'A' | 'B' | 'C' | 'D' | 'E' | 'blank' | 'multiple';

const ANSWER_OPTIONS: StudentAnswerOptions[] = ['A', 'B', 'C', 'D', 'E', 'blank', 'multiple'];

interface CorrigirProvaObjetivaPageProps {
  students: Student[];
  simulados: Simulado[];
  setCorrections: React.Dispatch<React.SetStateAction<CorrectionResult[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const CorrigirProvaObjetivaPage: React.FC<CorrigirProvaObjetivaPageProps> = ({ students, simulados, setCorrections, showToast }) => {
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedSimuladoId, setSelectedSimuladoId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [studentAnswers, setStudentAnswers] = useState<Record<number, StudentAnswerOptions>>({});

    const selectedSimulado = useMemo(() => simulados.find(s => s.id === selectedSimuladoId), [simulados, selectedSimuladoId]);

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
            showToast('Selecione um aluno, uma prova e a imagem da folha de respostas.', 'error');
            return;
        }
        setIsCorrecting(true);
    };

    const resetForm = () => {
        setSelectedStudentId('');
        setSelectedSimuladoId('');
        setImageFile(null);
        setImagePreview(null);
        setStudentAnswers({});
        setIsCorrecting(false);
    };

    const handleSaveCorrection = () => {
        if (!selectedSimulado) return;

        let score = 0;
        const summary = { correct: 0, incorrect: 0, blank: 0, multiple: 0 };
        const details: CorrectionDetail[] = selectedSimulado.answerKey.map(keyItem => {
            const studentAnswer = studentAnswers[keyItem.question] || 'blank';
            let status: CorrectionDetail['status'] = 'blank';

            if (studentAnswer === 'blank') {
                summary.blank++;
                status = 'blank';
            } else if (studentAnswer === 'multiple') {
                summary.multiple++;
                status = 'multiple';
            } else if (studentAnswer === keyItem.answer.toUpperCase()) {
                summary.correct++;
                score++;
                status = 'correct';
            } else {
                summary.incorrect++;
                status = 'incorrect';
            }

            return {
                question: keyItem.question,
                student_answer: studentAnswer,
                correct_answer: keyItem.answer,
                status,
                area: keyItem.area,
            };
        });

        const newCorrection: CorrectionResult = {
            id: new Date().toISOString(),
            studentId: selectedStudentId,
            simuladoId: selectedSimuladoId,
            submittedAt: new Date().toISOString(),
            answerSheetUrl: imagePreview!,
            score,
            summary,
            details,
        };

        setCorrections(prev => [...prev, newCorrection]);
        showToast('Correção salva com sucesso!', 'success');
        resetForm();
    };

    if (isCorrecting && selectedSimulado) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-6rem)]">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg overflow-auto p-4 flex items-center justify-center">
                    <img src={imagePreview!} alt="Folha de Respostas" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 overflow-y-auto flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Painel de Correção Manual</h2>
                    <div className="flex-grow space-y-3 pr-2">
                        {selectedSimulado.answerKey.map(item => (
                            <div key={item.question} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                    Questão {item.question} <span className="text-sm font-normal">(Gabarito: {item.answer})</span>
                                </h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {ANSWER_OPTIONS.map(option => (
                                        <label key={option} className={`flex items-center text-xs p-2 rounded-md cursor-pointer ${studentAnswers[item.question] === option ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600'}`}>
                                            <input
                                                type="radio"
                                                name={`q${item.question}`}
                                                value={option}
                                                checked={studentAnswers[item.question] === option}
                                                onChange={() => setStudentAnswers(prev => ({ ...prev, [item.question]: option }))}
                                                className="hidden"
                                            />
                                            <span className="capitalize">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        <button onClick={handleSaveCorrection} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">Salvar Correção</button>
                        <button onClick={resetForm} className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-lg">Cancelar</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Corrigir Prova Objetiva</h1>
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
                        <label htmlFor="simulado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecione a Prova Objetiva</label>
                        <select id="simulado" value={selectedSimuladoId} onChange={(e) => setSelectedSimuladoId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="" disabled>-- Provas Objetivas --</option>
                            {simulados.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Folha de Respostas</label>
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
                        Iniciar Correção Manual
                    </button>
                </div>
            </Card>
        </div>
    );
};
