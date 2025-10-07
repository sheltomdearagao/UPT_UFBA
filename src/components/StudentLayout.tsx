import React from 'react';
import { HomeIcon, FileTextIcon, EditIcon, LogOutIcon } from './Icons';

interface StudentLayoutProps {
  children: React.ReactNode;
  user: { name?: string };
  activePage: string | { page: string; [key: string]: any };
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Início', icon: HomeIcon },
  { id: 'results', label: 'Meus Resultados', icon: FileTextIcon },
  { id: 'myEssays', label: 'Minhas Redações', icon: EditIcon },
];

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children, user, activePage, setActivePage, onLogout }) => {
  const currentPage = typeof activePage === 'string' ? activePage : activePage.page;
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col items-center justify-center h-20 border-b dark:border-gray-700 px-4">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Portal do Aluno</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.name}</p>
        </div>
        <nav className="mt-6 flex-1">
          {navItems.map(item => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => { e.preventDefault(); setActivePage(item.id); }}
              className={`flex items-center px-6 py-3 text-base font-medium transition-colors duration-200 ${
                currentPage === item.id 
                ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 border-r-4 border-blue-500' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="ml-4">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64">
           <a
              href="#"
              onClick={(e) => { e.preventDefault(); onLogout(); }}
              className="flex items-center px-6 py-4 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOutIcon className="w-6 h-6" />
              <span className="ml-4">Sair</span>
            </a>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
