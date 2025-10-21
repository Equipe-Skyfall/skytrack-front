// Interfaces para componentes gerais e modais

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export interface FormModalProps extends ModalProps {
  onSave: () => void;
}

export interface ConfirmDeleteProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message: string;
}

export interface AlertFormProps {
  value: any;
  onChange: (value: any) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  title: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; username: string; password: string; confirmPassword: string }) => void;
}

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; username: string; password: string }) => void;
  onDelete: () => void;
  initialData: { email: string; username: string };
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface CardEducacaoProps {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
}

export interface SecaoEducacaoProps {
  titulo: string;
  descricao: string;
  conteudo: React.ReactNode;
}

// Interfaces para modais de estação
export interface ModalCadastroEstacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StationFormData) => void;
}

export interface ModalEdicaoEstacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StationFormData) => void;
  station: StationData;
}

export interface ModalExcluirEstacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stationName: string;
}

export interface StationFormData {
  name: string;
  address: string;
  macAddress: string;
  latitude: string;
  longitude: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface StationData {
  id: string;
  name: string;
  macAddress: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}