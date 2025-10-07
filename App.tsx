import React, { useState, useEffect } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { DashboardPage } from './components/pages/DashboardPage';
import { StudentsPage } from './components/pages/StudentsPage';
import { SimuladosPage } from './components/pages/SimuladosPage';
import { CorrigirProvaObjetivaPage } from './components/pages/CorrigirProvaObjetivaPage';
import { CorrigirRedacaoPage } from './components/pages/CorrigirRedacaoPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { Toast } from './components/common/Toast';
import { Student, Simulado, CorrectionResult, CorrecaoRedacao, Redacao } from './types';
import { RedacoesPage } from './components/pages/RedacoesPage';
import { LoginPage } from './components/pages/LoginPage';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Spinner } from './components/common/Spinner';

type ActivePage = string | { page: string; [key: string]: any };

const App = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialDataLoading, setInitialDataLoading] = useState(true);

    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [students, setStudents] = useState<Student[]>([]);
    const [simulados, setSimulados] = useState<Simulado[]>([]);
    const [corrections, setCorrections] = useState<CorrectionResult[]>([]);
    const [correcoesRedacao, setCorrecoesRedacao] = useState<CorrecaoRedacao[]>([]);
    const [redacoes, setRedacoes] = useState<Redacao[]>([]);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setLoading(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            const fetchData = async () => {
                setInitialDataLoading(true);
                try {
                    const [
                        studentsRes,
                        simuladosRes,
                        correctionsRes,
                        correcoesRedacaoRes,
                        redacoesRes
                    ] = await Promise.all([
                        supabase.from('students').select('*'),
                        supabase.from('simulados').select('*'),
                        supabase.from('corrections').select('*'),
                        supabase.from('correcoes_redacao').select('*'),
                        supabase.from('redacoes').select('*'),
                    ]);

                    if (studentsRes.data) setStudents(studentsRes.data as Student[]);
                    if (simuladosRes.data) setSimulados(simuladosRes.data as Simulado[]);
                    if (correctionsRes.data) setCorrections(correctionsRes.data as CorrectionResult[]);
                    if (correcoesRedacaoRes.data) setCorrecoesRedacao(correcoesRedacaoRes.data as CorrecaoRedacao[]);
                    if (redacoesRes.data) setRedacoes(redacoesRes.data as Redacao[]);

                } catch (error) {
                    console.error("Error fetching data:", error);
                    showToast("Erro ao carregar os dados.", "error");
                } finally {
                    setInitialDataLoading(false);
                }
            };
            fetchData();
        }
    }, [session]);


    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };
    
    const renderPage = () => {
        const pageName = typeof activePage === 'string' ? activePage : activePage.page;
        const pageProps = typeof activePage === 'object' ? activePage : {};

        if (initialDataLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" />
                </div>
            );
        }

        switch (pageName) {
            case 'dashboard':
                return <DashboardPage students={students} simulados={simulados} corrections={corrections} correcoesRedacao={correcoesRedacao} setActivePage={setActivePage} />;
            case 'students':
                return <StudentsPage students={students} setStudents={setStudents} showToast={showToast} setActivePage={setActivePage} />;
            case 'simulados':
                return <SimuladosPage simulados={simulados} setSimulados={setSimulados} showToast={showToast} setActivePage={setActivePage} />;
            case 'temasRedacao':
                return <RedacoesPage redacoes={redacoes} setRedacoes={setRedacoes} showToast={showToast} />;
            case 'corrigirProvaObjetiva':
                return <CorrigirProvaObjetivaPage students={students} simulados={simulados} setCorrections={setCorrections} showToast={showToast} />;
            case 'corrigirRedacao':
                 return <CorrigirRedacaoPage students={students} simulados={simulados} correcoesRedacao={correcoesRedacao} setCorrecoesRedacao={setCorrecoesRedacao} showToast={showToast} />;
            case 'reports':
                return <ReportsPage students={students} simulados={simulados} corrections={corrections} correcoesRedacao={correcoesRedacao} setActivePage={setActivePage} {...pageProps} />;
            default:
                return <div>Page not found</div>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <>
            {session ? (
                <AdminLayout
                    activePage={activePage}
                    setActivePage={setActivePage}
                >
                    {renderPage()}
                </AdminLayout>
            ) : (
                <LoginPage />
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}

export default App;