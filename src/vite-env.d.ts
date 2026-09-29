/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Amplitude API key for analytics (see src/analytics.ts). */
  readonly VITE_AMPLITUDE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
