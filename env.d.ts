/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_NAME: string;
  // Zde přidej další proměnné, které máš v .env
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}