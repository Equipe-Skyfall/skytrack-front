// Tipos e interfaces relacionados aos parâmetros

export interface TipoParametroDto {
  id: string;
  jsonId: string;
  nome: string;
  metrica: string;
  polinomio?: string;
  coeficiente: number[];
  leitura: any;
}

export interface TipoAlertaDto {
  id: string;
  tipo: string;
  publica: boolean;
  condicao: string;
  valor: string;
  criadoEm: Date;
  limite: number;
  nivel: string;
  duracaoMin?: number;
}

export interface ParameterDto {
  id: string;
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId?: string;
}

export interface CreateParameterDto {
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId?: string;
}

export interface UpdateParameterDto {
  tipoAlertaId?: string;
}

export interface ParameterFormData {
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId: string;
}

export interface AssociationFormData {
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId: string;
}

export interface TipoParametro {
  id: string;
  jsonId: string;
  nome: string;
  metrica: string;
  polinomio?: string;
  coeficiente: number[];
  leitura: any;
}

export type TipoParametroFormData = Partial<Omit<TipoParametro, 'id'>>;

export interface TipoParametroModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}