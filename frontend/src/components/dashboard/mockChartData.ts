export type ChuvaDia = {
  dia: string;
  mm: number;
};

export type TemperaturaDia = {
  dia: string;
  media: number;
};

export type VentoDia = {
  dia: string;
  velocidadeMedia: number;
};

export const chuvaPorDia: ChuvaDia[] = [
  { dia: '01/10', mm: 5 },
  { dia: '02/10', mm: 0 },
  { dia: '03/10', mm: 12 },
  { dia: '04/10', mm: 8 },
  { dia: '05/10', mm: 0 },
  { dia: '06/10', mm: 20 },
  { dia: '07/10', mm: 3 }
];

export const temperaturaMediaPorDia: TemperaturaDia[] = [
  { dia: '01/10', media: 22.5 },
  { dia: '02/10', media: 21.0 },
  { dia: '03/10', media: 20.2 },
  { dia: '04/10', media: 23.1 },
  { dia: '05/10', media: 24.0 },
  { dia: '06/10', media: 19.8 },
  { dia: '07/10', media: 21.7 }
];

export const ventoPorDia: VentoDia[] = [
  { dia: '01/10', velocidadeMedia: 8.5 },
  { dia: '02/10', velocidadeMedia: 6.2 },
  { dia: '03/10', velocidadeMedia: 12.1 },
  { dia: '04/10', velocidadeMedia: 10.0 },
  { dia: '05/10', velocidadeMedia: 5.4 },
  { dia: '06/10', velocidadeMedia: 14.3 },
  { dia: '07/10', velocidadeMedia: 7.9 }
];
