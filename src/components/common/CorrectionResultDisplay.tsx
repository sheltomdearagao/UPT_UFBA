import React from 'react';
import { Card } from './Card';
import { CorrectionResult, CorrectionDetail } from '../../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const CorrectionResultDisplay: React.FC<{ result: CorrectionResult, studentName: string, simuladoName: string }> = ({ result, studentName, simuladoName }) => {
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
