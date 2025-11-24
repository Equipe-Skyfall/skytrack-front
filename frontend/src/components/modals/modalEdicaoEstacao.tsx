import React, { useState, useEffect } from "react";
import { useTheme } from '../../contexts/ThemeContext';

interface StationFormData {
    name: string;
    address: string;
    macAddress: string;
    latitude: string;
    longitude: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
}

interface StationData {
    id: string;
    name: string;
    macAddress: string | null;
    latitude: number;
    longitude: number;
    address: string | null;
    description: string | null;
    status: "ACTIVE" | "INACTIVE";
}

interface ModalEdicaoProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StationFormData) => void;
    stationToEdit?: StationData;
    initialData?: StationFormData;
}

const ModalEdicaoEstacao: React.FC<ModalEdicaoProps> = ({
    isOpen,
    onClose,
    onSubmit,
    stationToEdit,
    initialData,
}) => {
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState<StationFormData>({
        name: "",
        address: "",
        macAddress: "",
        latitude: "",
        longitude: "",
        description: "",
        status: "INACTIVE",
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else if (stationToEdit) {
                setFormData({
                    name: stationToEdit.name,
                    address: stationToEdit.address || "",
                    macAddress: stationToEdit.macAddress || "",
                    latitude: String(stationToEdit.latitude),
                    longitude: String(stationToEdit.longitude),
                    description: stationToEdit.description || "",
                    status: stationToEdit.status,
                });
            }
        }
    }, [stationToEdit, initialData, isOpen]);

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
    };

    const handleClose = () => {
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
 p-6 rounded-lg shadow-xl w-full max-w-xl
 transition-all duration-300 ease-in-out
 ${isOpen
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }
 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
 `}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                    Editar Estação
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
                                Status
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

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button" onClick={handleClose}
                            className={`font-bold py-2 px-4 rounded ${
                                isDarkMode 
                                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                            }`}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`font-bold py-2 px-4 rounded ${
                                isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-700 text-white'
                            }`}
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEdicaoEstacao;