import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { MainApp } from './components/MainApp';
import { Spinner } from './components/common/Spinner';

const App = () => {
    const { session, loading } = useAuth();

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