import React, { useState, useEffect } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { DashboardPage } from './components/pages/DashboardPage';
import { StudentsPage } from './components/pages/StudentsPage';
import { SimuladosPage } from './components/pages/SimuladosPage';
import { UploadPage } from './components/pages/UploadPage';
import { CorrigirRedacaoPage } from './components/pages/CorrigirRedacaoPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { Toast } from './components/common/Toast';
import { Student, Simulado, CorrectionResult, CorrecaoRedacao, Redacao } from './types';
import { RedacoesPage } from './components/pages/RedacoesPage';
import { supabase } from './src/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { LoginPage } from './components/LoginPage';
import { StudentLayout } from './components/StudentLayout';
import { StudentDashboardPage } from './components/pages/StudentDashboardPage';
import { Spinner } from './components/common/Spinner';
import { useLocalStorage } from './src/hooks/useLocalStorage';

type ActivePage = string | { page: string; [key: string]: any };

const App = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<{role: string, full_name: string} | null>(null);
    const [loading, setLoading] = useState(true);

    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [students, setStudents] = useLocalStorage<Student[]>('students', []);
    const [simulados, setSimulados] = useLocalStorage<Simulado[]>('simulados', []);
    const [corrections, setCorrections] = useLocalStorage<CorrectionResult[]>('corrections', []);
    const [correcoesRedacao, setCorrecoesRedacao] = useLocalStorage<CorrecaoRedacao[]>('correcoesRedacao', []);
    const [redacoes, setRedacoes] = useLocalStorage<Redacao[]>('redacoes', []);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (session?.user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role, full_name')
                    .eq('id', session.user.id)
                    .single();
                
                if (error) {
                    console.error('Error fetching profile:', error);
                } else if (data) {
                    setProfile(data);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, [session]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };
    
    const renderAdminPage = () => {
        const pageName = typeof activePage === 'string' ? activePage : activePage.page;
        const pageProps = typeof activePage === 'object' ? activePage : {};

        switch (pageName) {
            case 'dashboard':
                return <DashboardPage students={students} simulados={simulados} corrections={corrections} correcoesRedacao={correcoesRedacao} setActivePage={setActivePage} />;
            case 'students':
                return <StudentsPage students={students} setStudents={setStudents} showToast={showToast} setActivePage={setActivePage} />;
            case 'simulados':
                return <SimuladosPage simulados={simulados} setSimulados={setSimulados} showToast={showToast} setActivePage={setActivePage} />;
            case 'temasRedacao':
                return <RedacoesPage redacoes={redacoes} setRedacoes={setRedacoes} showToast={showToast} />;
            case 'upload':
                return <UploadPage students={students} simulados={simulados} corrections={corrections} setCorrections={setCorrections} showToast={showToast} />;
            case 'corrigirRedacao':
                 return <CorrigirRedacaoPage students={students} simulados={simulados} correcoesRedacao={correcoesRedacao} setCorrecoesRedacao={setCorrecoesRedacao} showToast={showToast} />;
            case 'reports':
                return <ReportsPage students={students} simulados={simulados} corrections={corrections} correcoesRedacao={correcoesRedacao} setActivePage={setActivePage} {...pageProps} />;
            default:
                return <div>Page not found</div>;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    }

    if (!session) {
        return <LoginPage />;
    }

    if (profile?.role === 'admin') {
        return (
            <>
                <AdminLayout activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout}>
                    {renderAdminPage()}
                </AdminLayout>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </>
        );
    }

    if (profile?.role === 'student') {
        const currentStudent = students.find(s => s.authId === session.user.id);
        return (
            <StudentLayout studentName={profile.full_name || 'Aluno'}>
                {currentStudent ? (
                    <StudentDashboardPage 
                        student={currentStudent} 
                        simulados={simulados} 
                        corrections={corrections} 
                        correcoesRedacao={correcoesRedacao} 
                    />
                ) : (
                    <p>Dados do estudante não encontrados no sistema local.</p>
                )}
            </StudentLayout>
        );
    }

    return <div className="flex justify-center items-center h-screen"><p>Verificando permissões...</p></div>;
}

export default App;