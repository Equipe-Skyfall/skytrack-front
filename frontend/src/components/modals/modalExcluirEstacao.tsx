import React from 'react';

interface ModalExcluirEstacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string | React.ReactNode;
}

const ModalExcluirEstacao: React.FC<ModalExcluirEstacaoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Exclusão",
  message = "Deseja realmente excluir esta estação? Esta ação não pode ser desfeita.",
}) => {
  
  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={handleContentClick}
      >
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>

        <h2 className="text-xl text-center font-bold mb-3 text-gray-900">{title}</h2>
        
        <div className="text-gray-600 text-center mb-6">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExcluirEstacao;