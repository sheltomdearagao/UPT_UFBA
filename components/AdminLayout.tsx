import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { supabase } from '../src/integrations/supabase/client';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: string | { page: string; [key: string]: any };
    setActivePage: (page: string | { page: string; [key: string]: any }) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePage, setActivePage }) => {
    
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};