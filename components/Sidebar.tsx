import React from 'react';
import { HomeIcon, UsersIcon, FileTextIcon, UploadCloudIcon, EditIcon, LogOutIcon, BookOpenIcon } from './Icons';

interface SidebarProps {
    activePage: string | { page: string; [key: string]: any };
    setActivePage: (page: string | { page: string; [key: string]: any }) => void;
    onLogout: () => void;
}

const NavItem: React.FC<{
    icon: React.ElementType;
    label: string;
    pageName: string;
    activePage: string | { page: string; [key: string]: any };
    onClick: () => void;
}> = ({ icon: Icon, label, pageName, activePage, onClick }) => {
    const isActive = (typeof activePage === 'string' && activePage === pageName) || (typeof activePage === 'object' && activePage.page === pageName);
    return (
        <li
            onClick={onClick}
            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
                isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            <Icon className="w-6 h-6" />
            <span className="ml-4 font-medium">{label}</span>
        </li>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
    return (
        <div className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Plataforma</h1>
            </div>
            <nav className="flex-1 px-4">
                <ul>
                    <NavItem icon={HomeIcon} label="Dashboard" pageName="dashboard" activePage={activePage} onClick={() => setActivePage('dashboard')} />
                    <NavItem icon={UsersIcon} label="Gerenciar Alunos" pageName="students" activePage={activePage} onClick={() => setActivePage('students')} />
                    <NavItem icon={FileTextIcon} label="Gerenciar Simulados" pageName="simulados" activePage={activePage} onClick={() => setActivePage('simulados')} />
                    <NavItem icon={BookOpenIcon} label="Temas de Redação" pageName="temasRedacao" activePage={activePage} onClick={() => setActivePage('temasRedacao')} />
                    <NavItem icon={UploadCloudIcon} label="Upload de Respostas" pageName="upload" activePage={activePage} onClick={() => setActivePage('upload')} />
                    <NavItem icon={EditIcon} label="Corrigir Redação" pageName="corrigirRedacao" activePage={activePage} onClick={() => setActivePage('corrigirRedacao')} />
                </ul>
            </nav>
            <div className="p-4">
                <button
                    onClick={onLogout}
                    className="flex items-center justify-center w-full p-3 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors"
                >
                    <LogOutIcon className="w-6 h-6" />
                    <span className="ml-4 font-medium">Sair</span>
                </button>
            </div>
        </div>
    );
};