import React, { useState } from "react";
import { useTheme } from '../../contexts/ThemeContext';

interface StationFormData {
  name: string;
  address: string;
  macAddress: string;
  latitude: string;
  longitude: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" ;
}

interface ModalSimplesProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StationFormData) => void;
}

const initialState: StationFormData = {
  name: "",
  address: "",
  macAddress: "",
  latitude: "",
  longitude: "",
  description: "",
  status: "INACTIVE",
};

const ModalCadastroEstacao: React.FC<ModalSimplesProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<StationFormData>(initialState);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialState);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/30 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`
          p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
          ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
          Cadastro de Estação
        </h2>
       
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
    
            <div className="mb-3 md:col-span-2">
      
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="name">
                Nome da Estação
              </label>
              <input
                type="text" id="name" name="name"
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
                placeholder="Ex: Estação Central"
                value={formData.name} onChange={handleChange} required
              />
            </div>

            <div className="mb-3 md:col-span-2">
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="address">
                Endereço
              </label>
              <input
                type="text" id="address" name="address"
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
                placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
                value={formData.address} onChange={handleChange} required
              />
            </div>

            <div className="mb-3">
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="macAddress">
                Endereço MAC
              </label>
              <input
                type="text" id="macAddress" name="macAddress"
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
                placeholder="XX:XX:XX:XX:XX:XX"
                value={formData.macAddress} onChange={handleChange} required
              />
            </div>
        
            <div className="mb-3">
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="status">
                Status Inicial
              </label>
              <select
                id="status" name="status"
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
                value={formData.status} onChange={handleChange}
              >
                <option value="INACTIVE">Inativo</option>
                <option value="ACTIVE">Ativo</option>
              </select>
            </div>
        
            <div className="mb-3">
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="latitude">
                Latitude
              </label>
              <input
                type="text" id="latitude" name="latitude"
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
                placeholder="-23.5505"
                value={formData.latitude} onChange={handleChange} required
              />
            </div>

         
            <div className="mb-3">
              
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="longitude">
                Longitude
              </label>
              <input
                type="text" id="longitude" name="longitude"
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
                placeholder="-46.6333"
                value={formData.longitude} onChange={handleChange} required
              />
            </div>

            <div className="mb-3 md:col-span-2">
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description" name="description"
                rows={2}
                className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
                placeholder="Estação localizada na área central..."
                value={formData.description} onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
            <button
              type="button" onClick={handleClose}
              className={`font-bold py-2 px-4 rounded text-sm sm:text-base w-full sm:w-auto ${
                isDarkMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`font-bold py-2 px-4 rounded text-sm sm:text-base w-full sm:w-auto ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-700 text-white'
              }`}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCadastroEstacao;