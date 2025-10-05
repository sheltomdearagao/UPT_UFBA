import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/integrations/supabase/client';
import LoginPage from './src/pages/LoginPage';
import { AdminLayout } from './components/AdminLayout';
import { DashboardPage } from './components/pages/DashboardPage';
import { StudentsPage } from './components/pages/StudentsPage';
import { SimuladosPage } from './components/pages/SimuladosPage';
import { TemasRedacaoPage } from './components/pages/TemasRedacaoPage';
import { CorrigirRedacaoPage } from './components/pages/CorrigirRedacaoPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { Toast } from './components/common/Toast';
import { Profile, Simulado, CorrecaoRedacao, TemaRedacao } from './types';

type ActivePage = string | { page: string; [key: string]: any };

const App = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Mock data - will be replaced by Supabase fetches in each component
    const [students, setStudents] = useState<Profile[]>([]);
    const [simulados, setSimulados] = useState<Simulado[]>([]);
    const [correcoesRedacao, setCorrecoesRedacao] = useState<CorrecaoRedacao[]>([]);
    const [temasRedacao, setTemasRedacao] = useState<TemaRedacao[]>([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };
    
    const renderPage = () => {
        const pageName = typeof activePage === 'string' ? activePage : activePage.page;
        const pageProps = typeof activePage === 'object' ? activePage : {};

        switch (pageName) {
            case 'dashboard':
                return <DashboardPage students={students} simulados={simulados} correcoesRedacao={correcoesRedacao} setActivePage={setActivePage} />;
            case 'students':
                return <StudentsPage showToast={showToast} setActivePage={setActivePage} />;
            case 'simulados':
                return <SimuladosPage showToast={showToast} setActivePage={setActivePage} />;
            case 'temasRedacao':
                return <TemasRedacaoPage showToast={showToast} />;
            case 'corrigirRedacao':
                 return <CorrigirRedacaoPage showToast={showToast} />;
            case 'reports':
                return <ReportsPage students={students} simulados={simulados} correcoesRedacao={correcoesRedacao} setActivePage={setActivePage} {...pageProps} />;
            default:
                return <div>Page not found</div>;
        }
    };

    if (!session) {
        return <LoginPage />;
    }

    return (
        <>
            <AdminLayout
                activePage={activePage}
                setActivePage={setActivePage}
                onLogout={handleLogout}
            >
                {renderPage()}
            </AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}

export default App;