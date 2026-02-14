import { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { formatTimeAgo, formatNextSync, SyncStatus } from '@/hooks/useAutoSync';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SyncIndicatorProps {
  status: SyncStatus & { manualSync?: () => Promise<void> };
  onManualSync?: () => void;
}

/**
 * Componente que exibe indicador visual de sincronização
 * Mostra status, última sincronização e próxima sincronização
 */
export default function SyncIndicator({ status, onManualSync }: SyncIndicatorProps) {
  const [displayTime, setDisplayTime] = useState<string>('');
  const [nextSyncDisplay, setNextSyncDisplay] = useState<string>('');

  // Atualiza tempo relativo a cada segundo
  useEffect(() => {
    const updateDisplay = () => {
      setDisplayTime(formatTimeAgo(status.lastSyncTime));
      setNextSyncDisplay(formatNextSync(status.nextSyncTime));
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);

    return () => clearInterval(interval);
  }, [status.lastSyncTime, status.nextSyncTime]);

  const handleManualSync = async () => {
    if (onManualSync) {
      onManualSync();
    } else if (status.manualSync) {
      await status.manualSync();
    }
  };

  // Determina cor e ícone baseado no status
  const getStatusDisplay = () => {
    if (status.isSyncing) {
      return {
        icon: <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />,
        label: 'Sincronizando...',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
      };
    }

    if (status.error) {
      return {
        icon: <AlertCircle className="w-4 h-4 text-red-400" />,
        label: 'Erro na sincronização',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
      };
    }

    if (status.lastSyncTime) {
      return {
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        label: 'Sincronizado',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
      };
    }

    return {
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      label: 'Aguardando primeira sincronização',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    };
  };

  const display = getStatusDisplay();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 ${display.bgColor} cursor-help transition-all hover:border-slate-600`}
          >
            {display.icon}
            <div className="flex flex-col gap-0.5">
              <span className={`text-xs font-semibold ${display.color}`}>
                {display.label}
              </span>
              <span className="text-xs text-slate-400">
                {displayTime}
              </span>
            </div>

            {/* Botão de sincronização manual */}
            <button
              onClick={handleManualSync}
              disabled={status.isSyncing}
              className="ml-2 p-1.5 hover:bg-slate-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sincronizar agora"
            >
              <RefreshCw
                className={`w-4 h-4 text-amber-500 ${status.isSyncing ? 'animate-spin' : 'hover:text-amber-400'}`}
              />
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-white">Status de Sincronização</p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-slate-400">Última sincronização:</span>{' '}
                <span className="text-white">{displayTime}</span>
              </p>
              <p>
                <span className="text-slate-400">Próxima sincronização:</span>{' '}
                <span className="text-white">{nextSyncDisplay}</span>
              </p>
              <p>
                <span className="text-slate-400">Total de sincronizações:</span>{' '}
                <span className="text-white">{status.syncCount}</span>
              </p>
              {status.error && (
                <p className="text-red-400">
                  <span className="text-slate-400">Erro:</span> {status.error}
                </p>
              )}
            </div>
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-700">
              Clique no ícone de atualização para sincronizar manualmente
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
