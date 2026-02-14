import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSync, formatTimeAgo, formatNextSync } from './useAutoSync';

describe('useAutoSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve executar callback na primeira execução', async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    renderHook(() => useAutoSync(callback, 60000, true));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('deve executar callback a cada intervalo especificado', async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    renderHook(() => useAutoSync(callback, 60000, true));

    expect(callback).toHaveBeenCalledTimes(1);

    // Avança 1 minuto
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(2);
    });

    // Avança mais 1 minuto
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  it('deve atualizar lastSyncTime após sincronização bem-sucedida', async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSync(callback, 60000, true));

    await waitFor(() => {
      expect(result.current.lastSyncTime).not.toBeNull();
    });
  });

  it('deve incrementar syncCount após cada sincronização', async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSync(callback, 60000, true));

    await waitFor(() => {
      expect(result.current.syncCount).toBe(1);
    });

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(result.current.syncCount).toBe(2);
    });
  });

  it('deve definir isSyncing como true durante sincronização', async () => {
    let resolveCallback: (() => void) | null = null;
    const callback = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveCallback = resolve;
        })
    );

    const { result } = renderHook(() => useAutoSync(callback, 60000, true));

    await waitFor(() => {
      expect(result.current.isSyncing).toBe(true);
    });

    if (resolveCallback) {
      act(() => {
        resolveCallback!();
      });
    }

    await waitFor(() => {
      expect(result.current.isSyncing).toBe(false);
    });
  });

  it('deve capturar erro durante sincronização', async () => {
    const errorMessage = 'Erro de teste';
    const callback = vi.fn().mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAutoSync(callback, 60000, true));

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it('deve não executar callback quando disabled', async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    renderHook(() => useAutoSync(callback, 60000, false));

    await waitFor(() => {
      expect(callback).not.toHaveBeenCalled();
    });
  });

  it('deve parar de sincronizar quando disabled', async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    const { rerender } = renderHook(
      ({ enabled }) => useAutoSync(callback, 60000, enabled),
      { initialProps: { enabled: true } }
    );

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(1);
    });

    rerender({ enabled: false });

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    // Não deve chamar callback novamente
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('deve calcular nextSyncTime corretamente', async () => {
    const callback = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSync(callback, 60000, true));

    await waitFor(() => {
      expect(result.current.nextSyncTime).not.toBeNull();
      if (result.current.nextSyncTime && result.current.lastSyncTime) {
        const diff = result.current.nextSyncTime.getTime() - result.current.lastSyncTime.getTime();
        expect(diff).toBe(60000);
      }
    });
  });
});

describe('formatTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-10T12:00:00Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar "Nunca" para null', () => {
    expect(formatTimeAgo(null)).toBe('Nunca');
  });

  it('deve formatar segundos corretamente', () => {
    const date = new Date('2026-02-10T11:59:30Z');
    expect(formatTimeAgo(date)).toBe('há 30s');
  });

  it('deve formatar minutos corretamente', () => {
    const date = new Date('2026-02-10T11:58:00Z');
    expect(formatTimeAgo(date)).toBe('há 2m');
  });

  it('deve formatar horas corretamente', () => {
    const date = new Date('2026-02-10T10:00:00Z');
    expect(formatTimeAgo(date)).toBe('há 2h');
  });
});

describe('formatNextSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-10T12:00:00Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar "Calculando..." para null', () => {
    expect(formatNextSync(null)).toBe('Calculando...');
  });

  it('deve formatar segundos até próxima sincronização', () => {
    const date = new Date('2026-02-10T12:00:30Z');
    expect(formatNextSync(date)).toBe('em 30s');
  });

  it('deve formatar minutos até próxima sincronização', () => {
    const date = new Date('2026-02-10T12:02:00Z');
    expect(formatNextSync(date)).toBe('em 2m');
  });

  it('deve retornar "Sincronizando..." quando tempo passou', () => {
    const date = new Date('2026-02-10T11:59:00Z');
    expect(formatNextSync(date)).toBe('Sincronizando...');
  });
});
