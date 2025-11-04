export type StatusEstacao = 'online' | 'offline' | 'unknown';

export interface Estacao {
  id: string;
  nome: string;
  status: StatusEstacao;
  ultimaAtualizacao: string;
}

export interface StatusEstacoesProps {
  estacoes: Estacao[];
}
