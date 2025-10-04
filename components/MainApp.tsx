import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { SimuladosPage } from './pages/SimuladosPage';
import { UploadPage } from './pages/UploadPage';
import { CorrigirRedacaoPage } from './pages/CorrigirRedacaoPage';
import { ReportsPage } from './pages/ReportsPage';
import { RedacoesPage } from './pages/RedacoesPage';
import { Toast } from './common/Toast';
import { Student, Simulado, CorrectionResult, CorrecaoRedacao, Redacao } from '../types';
import { useLocalStorage } from '../src/hooks/useLocalStorage';
import { initialStudents } from '../src/data/initialStudents';

type ActivePage = string | { page: string; [key: string]: any };

export const MainApp: React.FC = () => {
    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [students, setStudents] = useLocalStorage<Student[]>('students', initialStudents);
    const [simulados, setSimulados] = useLocalStorage<Simulado[]>('simulados', []);
    const [corrections, setCorrections] = useLocalStorage<CorrectionResult[]>('corrections', []);
    const [correcoesRedacao, setCorrecoesRedacao] = useLocalStorage<CorrecaoRedacao[]>('correcoesRedacao', []);
    const [redacoes, setRedacoes] = useLocalStorage<Redacao[]>('redacoes', []);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };
    
    const renderPage = () => {
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

    return (
        <>
            <AdminLayout
                activePage={activePage}
                setActivePage={setActivePage}
            >
                {renderPage()}
            </AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};