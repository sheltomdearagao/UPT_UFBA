import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Simulado, AnswerKeyItem, AreaConhecimento } from '../../types';
import { FileTextIcon, PlusCircleIcon, Trash2Icon, EditIcon } from '../Icons';
import { AREAS_CONHECIMENTO } from '../../constants';

interface SimuladosPageProps {
  simulados: Simulado[];
  setSimulados: React.Dispatch<React.SetStateAction<Simulado[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
}

const AnswerKeyEditor: React.FC<{ answerKey: AnswerKeyItem[]; setAnswerKey: React.Dispatch<React.SetStateAction<AnswerKeyItem[]>> }> = ({ answerKey, setAnswerKey }) => {

  const addQuestion = () => {
    const newQuestion: AnswerKeyItem = {
      question: answerKey.length + 1,
      answer: '',
      area: 'Geral',
    };
    setAnswerKey([...answerKey, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof AnswerKeyItem, value: string | number) => {
    const newKey = [...answerKey];
    (newKey[index] as any)[field] = value;
    setAnswerKey(newKey);
  };
  
  const removeQuestion = (index: number) => {
    const newKey = answerKey.filter((_, i) => i !== index).map((item, i) => ({ ...item, question: i + 1 }));
    setAnswerKey(newKey);
  };

  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gabarito Detalhado
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 space-y-2 max-h-64 overflow-y-auto">
            {answerKey.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <span className="col-span-2 font-mono text-sm">Q {item.question}</span>
                    <div className="col-span-4">
                         <input
                            type="text"
                            value={item.answer}
                            onChange={(e) => updateQuestion(index, 'answer', e.target.value.toUpperCase())}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-500"
                            placeholder="A, B..."
                            maxLength={1}
                        />
                    </div>
                    <div className="col-span-5">
                        <select 
                            value={item.area}
                            onChange={(e) => updateQuestion(index, 'area', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-500"
                        >
                            {AREAS_CONHECIMENTO.map(area => <option key={area} value={area}>{area}</option>)}
                        </select>
                    </div>
                    <div className="col-span-1">
                        <button onClick={() => removeQuestion(index)} className="p-1 text-red-500 hover:text-red-700">
                            <Trash2Icon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <button
          type="button"
          onClick={addQuestion}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          + Adicionar Questão
        </button>
    </div>
  );
};

export const SimuladosPage: React.FC<SimuladosPageProps> = ({ simulados, setSimulados, showToast, setActivePage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simuladoName, setSimuladoName] = useState('');
  const [answerKey, setAnswerKey] = useState<AnswerKeyItem[]>([]);
  const [editingSimulado, setEditingSimulado] = useState<Simulado | null>(null);

  const openModalForNew = () => {
    setEditingSimulado(null);
    setSimuladoName('');
    setAnswerKey([]);
    setIsModalOpen(true);
  };
  
  const openModalForEdit = (simulado: Simulado) => {
    setEditingSimulado(simulado);
    setSimuladoName(simulado.name);
    setAnswerKey(simulado.answerKey);
    setIsModalOpen(true);
  };
  
  const handleSave = () => {
    if (!simuladoName.trim() || answerKey.length === 0 || answerKey.some(q => !q.answer.trim())) {
      showToast('O nome e o gabarito completo da prova objetiva são obrigatórios.', 'error');
      return;
    }

    if (editingSimulado) {
      setSimulados(simulados.map(s => s.id === editingSimulado.id ? { ...s, name: simuladoName.trim(), answerKey } : s));
      showToast('Prova objetiva atualizada com sucesso!', 'success');
    } else {
      const newSimulado: Simulado = {
        id: new Date().toISOString(),
        name: simuladoName.trim(),
        answerKey,
      };
      setSimulados([...simulados, newSimulado]);
      showToast('Prova objetiva adicionada com sucesso!', 'success');
    }

    setIsModalOpen(false);
  };
  
  const handleDelete = (simuladoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta prova objetiva?')) {
        setSimulados(simulados.filter(s => s.id !== simuladoId));
        showToast('Prova objetiva excluída com sucesso!', 'success');
    }
  };

  const viewSimuladoReport = (simuladoId: string) => {
    setActivePage({ page: 'reports', simuladoId });
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gerenciar Provas Objetivas</h1>
        <button
          onClick={openModalForNew}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Adicionar Prova Objetiva
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Questões: {simulado.answerKey.length}</p>
                    </div>
                </div>
                <div className="space-x-2">
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
            <p>Nenhuma prova objetiva cadastrada.</p>
            <p className="text-sm">Clique em "Adicionar Prova Objetiva" para criar a primeira.</p>
          </div>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSimulado ? "Editar Prova Objetiva" : "Adicionar Nova Prova Objetiva"}>
        <div className="space-y-4">
          <div>
            <label htmlFor="simuladoName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome da Prova Objetiva
            </label>
            <input
              type="text"
              id="simuladoName"
              value={simuladoName}
              onChange={(e) => setSimuladoName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ex: Prova Objetiva ENEM 2024 - 1º Dia"
            />
          </div>
          <AnswerKeyEditor answerKey={answerKey} setAnswerKey={setAnswerKey} />
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