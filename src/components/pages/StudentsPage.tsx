import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Student } from '../../types';
import { UsersIcon, PlusCircleIcon, Trash2Icon, EditIcon } from '../Icons';

interface StudentsPageProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  showToast: (message: string, type: 'success' | 'error') => void;
  setActivePage: (page: string | { page: string; [key: string]: any }) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ students, setStudents, showToast, setActivePage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const openModalForNew = () => {
    setEditingStudent(null);
    setStudentName('');
    setIsModalOpen(true);
  };

  const openModalForEdit = (student: Student) => {
    setEditingStudent(student);
    setStudentName(student.name);
    setIsModalOpen(true);
  };
  
  const handleSave = () => {
    if (!studentName.trim()) {
      showToast('O nome do aluno não pode estar em branco.', 'error');
      return;
    }

    if (editingStudent) {
      // Editing existing student
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, name: studentName.trim() } : s));
      showToast('Aluno atualizado com sucesso!', 'success');
    } else {
      // Adding new student
      const newStudent: Student = {
        id: new Date().toISOString(),
        name: studentName.trim(),
      };
      setStudents([...students, newStudent]);
      showToast('Aluno adicionado com sucesso!', 'success');
    }

    setIsModalOpen(false);
    setStudentName('');
    setEditingStudent(null);
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
        setStudents(students.filter(s => s.id !== studentId));
        showToast('Aluno excluído com sucesso!', 'success');
    }
  };
  
  const viewStudentReport = (studentId: string) => {
    setActivePage({ page: 'reports', studentId: studentId });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Gerenciar Alunos</h1>
        <button
          onClick={openModalForNew}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Adicionar Aluno
        </button>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: {student.id}</p>
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
