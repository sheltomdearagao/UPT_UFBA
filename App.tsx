
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
import { LoginPage } from './components/pages/LoginPage';

type ActivePage = string | { page: string; [key: string]: any };

// A simple hook for persisting state to localStorage
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
// FIX: Added curly braces to the catch block to fix syntax and subsequent scope errors.
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [students, setStudents] = useLocalStorage<Student[]>('students', []);
    const [simulados, setSimulados] = useLocalStorage<Simulado[]>('simulados', []);
    const [corrections, setCorrections] = useLocalStorage<CorrectionResult[]>('corrections', []);
    const [correcoesRedacao, setCorrecoesRedacao] = useLocalStorage<CorrecaoRedacao[]>('correcoesRedacao', []);
    const [redacoes, setRedacoes] = useLocalStorage<Redacao[]>('redacoes', []);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };
    
    const handleLogin = () => {
        setIsLoggedIn(true);
        setActivePage('dashboard'); // Reset to dashboard on login
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
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
            {isLoggedIn ? (
                <AdminLayout
                    activePage={activePage}
                    setActivePage={setActivePage}
                    onLogout={handleLogout}
                >
                    {renderPage()}
                </AdminLayout>
            ) : (
                <LoginPage onLogin={handleLogin} />
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}

export default App;