
import React from 'react';
import { HomeIcon, UsersIcon, FileTextIcon, UploadCloudIcon, EditIcon, LogOutIcon, BarChartIcon } from './Icons';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string | { page: string; [key: string]: any };
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { id: 'students', label: 'Alunos', icon: UsersIcon },
  { id: 'simulados', label: 'Provas Objetivas', icon: FileTextIcon },
  { id: 'temasRedacao', label: 'Temas de Redação', icon: FileTextIcon },
  { id: 'corrigirProvaObjetiva', label: 'Corrigir Prova Objetiva', icon: UploadCloudIcon },
  { id: 'corrigirRedacao', label: 'Corrigir Redação', icon: EditIcon },
  { id: 'reports', label: 'Relatórios', icon: BarChartIcon },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePage, setActivePage, onLogout }) => {
  const currentPage = typeof activePage === 'string' ? activePage : activePage.page;
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Simulados</h1>
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
