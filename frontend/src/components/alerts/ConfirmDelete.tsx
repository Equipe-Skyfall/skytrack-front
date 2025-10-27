import React from 'react';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
  confirmText?: string;
  confirmClass?: string;
};

const ConfirmDelete: React.FC<Props> = ({ 
  open, 
  onCancel, 
  onConfirm, 
  message,
  title = 'Confirmar exclusão',
  confirmText = 'Excluir',
  confirmClass = 'bg-red-600'
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-80">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-700 mb-4">{message || 'Deseja realmente excluir este item?'}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 rounded border">Cancelar</button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded ${confirmClass} text-white`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;