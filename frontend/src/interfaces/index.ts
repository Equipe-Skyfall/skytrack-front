// Arquivo principal para exportar todas as interfaces
// Facilitando a importação em outros arquivos

export * from './auth';
export * as alerts from './alerts';
export * from './parameters';
export * from './stations';
export * from './components';
export type { StationFormData } from './stations';
export * as sensorReadings from './sensor-readings';
export * from './dashboard';
// Remove StationFormData from './components' if it's exported there
