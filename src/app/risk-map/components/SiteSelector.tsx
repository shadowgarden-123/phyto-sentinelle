'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  hectares: number;
  riskIndex: number;
  blocks: number;
}

const SITES: Site[] = [
  { id: 'ehania', name: 'Ehania-Toumaguié', hectares: 7200, riskIndex: 62, blocks: 9 },
  { id: 'irobo', name: 'Irobo', hectares: 5800, riskIndex: 38, blocks: 7 },
  { id: 'iboke', name: 'Iboké', hectares: 4200, riskIndex: 45, blocks: 6 },
  { id: 'neka', name: 'Néka', hectares: 3500, riskIndex: 27, blocks: 5 },
  { id: 'boubo', name: 'Boubo', hectares: 4800, riskIndex: 71, blocks: 6 },
  { id: 'blidouba', name: 'Blidouba', hectares: 3900, riskIndex: 33, blocks: 5 },
  { id: 'gbapet', name: 'Gbapet', hectares: 2800, riskIndex: 19, blocks: 4 },
];

interface SiteSelectorProps {
  selectedSite: string;
  onSiteChange: (siteId: string) => void;
}

export default function SiteSelector({ selectedSite, onSiteChange }: SiteSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentSite = SITES.find((s) => s.id === selectedSite) || SITES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const riskColor =
    currentSite.riskIndex >= 60 ? '#ef4444' : currentSite.riskIndex >= 30 ? '#F59820' : '#10b981';

  return (
    <div ref={ref} className="relative z-[500]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all hover:bg-white/5"
        style={{
          background: 'rgba(0, 229, 255, 0.05)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          boxShadow: 'inset 0 0 10px rgba(0,229,255,0.05)',
        }}
      >
        <MapPin size={13} className="text-[#00e5ff]" style={{ filter: 'drop-shadow(0 0 4px #00e5ff)' }} />
        <span className="text-[#e2e8f0] max-w-[120px] sm:max-w-none truncate">
          {currentSite.name}
        </span>
        <span className="text-xs font-bold font-tabular" style={{ color: riskColor, textShadow: `0 0 8px ${riskColor}80` }}>
          {currentSite.riskIndex}%
        </span>
        <ChevronDown
          size={12}
          className={`text-[#00e5ff] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-72 rounded-xl overflow-hidden scale-in"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 0 15px rgba(0,229,255,0.05)',
          }}
        >
          <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(0, 229, 255, 0.15)' }}>
            <p className="text-[10px] text-[#00e5ff] font-bold uppercase tracking-widest opacity-80">
              Réseau PALMCI — 8 Sites Actifs
            </p>
          </div>
          {SITES.map((site) => {
            const siteRiskColor =
              site.riskIndex >= 60 ? '#ef4444' : site.riskIndex >= 30 ? '#F59820' : '#10b981';
            const isSelected = site.id === selectedSite;
            return (
              <button
                key={`site-${site.id}`}
                onClick={() => {
                  onSiteChange(site.id);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-3 text-left
                  hover:bg-white/5 transition-colors
                  ${isSelected ? 'bg-[rgba(0,229,255,0.05)]' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      background: isSelected ? '#00e5ff' : 'transparent',
                      boxShadow: isSelected ? '0 0 8px #00e5ff' : 'none'
                    }} 
                  />
                  <div>
                    <div
                      className={`text-sm font-bold uppercase tracking-wider ${isSelected ? 'text-[#00e5ff]' : 'text-slate-300'}`}
                      style={{ textShadow: isSelected ? '0 0 8px rgba(0,229,255,0.4)' : 'none' }}
                    >
                      {site.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
                      {site.hectares.toLocaleString('fr-CI')} ha · {site.blocks} SEC
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-10 rounded-full overflow-hidden bg-slate-800">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${site.riskIndex}%`, background: siteRiskColor, boxShadow: `0 0 8px ${siteRiskColor}` }}
                    />
                  </div>
                  <span className="text-xs font-bold font-tabular w-8 text-right" style={{ color: siteRiskColor }}>
                    {site.riskIndex}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
