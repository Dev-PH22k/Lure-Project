/**
 * Configuração do Google Sheets para o Dashboard LURE DIGITAL
 * 
 * Em desenvolvimento: Use a URL do seu Google Sheets
 * Em produção: Configure via variável de ambiente no Render/Vercel
 */

export const GOOGLE_SHEETS_URL = 
  import.meta.env.VITE_GOOGLE_SHEETS_URL || 
  'https://docs.google.com/spreadsheets/d/1YzIvXlrkllsbmgrC2S95JSu0POWHIm1qxHpSXlT4OLo/export?format=xlsx';

/**
 * Intervalo de sincronização em milissegundos
 * 60000 = 1 minuto
 */
export const SYNC_INTERVAL = 60000;

/**
 * Modo de desenvolvimento
 */
export const IS_DEV = import.meta.env.DEV;
