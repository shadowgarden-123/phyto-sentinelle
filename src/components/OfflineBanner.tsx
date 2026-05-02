'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);
  const [pendingCount] = useState(3);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] fade-in">
        <div
          className="flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium"
          style={{ background: 'rgba(34, 197, 94, 0.9)', color: '#0A1F10' }}
        >
          <Wifi size={14} />
          <span>Connexion rétablie — Synchronisation en cours…</span>
          <RefreshCw size={14} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <div
        className="flex items-center justify-between py-2 px-4 text-sm font-medium"
        style={{ background: 'rgba(240, 68, 68, 0.9)', color: '#fff' }}
      >
        <div className="flex items-center gap-2">
          <WifiOff size={14} />
          <span>Mode hors ligne — Données en cache</span>
        </div>
        {pendingCount > 0 && (
          <span className="text-xs opacity-80">
            {pendingCount} action{pendingCount > 1 ? 's' : ''} en attente
          </span>
        )}
      </div>
    </div>
  );
}
