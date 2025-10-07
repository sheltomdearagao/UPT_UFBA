
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Simulado } from '../../types';
import { FileTextIcon, PlusCircleIcon, Trash2Icon, EditIcon } from '../Icons';

interface SimuladosPageProps {
  simulados: Simulado[];
  setSimulados: React.Dispatch<React.SetStateAction<Simulado[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
}

export const SimuladosPage: React.FC<SimuladosPageProps> = ({ simulados, setSimulados, showToast, setActivePage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simuladoName, setSimuladoName] = useState('');
  const [editingSimulado, setEditingSimulado] = useState<Simulado | null>(null);

  const openModalForNew = () => {
    setEditingSimulado(null);
    setSimuladoName('');
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (simulado: Simulado) => {
    setEditingSimulado(simulado);
    setSimuladoName(simulado.name);
    setIsModalOpen(true);
  };
  
  const handleSave = () => {
    if (!simuladoName.trim()) {
      showToast('O nome da prova é obrigatório.', 'error');
      return;
    }

    if (editingSimulado) {
      setSimulados(simulados.map(s => s.id === editingSimulado.id ? { ...s, name: simuladoName.trim() } : s));
      showToast('Prova atualizada com sucesso!', 'success');
    } else {
      const newSimulado: Simulado = {
        id: new Date().toISOString(),
        name: simuladoName.trim(),
      };
      setSimulados([...simulados, newSimulado]);
      showToast('Prova adicionada com sucesso!', 'success');
    }

    setIsModalOpen(false);
  };
  
  const handleDelete = (simuladoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta prova? Todas as notas associadas serão perdidas.')) {
        setSimulados(simulados.filter(s => s.id !== simuladoId));
        // Note: In a real app, you'd also want to delete associated corrections.
        showToast('Prova excluída com sucesso!', 'success');
    }
  };

  const viewSimuladoReport = (simuladoId: string) => {
    setActivePage({ page: 'reports', simuladoId });
  };
  
  const launchScoresPage = (simuladoId: string) => {
    setActivePage({ page: 'enterScores', simuladoId: simuladoId });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gerenciar Provas</h1>
        <button
          onClick={openModalForNew}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Adicionar Prova
        </button>
      </div>

      <Card>
        {simulados.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {simulados.map(simulado => (
              <li key={simulado.id} className="py-4 flex justify-between items-center">
                 <div className="flex items-center">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-4">
                        <FileTextIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </div>
                    <div>
                        <a href="#" onClick={(e) => { e.preventDefault(); viewSimuladoReport(simulado.id); }} className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">{simulado.name}</a>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: {simulado.id}</p>
                    </div>
                </div>
                <div className="space-x-2 flex items-center">
                    <button onClick={() => launchScoresPage(simulado.id)} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg transition duration-200 text-sm">
                        <EditIcon className="w-4 h-4 mr-1" />
                        Lançar Notas
                    </button>
                    <button onClick={() => openModalForEdit(simulado)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full" aria-label="Edit simulado">
                        <EditIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(simulado.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full" aria-label="Delete simulado">
                        <Trash2Icon className="w-5 h-5 text-red-500" />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Nenhuma prova cadastrada.</p>
            <p className="text-sm">Clique em "Adicionar Prova" para criar a primeira.</p>
          </div>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSimulado ? "Editar Prova" : "Adicionar Nova Prova"}>
        <div className="space-y-4">
          <div>
            <label htmlFor="simuladoName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome da Prova
            </label>
            <input
              type="text"
              id="simuladoName"
              value={simuladoName}
              onChange={(e) => setSimuladoName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ex: Prova ENEM 2024 - 1º Dia"
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
