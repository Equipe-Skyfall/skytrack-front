/// <reference types="vite/client" />
// This file should only contain type declarations for Vite's env.
// Do not export runtime values from here.

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_AUTH_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}