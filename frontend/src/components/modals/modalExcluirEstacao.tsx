import React from 'react';

interface ModalExcluirEstacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string | React.ReactNode;
  stationName?: string;
}

const ModalExcluirEstacao: React.FC<ModalExcluirEstacaoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  stationName,
}) => {
  
  const displayTitle = title || 'Confirmar Exclusão';
  const displayMessage = message || (stationName ? `Tem certeza que deseja excluir a estação "${stationName}"?` : 'Tem certeza que deseja excluir esta estação?');
  
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className={`
        fixed inset-0 flex justify-center items-center z-50
        transition-all duration-300 ease-in-out
        ${isOpen ? "backdrop-blur-sm" : "bg-opacity-0 pointer-events-none"}
      `}
      onClick={onClose} 
    >
      <div
        className={`
          bg-white p-6 rounded-lg shadow-xl w-full max-w-md
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
        onClick={handleContentClick}
      >
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>

        <h2 className="text-xl text-center font-bold mb-3">{displayTitle}</h2>
        
        <p className="text-gray-600 text-center mb-6">{displayMessage}</p>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExcluirEstacao;