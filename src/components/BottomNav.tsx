'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Bell, Clipboard, MessageSquare, LayoutDashboard, Activity } from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

export type UserRole = 'DOP' | 'CDA' | 'CPI' | 'SPHY';

interface BottomNavProps {
  role?: UserRole;
  alertCount?: number;
}

export default function BottomNav({ role = 'CPI', alertCount = 0 }: BottomNavProps) {
  const pathname = usePathname();

  const allTabs: NavTab[] = [
    {
      id: 'map',
      label: 'Carte',
      icon: <Map size={20} />,
      href: '/risk-map',
    },
    {
      id: 'alerts',
      label: 'Alertes',
      icon: <Bell size={20} />,
      href: '/alerts-management',
      badge: alertCount,
    },
    {
      id: 'interventions',
      label: role === 'SPHY' ? 'Mes Tâches' : 'Interventions',
      icon: <Clipboard size={20} />,
      href: '/interventions',
    },
    {
      id: 'phytobox',
      label: 'PhytoBox',
      icon: <Activity size={20} />,
      href: '/phytobox',
    },
    {
      id: 'assistant',
      label: "Assistant",
      icon: <MessageSquare size={20} />,
      href: '/assistant',
    },
    {
      id: 'dashboard',
      label: 'Tableau',
      icon: <LayoutDashboard size={20} />,
      href: '/dashboard',
    },
  ];

  const visibleTabs =
    role === 'SPHY'
      ? allTabs.filter((t) => ['map', 'interventions', 'assistant'].includes(t.id))
      : role === 'CPI'
        ? allTabs.filter((t) =>
            ['map', 'alerts', 'phytobox', 'assistant', 'dashboard'].includes(t.id)
          )
        : allTabs; // DOP et CDA voient tout

  const isActive = (href: string) => {
    if (href === '/risk-map') return pathname === '/risk-map' || pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-safe"
      style={{
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.03)',
      }}
    >
      <div className="flex items-stretch">
        {visibleTabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={`nav-tab-${tab.id}`}
              href={tab.href}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[56px]
                transition-all duration-200 relative
                ${active ? 'text-[#009E60]' : 'text-gray-500 hover:text-[#009E60]'}
              `}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#009E60]"
                />
              )}

              <span className="relative">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-[#ff4444] text-white text-[10px] font-bold flex items-center justify-center px-0.5 font-tabular">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </span>

              <span
                className={`text-[10px] mt-0.5 font-medium tracking-wide ${active ? 'text-[#009E60]' : ''}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
