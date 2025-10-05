import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Redacao } from '../../types';
import { FileTextIcon, PlusCircleIcon, Trash2Icon, EditIcon } from '../Icons';

interface RedacoesPageProps {
  redacoes: Redacao[];
  setRedacoes: React.Dispatch<React.SetStateAction<Redacao[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const RedacoesPage: React.FC<RedacoesPageProps> = ({ redacoes, setRedacoes, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [editingRedacao, setEditingRedacao] = useState<Redacao | null>(null);

  const openModalForNew = () => {
    setEditingRedacao(null);
    setTitle('');
    setPrompt('');
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (redacao: Redacao) => {
    setEditingRedacao(redacao);
    setTitle(redacao.title);
    setPrompt(redacao.prompt);
    setIsModalOpen(true);
  };
  
  const handleSave = () => {
    if (!title.trim() || !prompt.trim()) {
      showToast('O título e o texto do tema são obrigatórios.', 'error');
      return;
    }

    if (editingRedacao) {
      setRedacoes(redacoes.map(r => r.id === editingRedacao.id ? { ...r, title: title.trim(), prompt: prompt.trim() } : r));
      showToast('Tema atualizado com sucesso!', 'success');
    } else {
      const newRedacao: Redacao = {
        id: new Date().toISOString(),
        title: title.trim(),
        prompt: prompt.trim(),
      };
      setRedacoes([...redacoes, newRedacao]);
      showToast('Tema adicionado com sucesso!', 'success');
    }

    setIsModalOpen(false);
    setTitle('');
    setPrompt('');
    setEditingRedacao(null);
  };
  
  const handleDelete = (redacaoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tema de redação?')) {
        setRedacoes(redacoes.filter(r => r.id !== redacaoId));
        showToast('Tema excluído com sucesso!', 'success');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gerenciar Temas de Redação</h1>
        <button
          onClick={openModalForNew}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Adicionar Tema
        </button>
      </div>

      <Card>
        {redacoes.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {redacoes.map(redacao => (
              <li key={redacao.id} className="py-4 flex justify-between items-center">
                 <div className="flex items-center">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-4">
                        <FileTextIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{redacao.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-lg">{redacao.prompt}</p>
                    </div>
                </div>
                <div className="space-x-2">
                    <button onClick={() => openModalForEdit(redacao)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full" aria-label="Edit redacao">
                        <EditIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(redacao.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full" aria-label="Delete redacao">
                        <Trash2Icon className="w-5 h-5 text-red-500" />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Nenhum tema de redação cadastrado.</p>
            <p className="text-sm">Clique em "Adicionar Tema" para criar o primeiro.</p>
          </div>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRedacao ? "Editar Tema" : "Adicionar Novo Tema"}>
        <div className="space-y-4">
          <div>
            <label htmlFor="redacaoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título do Tema
            </label>
            <input
              type="text"
              id="redacaoTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ex: A persistência da violência contra a mulher"
            />
          </div>
          <div>
             <label htmlFor="redacaoPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Texto do Tema / Coletânea
            </label>
            <textarea
              id="redacaoPrompt"
              rows={8}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Insira aqui o texto de apoio, dados e a proposta da redação."
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Salvar
          </button>
        </div>
      </Modal>
    </div>
  );
};