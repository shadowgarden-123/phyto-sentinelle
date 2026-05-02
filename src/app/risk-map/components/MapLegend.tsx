'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PALMS_PER_SENSOR, SENSOR_COVERAGE_RADIUS_M } from '../lib/mockData';

export default function MapLegend() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="rounded-xl overflow-hidden" 
      style={{ 
        minWidth: '180px',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 229, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 16px rgba(0,229,255,0.05)'
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors"
      >
        <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#00e5ff]" style={{ textShadow: '0 0 8px rgba(0,229,255,0.5)' }}>
          Légende Radar
        </span>
        {expanded ? (
          <ChevronDown size={12} className="text-[#00e5ff]" />
        ) : (
          <ChevronUp size={12} className="text-[#00e5ff]" />
        )}
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-3 fade-in">
          {/* Risk levels */}
          <div className="space-y-2">
            {[
              { color: '#10b981', label: 'Sécurisé', range: '< 30%' },
              { color: '#F59820', label: 'Vigilance', range: '30–60%' },
              { color: '#ef4444', label: 'Critique', range: '> 60%' },
            ]?.map((item) => (
              <div key={`legend-${item?.label}`} className="flex items-center gap-2">
                <div
                  className="w-4 h-2 flex-shrink-0"
                  style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                />
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">{item?.label}</span>
                <span className="text-[10px] text-[#00e5ff] ml-auto font-tabular">
                  {item?.range}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3" style={{ borderColor: 'rgba(0, 229, 255, 0.15)' }}>
            {/* Kriging gradient */}
            <div className="mb-1.5">
              <div
                className="h-1.5 mb-1.5"
                style={{ 
                  background: 'linear-gradient(90deg, #10b981 0%, #F59820 50%, #ef4444 100%)',
                  boxShadow: '0 0 10px rgba(245,152,32,0.4)'
                }}
              />
              <div className="flex justify-between">
                <span className="text-[9px] text-slate-400 font-bold tracking-widest">0%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Heatmap</span>
                <span className="text-[9px] text-slate-400 font-bold tracking-widest">100%</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-3 space-y-2" style={{ borderColor: 'rgba(0, 229, 255, 0.15)' }}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff] flex-shrink-0 flex items-center justify-center shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_5px_#00e5ff]" />
              </div>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Sys Actif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-600 flex-shrink-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sys Inactif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-[#00e5ff]/40 flex-shrink-0" style={{ borderStyle: 'dashed' }} />
              <span className="text-[9px] text-slate-400 leading-tight">
                Couverture Radiale (~{SENSOR_COVERAGE_RADIUS_M}m)
              </span>
            </div>
          </div>
        </div>
      )}
      {!expanded && (
        <div className="px-3 pb-2.5 flex gap-2 justify-between">
          {[
            { color: '#10b981', label: 'SEC' },
            { color: '#F59820', label: 'VIG' },
            { color: '#ef4444', label: 'CRI' },
          ]?.map((item) => (
            <div key={`legend-compact-${item?.label}`} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: item?.color, boxShadow: `0 0 5px ${item.color}` }} />
              <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{item?.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
