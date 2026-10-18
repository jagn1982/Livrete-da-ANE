/**
 * JornadaPro PT - Offline Sync Engine
 * Resiliência com ligação instável, fila de eventos locais e reconciliação auditada
 */

import { storage } from './storage';
import { SyncQueueItem } from '../types';

export class SyncEngine {
  private isOnlineStatus: boolean = navigator.onLine;
  private listeners: Array<(online: boolean, pendingCount: number) => void> = [];

  constructor() {
    window.addEventListener('online', () => {
      this.isOnlineStatus = true;
      this.notify();
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnlineStatus = false;
      this.notify();
    });
  }

  isOnline(): boolean {
    return this.isOnlineStatus;
  }

  getPendingCount(): number {
    return storage.getSyncQueue().filter((q) => q.status === 'queued').length;
  }

  subscribe(callback: (online: boolean, pendingCount: number) => void): () => void {
    this.listeners.push(callback);
    callback(this.isOnlineStatus, this.getPendingCount());
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    const pending = this.getPendingCount();
    this.listeners.forEach((cb) => cb(this.isOnlineStatus, pending));
  }

  async processQueue(): Promise<{ synced: number; failed: number }> {
    if (!this.isOnlineStatus) {
      return { synced: 0, failed: 0 };
    }

    const queue = storage.getSyncQueue();
    let synced = 0;
    let failed = 0;

    for (const item of queue) {
      if (item.status !== 'queued') continue;

      try {
        // Simulação de reconciliação com o backend/servidor de auditoria
        await new Promise((res) => setTimeout(res, 200));

        // Marcar item como sincronizado
        item.status = 'processing';
        synced++;
      } catch (err: any) {
        item.attempts += 1;
        item.error = err?.message || 'Falha de comunicação com o servidor central';
        failed++;
      }
    }

    storage.clearSyncedQueue();
    this.notify();
    return { synced, failed };
  }
}

export const syncEngine = new SyncEngine();
