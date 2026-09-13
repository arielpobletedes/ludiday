import { createClient, InsForgeClient } from '@insforge/sdk';

let clientInstance: InsForgeClient | null = null;

export interface InsForgeConfig {
  baseUrl: string;
  anonKey: string;
}

export function initInsForge(config?: Partial<InsForgeConfig>): InsForgeClient {
  const baseUrl =
    config?.baseUrl ||
    (typeof process !== 'undefined' && process.env?.VITE_INSFORGE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_INSFORGE_URL) ||
    'https://85nj7w58.us-east.insforge.app';

  const anonKey =
    config?.anonKey ||
    (typeof process !== 'undefined' && process.env?.VITE_INSFORGE_ANON_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_INSFORGE_ANON_KEY) ||
    'anon_c6b0423e5baa79eea547a2b33bfcfeb4c03ba429781796f8403427d61608f081';

  clientInstance = createClient({ baseUrl, anonKey });
  return clientInstance;
}

export function getInsForge(): InsForgeClient {
  if (!clientInstance) {
    return initInsForge();
  }
  return clientInstance;
}
