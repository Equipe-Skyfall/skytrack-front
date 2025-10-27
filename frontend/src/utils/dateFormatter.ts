/**
 * Formata uma data ISO 8601 para formato brasileiro legível
 * @param isoDate Data em formato ISO (ex: 2025-10-28T17:28:04.717Z)
 * @returns Data formatada (ex: 28/10/2025 às 14:28)
 */
export function formatDate(isoDate: string | Date | undefined): string {
  if (!isoDate) return '-';
  
  const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
  
  // Verifica se a data é válida
  if (isNaN(date.getTime())) return '-';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

/**
 * Formata apenas a hora de uma data ISO 8601
 * @param isoDate Data em formato ISO
 * @returns Hora formatada (ex: 14:28)
 */
export function formatTime(isoDate: string | Date | undefined): string {
  if (!isoDate) return '-';
  
  const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
  
  if (isNaN(date.getTime())) return '-';
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Formata apenas a data de uma data ISO 8601
 * @param isoDate Data em formato ISO
 * @returns Data formatada (ex: 28/10/2025)
 */
export function formatDateOnly(isoDate: string | Date | undefined): string {
  if (!isoDate) return '-';
  
  const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
  
  if (isNaN(date.getTime())) return '-';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}
