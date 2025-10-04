import React, { useState, useEffect } from 'react';
import { supabase } from './src/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { LoginPage } from './components/LoginPage';
import { Spinner } from './components/common/Spinner';
import { MainApp } from './components/MainApp';

const App = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    }

    return (
        <>
            {!session ? <LoginPage /> : <MainApp />}
        </>
    );
}

export default App;