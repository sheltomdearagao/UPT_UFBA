
import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Student, Simulado, Correction } from '../../types';
import { SCORE_AREAS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsPageProps {
  students: Student[];
  simulados: Simulado[];
  corrections: Correction[];
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
  studentId?: string;
  simuladoId?: string;
}

type Tab = 'geral' | 'areas' | 'ranking';

const SimuladoReport: React.FC<Omit<ReportsPageProps, 'studentId'>> = (props) => {
    const { simuladoId, simulados, students, corrections } = props;
    const [activeTab, setActiveTab] = useState<Tab>('geral');

    const simulado = useMemo(() => simulados.find(s => s.id === simuladoId), [simulados, simuladoId]);

    const relevantCorrections = useMemo(() => corrections.filter(c => c.simuladoId === simuladoId), [corrections, simuladoId]);

    const studentResults = useMemo(() => {
        return students.map(student => {
            const correction = relevantCorrections.find(c => c.studentId === student.id);
            if (!correction) return null;
            return {
                studentId: student.id,
                studentName: student.name,
                correction,
            };
        }).filter(Boolean);
    }, [students, relevantCorrections]);
    
    if (!simulado) return <p>Prova não encontrada.</p>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'areas': return <AreaAveragesTab corrections={relevantCorrections} />;
            case 'ranking': return <RankingTab studentResults={studentResults as any[]} />;
            case 'geral':
            default:
                return <GeneralTab studentResults={studentResults as any[]} />;
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Resultados: <span className="text-blue-600">{simulado.name}</span></h2>
            
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {(['geral', 'areas', 'ranking'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                        >
                            {tab === 'geral' ? 'Visão Geral' : (tab === 'areas' ? 'Médias por Área' : tab)}
                        </button>
                    ))}
                </nav>
            </div>
            {renderTabContent()}
        </div>
    );
};

const GeneralTab: React.FC<{studentResults: {studentName: string, correction: Correction}[]}> = ({ studentResults }) => (
    <Card>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média Objetiva</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Redação</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média Geral</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {studentResults.map((result, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{result.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{result.correction.objectiveAverage.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{result.correction.scores.redacao}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-700 dark:text-gray-200">{result.correction.generalAverage.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
);

const AreaAveragesTab: React.FC<{ corrections: Correction[] }> = ({ corrections }) => {
    const areaAverages = useMemo(() => {
        if (corrections.length === 0) return [];
        const sums = SCORE_AREAS.reduce((acc, area) => {
            acc[area.id] = 0;
            return acc;
        }, {} as Record<keyof Correction['scores'], number>);

        corrections.forEach(correction => {
            SCORE_AREAS.forEach(area => {
                sums[area.id] += correction.scores[area.id];
            });
        });
        
        return SCORE_AREAS.map(area => ({
            name: area.name,
            Média: sums[area.id] / corrections.length,
        }));
    }, [corrections]);

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Média de Notas por Área</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1000]}/>
                    <Tooltip formatter={(value: number) => value.toFixed(1)} />
                    <Legend />
                    <Bar dataKey="Média" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};


const RankingTab: React.FC<{ studentResults: { studentName: string, correction: Correction }[] }> = ({ studentResults }) => {
    const ranked = useMemo(() => {
        return studentResults
            .sort((a, b) => b.correction.generalAverage - a.correction.generalAverage);
    }, [studentResults]);

    return (
        <Card>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pos.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Média Geral</th>
                    </tr>
                </thead>
                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {ranked.map((r, i) => (
                         <tr key={i}>
                            <td className="px-6 py-4 font-bold">{i+1}º</td>
                            <td className="px-6 py-4 font-medium">{r.studentName}</td>
                            <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{r.correction.generalAverage.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

const StudentReport: React.FC<Omit<ReportsPageProps, 'simuladoId'>> = (props) => {
    const { studentId, students, simulados, corrections } = props;
    const student = useMemo(() => students.find(s => s.id === studentId), [students, studentId]);

    const studentCorrections = useMemo(() => corrections.filter(c => c.studentId === studentId), [corrections, studentId]);
    
    if (!student) return <p>Aluno não encontrado.</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Histórico do Aluno: <span className="text-blue-600">{student.name}</span></h2>
            <Card>
                <h3 className="text-xl font-semibold mb-3">Provas Realizadas</h3>
                {studentCorrections.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {studentCorrections.map(c => (
                            <li key={c.id} className="py-4">
                                <p className="font-medium text-lg">{simulados.find(s => s.id === c.simuladoId)?.name || 'Prova Desconhecida'}</p>
                                <p className="text-md text-gray-700 dark:text-gray-300">Média Geral: <span className="font-bold">{c.generalAverage.toFixed(2)}</span></p>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {SCORE_AREAS.map(area => (
                                        <span key={area.id} className="mr-4 capitalize">{area.name}: <span className="font-semibold">{c.scores[area.id]}</span></span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Data: {new Date(c.submittedAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500">Nenhuma prova realizada.</p>}
            </Card>
        </div>
    );
};

export const ReportsPage: React.FC<ReportsPageProps> = (props) => {
    const { simulados, studentId, simuladoId, setActivePage } = props;
    
    const handleSimuladoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSimuladoId = e.target.value;
        setActivePage({ page: 'reports', simuladoId: newSimuladoId });
    };

    if (studentId) {
        return <StudentReport {...props} />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Relatórios de Desempenho</h1>
            
            <div className="mb-6">
                <label htmlFor="simulado-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selecione uma Prova para Análise
                </label>
                <select
                    id="simulado-select"
                    value={simuladoId || ''}
                    onChange={handleSimuladoChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="" disabled>-- Escolha uma prova --</option>
                    {simulados.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            {simuladoId ? <SimuladoReport {...props} /> : (
                <Card>
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>Selecione uma prova acima para ver os relatórios detalhados.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};
