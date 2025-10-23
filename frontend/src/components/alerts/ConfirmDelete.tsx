import React from 'react';

interface ConfirmDeleteProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ 
  open, 
  onCancel, 
  onConfirm, 
  message 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Confirmar Exclusão
        </h3>
        <p className="text-gray-700 mb-6">
          {message || 'Deseja realmente excluir este item? Esta ação não pode ser desfeita.'}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;