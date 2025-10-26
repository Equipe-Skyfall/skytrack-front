// API Configuration
export const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
// AUTH_BASE prefers a separate auth URL when provided, otherwise falls back to API_BASE
export const AUTH_BASE = (import.meta.env.VITE_AUTH_URL as string) || API_BASE;
