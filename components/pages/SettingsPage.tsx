
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { DEFAULT_AI_PROMPT } from '../../constants';

interface SettingsPageProps {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ aiPrompt, setAiPrompt, showToast }) => {
  const [prompt, setPrompt] = useState(aiPrompt);

  const handleSave = () => {
    setAiPrompt(prompt);
    showToast('Prompt da IA salvo com sucesso!', 'success');
  };

  const handleReset = () => {
    setPrompt(DEFAULT_AI_PROMPT);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Configurar IA</h1>
      
      <Card>
        <h2 className="text-xl font-bold mb-2">Prompt do Sistema para a IA</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Este é o texto de instrução que a IA recebe para realizar a correção. Você pode customizá-lo para se adequar melhor às suas necessidades.
          Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded-sm">{'{{ANSWER_KEY}}'}</code> onde o gabarito do simulado deve ser inserido.
        </p>

        <textarea
          rows={15}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
        />

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Resetar para Padrão
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Salvar Alterações
          </button>
        </div>
      </Card>
    </div>
  );
};
