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

type ActivePage = string | { page: string; [key: string]: any };

const initialStudents: Student[] = [
  {
    "id": "086.xxx.xxx-xx",
    "name": "ALINE SANTOS DE JESUS",
    "cpf": "086.xxx.xxx-xx",
    "login": "086.xxx.xxx-xx",
    "password": "086.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "091.xxx.xxx-xx",
    "name": "JAMILE SANTOS DE JESUS",
    "cpf": "091.xxx.xxx-xx",
    "login": "091.xxx.xxx-xx",
    "password": "091.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "095.xxx.xxx-xx",
    "name": "MARIA EDUARDA SANTOS DE JESUS",
    "cpf": "095.xxx.xxx-xx",
    "login": "095.xxx.xxx-xx",
    "password": "095.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "096.xxx.xxx-xx",
    "name": "LUCAS GABRIEL DE JESUS",
    "cpf": "096.xxx.xxx-xx",
    "login": "096.xxx.xxx-xx",
    "password": "096.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "098.xxx.xxx-xx",
    "name": "VITORIA DIAS DOS SANTOS",
    "cpf": "098.xxx.xxx-xx",
    "login": "098.xxx.xxx-xx",
    "password": "098.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "100.xxx.xxx-xx",
    "name": "CAUAN NASCIMENTO DE JESUS",
    "cpf": "100.xxx.xxx-xx",
    "login": "100.xxx.xxx-xx",
    "password": "100.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "101.xxx.xxx-xx",
    "name": "TAINARA DOS SANTOS",
    "cpf": "101.xxx.xxx-xx",
    "login": "101.xxx.xxx-xx",
    "password": "101.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "102.xxx.xxx-xx",
    "name": "MARIA CLARA SANTOS DE JESUS",
    "cpf": "102.xxx.xxx-xx",
    "login": "102.xxx.xxx-xx",
    "password": "102.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "103.xxx.xxx-xx",
    "name": "CARLA EDUARDA SANTOS DE JESUS",
    "cpf": "103.xxx.xxx-xx",
    "login": "103.xxx.xxx-xx",
    "password": "103.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "104.xxx.xxx-xx",
    "name": "ANA JULIA SANTOS DE JESUS",
    "cpf": "104.xxx.xxx-xx",
    "login": "104.xxx.xxx-xx",
    "password": "104.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "105.xxx.xxx-xx",
    "name": "CARLOS DANIEL SANTOS DE JESUS",
    "cpf": "105.xxx.xxx-xx",
    "login": "105.xxx.xxx-xx",
    "password": "105.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "106.xxx.xxx-xx",
    "name": "ADRIELLE DOS SANTOS",
    "cpf": "106.xxx.xxx-xx",
    "login": "106.xxx.xxx-xx",
    "password": "106.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "107.xxx.xxx-xx",
    "name": "LUCIANO DIAS DOS SANTOS",
    "cpf": "107.xxx.xxx-xx",
    "login": "107.xxx.xxx-xx",
    "password": "107.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "108.xxx.xxx-xx",
    "name": "ANA BEATRIZ SANTOS DE JESUS",
    "cpf": "108.xxx.xxx-xx",
    "login": "108.xxx.xxx-xx",
    "password": "108.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "109.xxx.xxx-xx",
    "name": "MARIA VITÓRIA SANTOS DE JESUS",
    "cpf": "109.xxx.xxx-xx",
    "login": "109.xxx.xxx-xx",
    "password": "109.xxx.xxx-xx",
    "simulados": []
  },
  {
    "id": "110.xxx.xxx-xx",
    "name": "JOSIANE SANTOS DE JESUS",
    "cpf": "110.xxx.xxx-xx",
    "login": "110.xxx.xxx-xx",
    "password": "110.xxx.xxx-xx",
    "simulados": []
  }
];

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

    const handleLogout = () => {
        console.log('Logging out...');
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
                onLogout={handleLogout}
            >
                {renderPage()}
            </AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}

export default App;