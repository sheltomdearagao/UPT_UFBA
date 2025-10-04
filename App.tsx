import React, { useState, useEffect } from 'react';
import { supabase } from './src/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { LoginPage } from './components/LoginPage';
import { MainApp } from './components/MainApp';

const App = () => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // Immediately set the session from the initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for future changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            {!session ? <LoginPage /> : <MainApp />}
        </>
    );
}

export default App;