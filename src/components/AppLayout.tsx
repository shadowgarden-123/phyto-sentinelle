'use client';

'use client';

import React from 'react';
import BottomNav from './BottomNav';
import OfflineBanner from './OfflineBanner';

interface AppLayoutProps {
  children: React.ReactNode;
  role?: 'DOP' | 'CDA' | 'CPI' | 'SPHY';
  alertCount?: number;
  showBottomNav?: boolean;
  fullScreen?: boolean;
}

export default function AppLayout({
  children,
  role = 'CPI',
  alertCount = 7,
  showBottomNav = true,
  fullScreen = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OfflineBanner />
      <main className={`flex-1 ${fullScreen ? '' : 'pb-16'} ${showBottomNav ? '' : ''}`}>
        {children}
      </main>
      {showBottomNav && <BottomNav role={role} alertCount={alertCount} />}
    </div>
  );
}
