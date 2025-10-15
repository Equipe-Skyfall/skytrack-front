// Tipos e interfaces relacionados aos alertas

export interface Alert {
  id: string;
  data: Date;
  stationId: string;
  parameterId: string;
  tipoAlertaId: string;
  medidasId?: string;
  createdAt: Date;
}

export type AlertFormData = Partial<Alert>;

export interface TipoAlerta {
  id: string;
  tipo: string;
  publica: boolean;
  condicao: string;
  valor: string;
  limite: number;
  nivel: string;
  duracaoMin?: number;
  criadoEm: Date;
}

export type TipoAlertaFormData = Partial<Omit<TipoAlerta, 'id' | 'criadoEm'>>;

export interface TipoAlertaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

// Tipos para Dashboard
export type StatusEstacao = 'online' | 'offline';
export type NivelAlerta = 'baixo' | 'medio' | 'alto';

export interface EstacaoStatus {
  id: number;
  nome: string;
  status: StatusEstacao;
  ultimaAtualizacao: string;
}

export interface Alerta {
  id: number;
  tipo: string;
  nivel: NivelAlerta;
  regiao: string;
  horario: string;
}

export interface StatusEstacoesProps {
  estacoes: EstacaoStatus[];
}

export interface AlertasRecentesProps {
  alertas: Alerta[];
}