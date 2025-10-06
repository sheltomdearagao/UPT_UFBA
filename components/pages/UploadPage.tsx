
import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';
import { UploadCloudIcon, HomeIcon } from '../Icons';
import { Student, Simulado, CorrectionResult, CorrectionSummary, CorrectionDetail } from '../../types';
import { correctTestWithAI } from '../../services/geminiService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';


const CorrectionResultDisplay: React.FC<{ result: CorrectionResult, studentName: string, simuladoName: string }> = ({ result, studentName, simuladoName }) => {
    const { summary, details, score } = result;

    const pieData = [
        { name: 'Corretas', value: summary.correct },
        { name: 'Incorretas', value: summary.incorrect },
        { name: 'Em Branco', value: summary.blank },
    ];
    const COLORS = ['#10B981', '#EF4444', '#6B7280'];
    const totalQuestions = details.length;

    const getStatusColor = (status: CorrectionDetail['status']) => {
        switch (status) {
            case 'correct': return 'text-green-600 dark:text-green-400';
            case 'incorrect': return 'text-red-600 dark:text-red-400';
            case 'blank':
            case 'multiple':
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };
     const getStatusBgColor = (status: CorrectionDetail['status']) => {
        switch (status) {
            case 'correct': return 'bg-green-100 dark:bg-green-900';
            case 'incorrect': return 'bg-red-100 dark:bg-red-900';
            case 'blank':
            case 'multiple':
            default: return 'bg-gray-100 dark:bg-gray-700';
        }
    };

    return (
        <Card className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Resultado da Correção</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Aluno: <span className="font-semibold">{studentName}</span> | Prova Objetiva: <span className="font-semibold">{simuladoName}</span></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-center">Resumo</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4">
                        <p className="text-3xl font-bold">{score} / {totalQuestions}</p>
                        <p className="text-lg text-gray-500">Nota Final</p>
                    </div>
                </div>
                 <div className="overflow-y-auto max-h-96 pr-2">
                    <h3 className="text-xl font-bold mb-4">Detalhes</h3>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Questão</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sua Resposta</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gabarito</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {details.map(d => (
                                <tr key={d.question} className={getStatusBgColor(d.status)}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{d.question}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{d.student_answer.toUpperCase()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{d.correct_answer.toUpperCase()}</td>
                                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${getStatusColor(d.status)}`}>{d.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};


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