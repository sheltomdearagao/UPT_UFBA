
import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Student, Simulado, CorrectionResult, CorrecaoRedacao, AreaConhecimento } from '../../types';
import { AREAS_CONHECIMENTO } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsPageProps {
  students: Student[];
  simulados: Simulado[];
  corrections: CorrectionResult[];
  correcoesRedacao: CorrecaoRedacao[];
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
  studentId?: string;
  simuladoId?: string;
}

type Tab = 'geral' | 'areas' | 'redacao' | 'ranking';

const SimuladoReport: React.FC<Omit<ReportsPageProps, 'studentId'>> = (props) => {
    const { simuladoId, simulados, students, corrections, correcoesRedacao } = props;
    const [activeTab, setActiveTab] = useState<Tab>('geral');

    const simulado = useMemo(() => simulados.find(s => s.id === simuladoId), [simulados, simuladoId]);

    const relevantCorrections = useMemo(() => corrections.filter(c => c.simuladoId === simuladoId), [corrections, simuladoId]);
    const relevantRedacoes = useMemo(() => correcoesRedacao.filter(c => c.simuladoId === simuladoId), [correcoesRedacao, simuladoId]);

    const studentResults = useMemo(() => {
        return students.map(student => {
            const mcq = relevantCorrections.find(c => c.studentId === student.id);
            const redacao = relevantRedacoes.find(r => r.studentId === student.id);
            if (!mcq && !redacao) return null;
            return {
                studentId: student.id,
                studentName: student.name,
                mcq,
                redacao,
            };
        }).filter(Boolean);
    }, [students, relevantCorrections, relevantRedacoes]);
    
    if (!simulado) return <p>Prova Objetiva não encontrada.</p>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'areas': return <AreaPerformanceTab corrections={relevantCorrections} />;
            case 'redacao': return <RedacaoPerformanceTab studentResults={studentResults as any[]} />;
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
                    {(['geral', 'areas', 'redacao', 'ranking'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                        >
                            {tab === 'geral' ? 'Visão Geral' : (tab === 'areas' ? 'Por Área' : tab)}
                        </button>
                    ))}
                </nav>
            </div>
            {renderTabContent()}
        </div>
    );
};

const GeneralTab: React.FC<{studentResults: {studentName: string, mcq?: CorrectionResult, redacao?: CorrecaoRedacao}[]}> = ({ studentResults }) => (
    <Card>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Prova Objetiva</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Redação</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {studentResults.map((result, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{result.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{result.mcq ? `${result.mcq.score} / ${result.mcq.details.length}` : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">{result.redacao ? result.redacao.finalScore : 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
);

const AreaPerformanceTab: React.FC<{ corrections: CorrectionResult[] }> = ({ corrections }) => {
    const areaPerformance = useMemo(() => {
        const stats = AREAS_CONHECIMENTO.reduce((acc, area) => {
            acc[area] = { correct: 0, total: 0 };
            return acc;
        }, {} as Record<AreaConhecimento, { correct: number, total: number }>);

        corrections.forEach(correction => {
            correction.details.forEach(detail => {
                if (stats[detail.area]) {
                    stats[detail.area].total++;
                    if (detail.status === 'correct') stats[detail.area].correct++;
                }
            });
        });
        
        return AREAS_CONHECIMENTO.map(area => ({
            name: area,
            Acertos: stats[area].total > 0 ? (stats[area].correct / stats[area].total) * 100 : 0,
            ...stats[area]
        })).filter(area => area.total > 0);
    }, [corrections]);

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">Desempenho por Área do Conhecimento</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} unit="%" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                    <Legend />
                    <Bar dataKey="Acertos" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

const RedacaoPerformanceTab: React.FC<{ studentResults: { studentName: string, redacao?: CorrecaoRedacao }[] }> = ({ studentResults }) => {
    const validRedacoes = studentResults.filter(r => r.redacao).map(r => r.redacao!);
    const averages = useMemo(() => {
        const total = validRedacoes.length;
        if (total === 0) return { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, final: 0 };
        const sums = validRedacoes.reduce((acc, curr) => {
            acc.c1 += curr.scores.c1;
            acc.c2 += curr.scores.c2;
            acc.c3 += curr.scores.c3;
            acc.c4 += curr.scores.c4;
            acc.c5 += curr.scores.c5;
            acc.final += curr.finalScore;
            return acc;
        }, { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, final: 0 });
        return {
            c1: sums.c1/total, c2: sums.c2/total, c3: sums.c3/total, c4: sums.c4/total, c5: sums.c5/total, final: sums.final/total
        }
    }, [validRedacoes]);

    return (
        <Card>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                        {[...Array(5)].map((_, i) => <th key={i} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">C{i+1}</th>)}
                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {studentResults.map((r, i) => (
                        <tr key={i}>
                            <td className="px-2 py-4 font-medium">{r.studentName}</td>
                            {r.redacao ? Object.values(r.redacao.scores).map((s, j) => <td key={j} className="px-2 py-4">{s}</td>) : <td colSpan={5} className="px-2 py-4 text-center text-gray-400">N/A</td>}
                            <td className="px-2 py-4 font-bold">{r.redacao ? r.redacao.finalScore : ''}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-100 dark:bg-gray-900">
                    <tr>
                        <td className="px-2 py-3 font-bold">Média da Turma</td>
                        {/* FIX: Cast Object.values to number[] to fix type inference on `avg`. */}
                        {(Object.values(averages) as number[]).slice(0,5).map((avg, i) => <td key={i} className="px-2 py-3 font-bold">{avg.toFixed(1)}</td>)}
                        <td className="px-2 py-3 font-bold text-blue-600">{averages.final.toFixed(1)}</td>
                    </tr>
                </tfoot>
            </table>
        </Card>
    );
};

const RankingTab: React.FC<{ studentResults: { studentName: string, mcq?: CorrectionResult, redacao?: CorrecaoRedacao }[] }> = ({ studentResults }) => {
    const ranked = useMemo(() => {
        return studentResults
            .filter(r => r.mcq)
            .map(r => ({ ...r, score: r.mcq!.score }))
            .sort((a, b) => b.score - a.score);
    }, [studentResults]);

    return (
        <Card>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pos.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nota Prova Objetiva</th>
                    </tr>
                </thead>
                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {ranked.map((r, i) => (
                         <tr key={i}>
                            <td className="px-6 py-4 font-bold">{i+1}º</td>
                            <td className="px-6 py-4 font-medium">{r.studentName}</td>
                            <td className="px-6 py-4">{`${r.mcq!.score} / ${r.mcq!.details.length}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

const StudentReport: React.FC<Omit<ReportsPageProps, 'simuladoId'>> = (props) => {
    const { studentId, students, simulados, corrections, correcoesRedacao } = props;
    const student = useMemo(() => students.find(s => s.id === studentId), [students, studentId]);

    const studentCorrections = useMemo(() => corrections.filter(c => c.studentId === studentId), [corrections, studentId]);
    const studentRedacoes = useMemo(() => correcoesRedacao.filter(r => r.studentId === studentId), [correcoesRedacao, studentId]);
    
    if (!student) return <p>Aluno não encontrado.</p>;

    const getAreaPerformanceForCorrection = (correction: CorrectionResult) => {
        const stats = AREAS_CONHECIMENTO.reduce((acc, area) => {
            acc[area] = { correct: 0, total: 0 };
            return acc;
        }, {} as Record<AreaConhecimento, { correct: number, total: number }>);
         correction.details.forEach(detail => {
            if (stats[detail.area]) {
                stats[detail.area].total++;
                if (detail.status === 'correct') stats[detail.area].correct++;
            }
        });
        return Object.entries(stats).filter(([, s]) => s.total > 0).map(([area, s]) => `${area}: ${s.correct}/${s.total}`).join(' | ');
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Histórico do Aluno: <span className="text-blue-600">{student.name}</span></h2>
            <Card>
                <h3 className="text-xl font-semibold mb-3">Provas Objetivas Realizadas</h3>
                {studentCorrections.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {studentCorrections.map(c => (
                            <li key={c.id} className="py-4">
                                <p className="font-medium text-lg">{simulados.find(s => s.id === c.simuladoId)?.name || 'Prova Desconhecida'}</p>
                                <p className="text-md text-gray-700 dark:text-gray-300">Nota: <span className="font-bold">{c.score} / {c.details.length}</span> ({((c.score/c.details.length)*100).toFixed(1)}%)</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getAreaPerformanceForCorrection(c)}</p>
                                <p className="text-xs text-gray-400">Data: {new Date(c.submittedAt).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500">Nenhuma prova objetiva realizada.</p>}
            </Card>
            <Card className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Redações Corrigidas</h3>
                 {studentRedacoes.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {studentRedacoes.map(r => (
                            <li key={r.id} className="py-3">
                                <p className="font-medium">{simulados.find(s => s.id === r.simuladoId)?.name || 'Redação Avulsa'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Nota: {r.finalScore} / 1000 - Data: {new Date(r.submittedAt).toLocaleDateString()}</p>
                                {r.observations && (
                                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md border-l-4 border-blue-400">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Observações:</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{r.observations}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500">Nenhuma redação corrigida.</p>}
            </Card>
        </div>
    );
};

export const ReportsPage: React.FC<ReportsPageProps> = (props) => {
    const { students, simulados, studentId, simuladoId, setActivePage } = props;
    
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
                    Selecione uma Prova Objetiva para Análise
                </label>
                <select
                    id="simulado-select"
                    value={simuladoId || ''}
                    onChange={handleSimuladoChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="" disabled>-- Escolha uma prova objetiva --</option>
                    {simulados.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            {simuladoId ? <SimuladoReport {...props} /> : (
                <Card>
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>Selecione uma prova objetiva acima para ver os relatórios detalhados.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};
