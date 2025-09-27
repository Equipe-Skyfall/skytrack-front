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