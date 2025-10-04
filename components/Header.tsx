import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
            <div className="flex items-center justify-between">
                {/* Header content can go here, e.g., search bar or user menu */}
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Painel Administrativo
                </div>
            </div>
        </header>
    );
};