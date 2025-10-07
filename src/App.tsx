import React, { useState, useEffect } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { StudentLayout } from './components/StudentLayout'; 
import { DashboardPage } from './components/pages/DashboardPage';
import { StudentsPage } from './components/pages/StudentsPage';
import { SimuladosPage } from './components/pages/SimuladosPage';
import { EnterScoresPage } from './components/pages/UploadPage'; // Repurposed UploadPage
import { ReportsPage } from './components/pages/ReportsPage';
import { Toast } from './components/common/Toast';
import { Student, Simulado, Correction, Redacao, CorrecaoRedacao } from './types';
import { CorrigirRedacaoPage } from './components/pages/CorrigirRedacaoPage';
import { LoginPage } from './components/pages/LoginPage';
import { StudentDashboardPage } from './components/pages/student/StudentDashboardPage';
import { StudentResultsPage } from './components/pages/student/StudentResultsPage';
import { StudentEssaysPage } from './components/pages/student/StudentEssaysPage';
import { StudentEssayTopicsPage } from './components/pages/student/StudentEssayTopicsPage';

type ActivePage = string | { page: string; [key: string]: any };
type User = { role: 'admin' | 'student'; id?: string; name?: string; };

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [students, setStudents] = useLocalStorage<Student[]>('students', []);
    const [simulados, setSimulados] = useLocalStorage<Simulado[]>('simulados', []);
    const [corrections, setCorrections] = useLocalStorage<Correction[]>('corrections', []);
    const [redacoes, setRedacoes] = useLocalStorage<Redacao[]>('redacoes', []);
    const [correcoesRedacao, setCorrecoesRedacao] = useLocalStorage<CorrecaoRedacao[]>('correcoesRedacao', []);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (students.length === 0) {
            setStudents([{ id: 'default-student-01', name: 'Aluno Demonstrativo' }]);
        }
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };
    
    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
        setActivePage('dashboard'); 
    };

    const handleLogout = () => {
        setUser(null);
    };
    
    const renderAdminPage = () => {
        const pageName = typeof activePage === 'string' ? activePage : activePage.page;
        const pageProps = typeof activePage === 'object' ? activePage : {};

        switch (pageName) {
            case 'dashboard':
                return <DashboardPage students={students} simulados={simulados} corrections={corrections} setActivePage={setActivePage} />;
            case 'students':
                return <StudentsPage students={students} setStudents={setStudents} showToast={showToast} setActivePage={setActivePage} />;
            case 'simulados':
                return <SimuladosPage simulados={simulados} setSimulados={setSimulados} showToast={showToast} setActivePage={setActivePage} />;
            case 'corrigirRedacao':
                return <CorrigirRedacaoPage students={students} simulados={simulados} correcoesRedacao={correcoesRedacao} setCorrecoesRedacao={setCorrecoesRedacao} showToast={showToast} />;
            case 'enterScores':
                return <EnterScoresPage students={students} simulados={simulados} corrections={corrections} setCorrections={setCorrections} showToast={showToast} {...pageProps} />;
            case 'reports':
                return <ReportsPage students={students} simulados={simulados} corrections={corrections} setActivePage={setActivePage} {...pageProps} />;
            default:
                return <DashboardPage students={students} simulados={simulados} corrections={corrections} setActivePage={setActivePage} />;
        }
    };

    const renderStudentPage = () => {
        const pageName = typeof activePage === 'string' ? activePage : activePage.page;
        
        const student = students.find(s => s.id === user?.id);
        if (!student) return <div>Aluno não encontrado.</div>;
        
        const studentCorrections = corrections.filter(c => c.studentId === user.id);
        const studentCorrecoesRedacao = correcoesRedacao.filter(c => c.studentId === user.id);

        switch (pageName) {
            case 'dashboard':
                return <StudentDashboardPage student={student} corrections={studentCorrections} simulados={simulados} />;
            case 'results':
                return <StudentResultsPage student={student} corrections={studentCorrections} simulados={simulados} />;
            case 'myEssays':
                 return <StudentEssaysPage student={student} correcoesRedacao={studentCorrecoesRedacao} simulados={simulados} />;
            default:
                return <StudentDashboardPage student={student} corrections={studentCorrections} simulados={simulados} />;
        }
    };

    const renderContent = () => {
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
