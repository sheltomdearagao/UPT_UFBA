import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';
import { UploadCloudIcon } from '../Icons';
import { Student, Simulado, CorrectionResult } from '../../types';
import { correctTestWithAI } from '../../services/geminiService';
import { CorrectionResultDisplay } from '../common/CorrectionResultDisplay';

export const UploadPage: React.FC<{
  students: Student[];
  simulados: Simulado[];
  corrections: CorrectionResult[];
  setCorrections: React.Dispatch<React.SetStateAction<CorrectionResult[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
}> = ({ students, simulados, corrections, setCorrections, showToast }) => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSimuladoId, setSelectedSimuladoId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latestCorrection, setLatestCorrection] = useState<CorrectionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCorrect = async () => {
    if (!selectedStudentId || !selectedSimuladoId || !imageFile || !imagePreview) {
      showToast('Por favor, selecione um aluno, uma prova objetiva e uma imagem.', 'error');
      return;
    }
    
    setIsLoading(true);
    setLatestCorrection(null);
    try {
        const base64Image = imagePreview.split(',')[1];
        const simulado = simulados.find(s => s.id === selectedSimuladoId);
        if (!simulado) throw new Error("Prova Objetiva não encontrada");
        
        const result = await correctTestWithAI(base64Image, simulado.answerKey);
        
        const newCorrection: CorrectionResult = {
            id: new Date().toISOString(),
            studentId: selectedStudentId,
            simuladoId: selectedSimuladoId,
            submittedAt: new Date().toISOString(),
            answerSheetUrl: imagePreview,
            ...result
        };

        setCorrections([...corrections, newCorrection]);
        setLatestCorrection(newCorrection);
        showToast('Correção concluída com sucesso!', 'success');
        
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
        showToast(`Falha na correção: ${errorMessage}`, 'error');
    } finally {
        setIsLoading(false);
    }
  };

  const selectedStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);
  const selectedSimulado = useMemo(() => simulados.find(s => s.id === selectedSimuladoId), [simulados, selectedSimuladoId]);


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Corrigir Prova Objetiva</h1>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="student" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecione o Aluno</label>
            <select
                id="student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>-- Alunos --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="simulado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecione a Prova Objetiva</label>
            <select
                id="simulado"
                value={selectedSimuladoId}
                onChange={(e) => setSelectedSimuladoId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>-- Provas Objetivas --</option>
              {simulados.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Folha de Respostas</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
                    ) : (
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Carregar um arquivo</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <button
                onClick={handleCorrect}
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
                {isLoading ? <><Spinner size="sm" /> <span className="ml-2">Corrigindo...</span></> : 'Corrigir com IA'}
            </button>
        </div>
      </Card>
      
      {latestCorrection && selectedStudent && selectedSimulado && (
        <CorrectionResultDisplay result={latestCorrection} studentName={selectedStudent.name} simuladoName={selectedSimulado.name} />
      )}
    </div>
  );
};
