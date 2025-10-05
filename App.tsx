import React, { useState, useEffect } from 'react';
import { supabase } from './src/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { LoginPage } from './components/LoginPage';
import { MainApp } from './components/MainApp';
import { Spinner } from './components/common/Spinner';
import { StudentLayout } from './components/StudentLayout';
import { StudentDashboardPage } from './components/pages/StudentDashboardPage';
import { useLocalStorage } from './src/hooks/useLocalStorage';
import { initialStudents } from './src/data/initialStudents';
import { Simulado, CorrectionResult, CorrecaoRedacao } from './types';

const App = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<{role: string, full_name: string} | null>(null);
    const [loading, setLoading] = useState(true);

    // We still use local storage for the main app data
    const [students, setStudents] = useLocalStorage('students', initialStudents);
    const [simulados, setSimulados] = useLocalStorage<Simulado[]>('simulados', []);
    const [corrections, setCorrections] = useLocalStorage<CorrectionResult[]>('corrections', []);
    const [correcoesRedacao, setCorrecoesRedacao] = useLocalStorage<CorrecaoRedacao[]>('correcoesRedacao', []);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                setProfile(null);
            }
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
                    setLoading(false);
                } else if (data) {
                    setProfile(data);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [session]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    }

    if (!session) {
        return <LoginPage />;
    }

    if (profile?.role === 'admin') {
        return <MainApp />;
    }

    if (profile?.role === 'student') {
        // Find the student in our local data that corresponds to the logged-in user
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
                    <div className="text-center">
                        <p>Seus dados de estudante ainda não foram sincronizados.</p>
                        <p>Por favor, peça a um administrador para sincronizar os alunos.</p>
                    </div>
                )}
            </StudentLayout>
        );
    }

    // This screen will show briefly while the profile is being fetched.
    return <div className="flex justify-center items-center h-screen"><p>Verificando permissões...</p></div>;
}

export default App;