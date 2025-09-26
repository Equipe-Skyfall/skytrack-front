import type { EstacaoStatus, Alerta } from './types';

export const estacoesStatus: EstacaoStatus[] = [
  {
    id: 1,
    nome: 'Estação Central',
    status: 'online',
    ultimaAtualizacao: '2 min'
  },
  {
    id: 2,
    nome: 'Estação Norte',
    status: 'online',
    ultimaAtualizacao: '1 min'
  },
  {
    id: 3,
    nome: 'Estação Sul',
    status: 'offline',
    ultimaAtualizacao: '15 min'
  },
  {
    id: 4,
    nome: 'Estação Leste',
    status: 'online',
    ultimaAtualizacao: '3 min'
  }
];

export const alertasRecentes: Alerta[] = [
  {
    id: 1,
    tipo: 'Chuva Forte',
    nivel: 'medio',
    regiao: 'Região Centro',
    horario: '14:30'
  },
  {
    id: 2,
    tipo: 'Vento Forte',
    nivel: 'alto',
    regiao: 'Região Norte',
    horario: '13:45'
  },
  {
    id: 3,
    tipo: 'Neblina',
    nivel: 'baixo',
    regiao: 'Região Sul',
    horario: '12:20'
  }
];