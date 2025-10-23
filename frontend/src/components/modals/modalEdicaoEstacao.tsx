import React, { useState, useEffect } from "react";

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

interface ModalEdicaoEstacaoProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StationFormData) => void;
    stationToEdit: StationData;
}

const ModalEdicaoEstacao: React.FC<ModalEdicaoEstacaoProps> = ({
    isOpen,
    onClose,
    onSubmit,
    stationToEdit,
}) => {
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
        if (isOpen && stationToEdit) {
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
    }, [stationToEdit, isOpen]);

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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={handleClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Editar Estação
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-3 md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Nome da Estação
                            </label>
                            <input
                                type="text" id="name" name="name"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
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
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
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
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                                placeholder="XX:XX:XX:XX:XX:XX"
                                value={formData.macAddress} onChange={handleChange} required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status" name="status"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
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
                                type="number" step="any" id="latitude" name="latitude"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                                placeholder="-23.5505"
                                value={formData.latitude} onChange={handleChange} required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                                Longitude
                            </label>
                            <input
                                type="number" step="any" id="longitude" name="longitude"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
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
                                rows={3}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline resize-none"
                                placeholder="Estação localizada na área central..."
                                value={formData.description} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button" onClick={handleClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
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