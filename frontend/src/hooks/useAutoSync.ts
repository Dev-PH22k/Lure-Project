import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Interface para status de sincronização
 */
export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  nextSyncTime: Date | null;
  syncCount: number;
  error: string | null;
}

/**
 * Hook customizado para sincronização automática
 * Atualiza dados a cada intervalo especificado (padrão: 1 minuto)
 * 
 * @param callback - Função a ser executada a cada sincronização
 * @param interval - Intervalo em milissegundos (padrão: 60000ms = 1 minuto)
 * @param enabled - Se a sincronização está habilitada (padrão: true)
 * @returns Status de sincronização
 */
export const useAutoSync = (
  callback: () => Promise<void>,
  interval: number = 60000, // 1 minuto por padrão
  enabled: boolean = true
): SyncStatus => {
  const [status, setStatus] = useState<SyncStatus>({
    isSyncing: false,
    lastSyncTime: null,
    nextSyncTime: null,
    syncCount: 0,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);

  /**
   * Executa a sincronização
   */
  const performSync = useCallback(async () => {
    try {
      setStatus((prev) => ({
        ...prev,
        isSyncing: true,
        error: null,
      }));

      console.log('[useAutoSync] Iniciando sincronização...');
      await callback();

      const now = new Date();
      const nextSync = new Date(now.getTime() + interval);

      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: now,
        nextSyncTime: nextSync,
        syncCount: prev.syncCount + 1,
        error: null,
      }));

      console.log(`[useAutoSync] Sincronização concluída. Próxima sincronização em ${nextSync.toLocaleTimeString()}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('[useAutoSync] Erro durante sincronização:', errorMessage);

      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        error: errorMessage,
      }));
    }
  }, [callback, interval]);

  /**
   * Executa sincronização manual
   */
  const manualSync = useCallback(async () => {
    console.log('[useAutoSync] Sincronização manual solicitada');
    await performSync();
  }, [performSync]);

  /**
   * Configura o intervalo de sincronização automática
   */
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Executa sincronização imediatamente na primeira execução
    if (isFirstRun.current) {
      console.log('[useAutoSync] Primeira sincronização');
      performSync();
      isFirstRun.current = false;
    }

    // Configura intervalo para sincronizações periódicas
    intervalRef.current = setInterval(() => {
      console.log('[useAutoSync] Sincronização periódica acionada');
      performSync();
    }, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, performSync]);

  return {
    ...status,
    manualSync,
  } as SyncStatus & { manualSync: () => Promise<void> };
};

/**
 * Formata tempo relativo para exibição
 * Ex: "há 2 minutos", "há 30 segundos"
 */
export const formatTimeAgo = (date: Date | null): string => {
  if (!date) return 'Nunca';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) {
    return `há ${diffSecs}s`;
  } else if (diffMins < 60) {
    return `há ${diffMins}m`;
  } else if (diffHours < 24) {
    return `há ${diffHours}h`;
  } else {
    return date.toLocaleString('pt-BR');
  }
};

/**
 * Formata próximo tempo de sincronização
 */
export const formatNextSync = (date: Date | null): string => {
  if (!date) return 'Calculando...';

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);

  if (diffSecs < 0) {
    return 'Sincronizando...';
  } else if (diffSecs < 60) {
    return `em ${diffSecs}s`;
  } else if (diffMins < 60) {
    return `em ${diffMins}m`;
  } else {
    return date.toLocaleTimeString('pt-BR');
  }
};
