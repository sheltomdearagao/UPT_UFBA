import React, { useState, useEffect } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { StudentLayout } from './components/StudentLayout'; 
import { DashboardPage } from './components/pages/DashboardPage';
import { StudentsPage } from './components/pages/StudentsPage';
import { SimuladosPage } from './components/pages/SimuladosPage';
import { UploadPage } from './components/pages/UploadPage';
import { CorrigirRedacaoPage } from './components/pages/CorrigirRedacaoPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { Toast } from './components/common/Toast';
import { Student, Simulado, CorrectionResult, CorrecaoRedacao, Redacao } from './types';
import { RedacoesPage } from './components/pages/RedacoesPage';
import { LoginPage } from './components/pages/LoginPage';
import { StudentDashboardPage } from './components/pages/student/StudentDashboardPage';
import { StudentResultsPage } from './components/pages/student/StudentResultsPage';
import { StudentEssaysPage } from './components/pages/student/StudentEssaysPage';
import { StudentEssayTopicsPage } from './components/pages/student/StudentEssayTopicsPage';
import { studentService, simuladoService, correctionService, redacaoService, correcaoRedacaoService } from './services/supabaseService';
import { useAuth } from './services/authService';

type ActivePage = string | { page: string; [key: string]: any };
type User = { role: 'admin' | 'student'; id?: string; name?: string; };

const App = () => {
    const { user: authUser, loading: authLoading } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [students, setStudents] = useState<Student[]>([]);
    const [simulados, setSimulados] = useState<Simulado[]>([]);
    const [corrections, setCorrections] = useState<CorrectionResult[]>([]);
    const [correcoesRedacao, setCorrecoesRedacao] = useState<CorrecaoRedacao[]>([]);
    const [redacoes, setRedacoes] = useState<Redacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Load data from Supabase when user is authenticated
    useEffect(() => {
        const loadData = async () => {
            if (!authUser) return;
            
            try {
                setLoading(true);
                
                // Load all data from Supabase
                const [loadedStudents, loadedSimulados, loadedCorrections, loadedCorrecoesRedacao, loadedRedacoes] = 
                    await Promise.all([
                        studentService.getAllStudents(),
                        simuladoService.getAllSimulados(),
                        correctionService.getAllCorrectionResults(),
                        correcaoRedacaoService.getAllCorrecoesRedacao(),
                        redacaoService.getAllRedacoes()
                    ]);
                
                setStudents(loadedStudents);
                setSimulados(loadedSimulados);
                setCorrections(loadedCorrections);
                setCorrecoesRedacao(loadedCorrecoesRedacao);
                setRedacoes(loadedRedacoes);
                
                // Set the authenticated user
                setUser({
                    role: authUser.role,
                    id: authUser.id,
                    name: authUser.name
                });
            } catch (error) {
                console.error('Error loading data from Supabase:', error);
                showToast('Erro ao carregar dados do servidor', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [authUser]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };
    
    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setActivePage('dashboard'); 
    };

    const handleLogout = async () => {
        setUser(null);
        try {
            await import('./services/authService').then(({ authService }) => authService.signOut());
        } catch (error) {
            console.error('Error signing out:', error);
        }
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
                return <DashboardPage students={students} simulados={simulados} corrections={corrections} correcoesRedacao={correcoesRedacao} setActivePage={setActivePage} />;
        }
    };

    const renderStudentPage = () => {
        const pageName = typeof activePage === 'string' ? activePage : activePage.page;
        
        const student = students.find(s => s.id === user?.id);
        if (!student) return <div>Aluno não encontrado.</div>;
        
        const studentCorrections = corrections.filter(c => c.studentId === user?.id);
        const studentRedacoes = correcoesRedacao.filter(c => c.studentId === user?.id);

        switch (pageName) {
            case 'dashboard':
                return <StudentDashboardPage student={student} corrections={studentCorrections} correcoesRedacao={studentRedacoes} simulados={simulados} />;
            case 'results':
                return <StudentResultsPage student={student} corrections={studentCorrections} simulados={simulados} />;
            case 'essays':
                return <StudentEssaysPage student={student} correcoesRedacao={studentRedacoes} simulados={simulados} />;
            case 'essayTopics':
                return <StudentEssayTopicsPage redacoes={redacoes} />;
            default:
                return <StudentDashboardPage student={student} corrections={studentCorrections} correcoesRedacao={studentRedacoes} simulados={simulados} />;
        }
    };

    const renderContent = () => {
        if (authLoading || loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Carregando...</p>
                    </div>
                </div>
            );
        }
        
        if (!user) {
            return <LoginPage students={students} onLogin={handleLogin} showToast={showToast} />;
        }
        if (user.role === 'admin') {
            return (
                 <AdminLayout
                    activePage={activePage}
                    setActivePage={setActivePage}
                    onLogout={handleLogout}
                >
                    {renderAdminPage()}
                </AdminLayout>
            );
        }
        if (user.role === 'student') {
            return (
                <StudentLayout
                    user={user}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    onLogout={handleLogout}
                >
                    {renderStudentPage()}
                </StudentLayout>
            );
        }
        return null;
    }

    return (
        <>
            {renderContent()}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}

export default App;