import React from 'react';
import { Card } from '../../common/Card';
import { Redacao } from '../../../types';
import { FileTextIcon } from '../../Icons';

interface StudentEssayTopicsPageProps {
  redacoes: Redacao[];
}

export const StudentEssayTopicsPage: React.FC<StudentEssayTopicsPageProps> = ({ redacoes }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Temas de Redação</h1>
      
      {redacoes.length > 0 ? (
        <div className="space-y-6">
          {redacoes.map(redacao => (
            <Card key={redacao.id}>
              <div className="flex items-start">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mr-4">
                      <FileTextIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                  </div>
                  <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{redacao.title}</h2>
                      <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{redacao.prompt}</p>
                      <p className="text-xs text-gray-400 mt-4">* Em uma aplicação real, aqui poderia haver um link para baixar textos de apoio em PDF.</p>
                  </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Nenhum tema de redação foi cadastrado pelo administrador ainda.</p>
            </div>
        </Card>
      )}
    </div>
  );
};
