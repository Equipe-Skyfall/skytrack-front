import React, { useState } from "react";

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
  const [formData, setFormData] = useState<StationFormData>(initialState);

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

  return (
    <div
      className={`
        fixed inset-0 flex justify-center items-center z-50
        transition-all duration-300 ease-in-out
        ${isOpen ? "backdrop-blur-sm" : "bg-opacity-0 pointer-events-none"}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          bg-white p-6 rounded-lg shadow-xl w-full max-w-xl
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          Cadastro de Estação
        </h2>
       
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
    
            <div className="mb-3 md:col-span-2">
      
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nome da Estação
              </label>
              <input
                type="text" id="name" name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="Ex: Estação Central"
                value={formData.name} onChange={handleChange} required
              />
            </div>

            <div className="mb-3 md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Endereço
              </label>
              <input
                type="text" id="address" name="address"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
                value={formData.address} onChange={handleChange} required
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="macAddress">
                Endereço MAC
              </label>
              <input
                type="text" id="macAddress" name="macAddress"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="XX:XX:XX:XX:XX:XX"
                value={formData.macAddress} onChange={handleChange} required
              />
            </div>
        
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status Inicial
              </label>
              <select
                id="status" name="status"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                value={formData.status} onChange={handleChange}
              >
                <option value="INACTIVE">Inativo</option>
                <option value="ACTIVE">Ativo</option>
              </select>
            </div>
        
            <div className="mb-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                Latitude
              </label>
              <input
                type="text" id="latitude" name="latitude"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="-23.5505"
                value={formData.latitude} onChange={handleChange} required
              />
            </div>

         
            <div className="mb-3">
              
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                Longitude
              </label>
              <input
                type="text" id="longitude" name="longitude"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="-46.6333"
                value={formData.longitude} onChange={handleChange} required
              />
            </div>

            <div className="mb-3 md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description" name="description"
                rows={2}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                placeholder="Estação localizada na área central..."
                value={formData.description} onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button" onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
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