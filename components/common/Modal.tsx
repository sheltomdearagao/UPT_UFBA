
import React from 'react';
import { Card } from './Card';
import { XIcon } from '../Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <Card className="p-0">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Close modal">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};