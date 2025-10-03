import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Student } from '../../types';
import { UsersIcon, PlusCircleIcon, Trash2Icon, EditIcon } from '../Icons';
import { supabase } from '../../integrations/supabase/client';
import { Spinner } from '../common/Spinner';

interface StudentsPageProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ students, setStudents, showToast, setActivePage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentCpf, setStudentCpf] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const openModalForNew = () => {
    setEditingStudent(null);
    setStudentName('');
    setStudentCpf('');
    setIsModalOpen(true);
  };

  const openModalForEdit = (student: Student) => {
    setEditingStudent(student);
    setStudentName(student.name);
    setStudentCpf(student.cpf);
    setIsModalOpen(true);
  };
  
  const handleSave = async () => {
    if (!studentName.trim() || !studentCpf.trim()) {
      showToast('O nome e o CPF do aluno são obrigatórios.', 'error');
      return;
    }

    const cpf = studentCpf.trim();

    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, name: studentName.trim(), cpf, login: cpf, id: cpf } : s));
      showToast('Aluno atualizado com sucesso!', 'success');
    } else {
      const email = `${cpf}@platform.com`;
      const password = cpf;

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        showToast(`Erro ao criar usuário: ${error.message}`, 'error');
        return;
      }

      if (data.user) {
        const newStudent: Student = {
          id: cpf,
          authId: data.user.id,
          name: studentName.trim(),
          cpf: cpf,
          login: cpf,
          password: password,
          simulados: [],
        };
        setStudents([...students, newStudent]);
        showToast('Aluno e usuário Supabase adicionados com sucesso!', 'success');
      } else {
        showToast('Ocorreu um erro desconhecido ao criar o usuário.', 'error');
      }
    }

    setIsModalOpen(false);
    setStudentName('');
    setStudentCpf('');
    setEditingStudent(null);
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
        // Note: This does not delete the user from Supabase Auth.
        // That would require admin privileges and is best handled in a backend.
        setStudents(students.filter(s => s.id !== studentId));
        showToast('Aluno excluído da lista local!', 'success');
    }
  };
  
  const viewStudentReport = (studentId: string) => {
    setActivePage({ page: 'reports', studentId: studentId });
  };

  const syncStudentsWithSupabase = async () => {
    setIsSyncing(true);
    showToast('Iniciando sincronização com Supabase...', 'success');
    let successCount = 0;
    let errorCount = 0;
    const updatedStudents = [...students];

    for (let i = 0; i < updatedStudents.length; i++) {
        const student = updatedStudents[i];
        if (student.authId) continue;

        const { data, error } = await supabase.auth.signUp({
            email: `${student.cpf}@platform.com`,
            password: student.cpf,
        });

        if (error) {
            console.error(`Erro para ${student.name}: ${error.message}`);
            errorCount++;
        } else if (data.user) {
            updatedStudents[i] = { ...student, authId: data.user.id };
            successCount++;
        }
    }

    setStudents(updatedStudents);
    showToast(`Sincronização concluída: ${successCount} sucesso(s), ${errorCount} erro(s).`, errorCount > 0 ? 'error' : 'success');
    setIsSyncing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gerenciar Alunos</h1>
        <div className="flex items-center space-x-2">
            <button
              onClick={syncStudentsWithSupabase}
              disabled={isSyncing}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-green-300"
            >
              {isSyncing ? <><Spinner size="sm" /> <span className="ml-2">Sincronizando...</span></> : 'Sincronizar com Supabase'}
            </button>
            <button
              onClick={openModalForNew}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Adicionar Aluno
            </button>
        </div>
      </div>

      <Card>
        {students.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {students.map(student => (
              <li key={student.id} className="py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mr-4">
                        <UsersIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </div>
                    <div>
                        <a href="#" onClick={(e) => { e.preventDefault(); viewStudentReport(student.id); }} className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">{student.name}</a>
                        <p className="text-sm text-gray-500 dark:text-gray-400">CPF: {student.cpf}</p>
                        {student.authId && <span className="text-xs bg-green-100 text-green-800 font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Synced</span>}
                    </div>
                </div>
                <div className="space-x-2">
                    <button onClick={() => openModalForEdit(student)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full" aria-label="Edit student">
                        <EditIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(student.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full" aria-label="Delete student">
                        <Trash2Icon className="w-5 h-5 text-red-500" />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Nenhum aluno cadastrado.</p>
            <p className="text-sm">Clique em "Adicionar Aluno" para começar.</p>
          </div>
        )}
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? "Editar Aluno" : "Adicionar Novo Aluno"}>
        <div className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Aluno
            </label>
            <input
              type="text"
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ex: João da Silva"
            />
          </div>
           <div>
            <label htmlFor="studentCpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CPF do Aluno
            </label>
            <input
              type="text"
              id="studentCpf"
              value={studentCpf}
              onChange={(e) => setStudentCpf(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Apenas números"
              disabled={!!editingStudent}
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