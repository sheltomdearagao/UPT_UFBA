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
import { Spinner } from './components/common/Spinner';

type ActivePage = string | { page: string; [key: string]: any };

const initialStudents: Student[] = [
    { id: "10230655505", name: "Ádine Silva Araújo", cpf: "10230655505", login: "10230655505", password: "10230655505", simulados: [] },
    { id: "86720059530", name: "Alana", cpf: "86720059530", login: "86720059530", password: "86720059530", simulados: [] },
    { id: "10084799501", name: "Alice Conceição dos Anjos", cpf: "10084799501", login: "10084799501", password: "10084799501", simulados: [] },
    { id: "09417662503", name: "Ana Beatriz Nascimento Santos", cpf: "09417662503", login: "09417662503", password: "09417662503", simulados: [] },
    { id: "85904925590", name: "Ana Luísa de Souza Araújo", cpf: "85904925590", login: "85904925590", password: "85904925590", simulados: [] },
    { id: "01106787536", name: "Bianca Lorena Paixão dos Santos", cpf: "01106787536", login: "01106787536", password: "01106787536", simulados: [] },
    { id: "01024140529", name: "Bruna Dos Santos Bittencourt", cpf: "01024140529", login: "01024140529", password: "01024140529", simulados: [] },
    { id: "86669665562", name: "Caio Conceição de Jesus Santos", cpf: "86669665562", login: "86669665562", password: "86669665562", simulados: [] },
    { id: "11130255573", name: "Camila Oliveira Santos", cpf: "11130255573", login: "11130255573", password: "11130255573", simulados: [] },
    { id: "78946794534", name: "Catiane da Silva Reis", cpf: "78946794534", login: "78946794534", password: "78946794534", simulados: [] },
    { id: "07930019519", name: "Clara Cordeiro Rocha", cpf: "07930019519", login: "07930019519", password: "07930019519", simulados: [] },
    { id: "06792523550", name: "Danilo dos santos vargas", cpf: "06792523550", login: "06792523550", password: "06792523550", simulados: [] },
    { id: "04884710505", name: "Diego Armando Ferrer Espada", cpf: "04884710505", login: "04884710505", password: "04884710505", simulados: [] },
    { id: "85791193575", name: "Icaro Miranda", cpf: "85791193575", login: "85791193575", password: "85791193575", simulados: [] },
    { id: "06703446563", name: "Isabela Santos guerra", cpf: "06703446563", login: "06703446563", password: "06703446563", simulados: [] },
    { id: "007115765561", name: "Elton lopes de Santana", cpf: "007115765561", login: "007115765561", password: "007115765561", simulados: [] },
    { id: "95582754504", name: "Fabiana Lima Borges", cpf: "95582754504", login: "95582754504", password: "95582754504", simulados: [] },
    { id: "86529620575", name: "Gabriel Amaral Fernandes", cpf: "86529620575", login: "86529620575", password: "86529620575", simulados: [] },
    { id: "02523377519", name: "Guilherme de Souza Cruz Santos", cpf: "02523377519", login: "02523377519", password: "02523377519", simulados: [] },
    { id: "00673446565", name: "Isabela Santos Guerra", cpf: "00673446565", login: "00673446565", password: "00673446565", simulados: [] },
    { id: "09270878554", name: "Jader Murilo de Jesus dos Santos", cpf: "09270878554", login: "09270878554", password: "09270878554", simulados: [] },
    { id: "06438816540", name: "Jailton dos Santos de Oliveira", cpf: "06438816540", login: "06438816540", password: "06438816540", simulados: [] },
    { id: "86380792570", name: "Jamile Brandão Lopes Ramos", cpf: "86380792570", login: "86380792570", password: "86380792570", simulados: [] },
    { id: "05609639557", name: "Jean Douglas Guerreiro Lisboa", cpf: "05609639557", login: "05609639557", password: "05609639557", simulados: [] },
    { id: "86671445508", name: "Jian Victor da Silva Conceição", cpf: "86671445508", login: "86671445508", password: "86671445508", simulados: [] },
    { id: "07089101576", name: "João Marcelo Soto da cruz", cpf: "07089101576", login: "07089101576", password: "07089101576", simulados: [] },
    { id: "06429587509", name: "Joseane santos dos santos", cpf: "06429587509", login: "06429587509", password: "06429587509", simulados: [] },
    { id: "00977180506", name: "Josinete de Jesus Santos", cpf: "00977180506", login: "00977180506", password: "00977180506", simulados: [] },
    { id: "10668797533", name: "Letícia Andrade conceição", cpf: "10668797533", login: "10668797533", password: "10668797533", simulados: [] },
    { id: "10885167503", name: "Luana Estrela Mota", cpf: "10885167503", login: "10885167503", password: "10885167503", simulados: [] },
    { id: "10474081559", name: "Luise Santos do Nascimento", cpf: "10474081559", login: "10474081559", password: "10474081559", simulados: [] },
    { id: "05648956525", name: "Luiz Fellipe Silva Abade Pereira", cpf: "05648956525", login: "05648956525", password: "05648956525", simulados: [] },
    { id: "09508717530", name: "Luiz Henrique Alves da Cunha", cpf: "09508717530", login: "09508717530", password: "09508717530", simulados: [] },
    { id: "02978141506", name: "Márcia Rejane Jesus Nêgris Silva", cpf: "02978141506", login: "02978141506", password: "02978141506", simulados: [] },
    { id: "11406527465", name: "Maria Clara Batista Justiniano", cpf: "11406527465", login: "11406527465", password: "11406527465", simulados: [] },
    { id: "04817862521", name: "Maria Clara Medrado do Nascimento", cpf: "04817862521", login: "04817862521", password: "04817862521", simulados: [] },
    { id: "86654569539", name: "Maria Eduarda Ribeiro De Oliveira", cpf: "86654569539", login: "86654569539", password: "86654569539", simulados: [] },
    { id: "86501936500", name: "Maria Isabel Barreto de Oliveira Santos", cpf: "86501936500", login: "86501936500", password: "86501936500", simulados: [] },
    { id: "09269821501", name: "Mariana Santos da Silva", cpf: "09269821501", login: "09269821501", password: "09269821501", simulados: [] },
    { id: "05462316593", name: "Mateus Santos Vieira", cpf: "05462316593", login: "05462316593", password: "05462316593", simulados: [] },
    { id: "09758887535", name: "Rafaela Oliveira", cpf: "09758887535", login: "09758887535", password: "09758887535", simulados: [] },
    { id: "86893906501", name: "Samanta Gomes Nascimento", cpf: "86893906501", login: "86893906501", password: "86893906501", simulados: [] },
    { id: "86893918518", name: "Samylla Gomes Nascimento", cpf: "86893918518", login: "86893918518", password: "86893918518", simulados: [] },
    { id: "55015034504", name: "Semirames Lima Medrado do Nascimento", cpf: "55015034504", login: "55015034504", password: "55015034504", simulados: [] },
    { id: "01518310508", name: "Simone Nascimento Santos", cpf: "01518310508", login: "01518310508", password: "01518310508", simulados: [] },
    { id: "86917479519", name: "Soane Lima de Oliveira", cpf: "86917479519", login: "86917479519", password: "86917479519", simulados: [] },
    { id: "10288095570", name: "Sophia Soares Leite Anunciação", cpf: "10288095570", login: "10288095570", password: "10288095570", simulados: [] },
    { id: "11652139583", name: "Suelen Mendes Ribeiro", cpf: "11652139583", login: "11652139583", password: "11652139583", simulados: [] },
    { id: "49764110525", name: "Valdice", cpf: "49764110525", login: "49764110525", password: "49764110525", simulados: [] },
    { id: "04785374500", name: "Veridiane de Jesus Santos", cpf: "04785374500", login: "04785374500", password: "04785374500", simulados: [] },
    { id: "09426991573", name: "Wesley de Jesus Gonçalves", cpf: "09426991573", login: "09426991573", password: "09426991573", simulados: [] }
];

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
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState<ActivePage>('dashboard');
    const [students, setStudents] = useLocalStorage<Student[]>('students', initialStudents);
    const [simulados, setSimulados] = useLocalStorage<Simulado[]>('simulados', []);
    const [corrections, setCorrections] = useLocalStorage<CorrectionResult[]>('corrections', []);
    const [correcoesRedacao, setCorrecoesRedacao] = useLocalStorage<CorrecaoRedacao[]>('correcoesRedacao', []);
    const [redacoes, setRedacoes] = useLocalStorage<Redacao[]>('redacoes', []);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

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

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    }

    return (
        <>
            {!session ? (
                <LoginPage />
            ) : (
                <AdminLayout
                    activePage={activePage}
                    setActivePage={setActivePage}
                >
                    {renderPage()}
                </AdminLayout>
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}

export default App;