import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { syncEngine } from '../services/syncEngine';

export const SyncStatusBadge: React.FC = () => {
  const [online, setOnline] = useState(syncEngine.isOnline());
  const [pendingCount, setPendingCount] = useState(syncEngine.getPendingCount());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((isOnline, count) => {
      setOnline(isOnline);
      setPendingCount(count);
    });
    return unsubscribe;
  }, []);

  const handleManualSync = async () => {
    if (!online || syncing) return;
    setSyncing(true);
    await syncEngine.processQueue();
    setSyncing(false);
  };

  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <div className="flex items-center gap-1.5">
        {online ? (
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Online</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span>Modo Offline</span>
          </span>
        )}
      </div>

      {pendingCount > 0 && (
        <button
          onClick={handleManualSync}
          disabled={!online || syncing}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] hover:bg-amber-100 transition-colors"
          title="Clique para sincronizar os registos pendentes"
        >
          <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
          <span>{pendingCount} pendente{pendingCount > 1 ? 's' : ''}</span>
        </button>
      )}
    </div>
  );
};
