'use client';

import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, TreePine } from 'lucide-react';

interface Parcel {
  id: string;
  name: string;
  riskIndex: number;
  palms: number;
  disease: string | null;
  lastUpdate: string;
}

interface Block {
  id: string;
  name: string;
  avgRisk: number;
  parcels: Parcel[];
  supervisor: string;
}

const BLOCKS_DATA: Block[] = [
  {
    id: 'B4',
    name: 'Bloc B4',
    avgRisk: 65,
    supervisor: 'Kouassi Yao',
    parcels: [
      {
        id: 'P-B4-012',
        name: 'P-B4-012',
        riskIndex: 78,
        palms: 156,
        disease: 'Ganoderma',
        lastUpdate: '02/05',
      },
      {
        id: 'P-B4-013',
        name: 'P-B4-013',
        riskIndex: 54,
        palms: 148,
        disease: 'Phytophthora',
        lastUpdate: '01/05',
      },
      {
        id: 'P-B4-014',
        name: 'P-B4-014',
        riskIndex: 32,
        palms: 162,
        disease: null,
        lastUpdate: '30/04',
      },
      {
        id: 'P-B4-015',
        name: 'P-B4-015',
        riskIndex: 45,
        palms: 142,
        disease: 'Coelaenomenodera',
        lastUpdate: '02/05',
      },
    ],
  },
  {
    id: 'B5',
    name: 'Bloc B5',
    avgRisk: 38,
    supervisor: 'Bamba Seydou',
    parcels: [
      {
        id: 'P-B5-001',
        name: 'P-B5-001',
        riskIndex: 22,
        palms: 171,
        disease: null,
        lastUpdate: '01/05',
      },
      {
        id: 'P-B5-002',
        name: 'P-B5-002',
        riskIndex: 48,
        palms: 155,
        disease: 'Carence Mg',
        lastUpdate: '30/04',
      },
      {
        id: 'P-B5-003',
        name: 'P-B5-003',
        riskIndex: 41,
        palms: 168,
        disease: null,
        lastUpdate: '28/04',
      },
    ],
  },
  {
    id: 'B6',
    name: 'Bloc B6',
    avgRisk: 74,
    supervisor: 'Traoré Moussa',
    parcels: [
      {
        id: 'P-B6-007',
        name: 'P-B6-007',
        riskIndex: 82,
        palms: 144,
        disease: 'Fusarium',
        lastUpdate: '02/05',
      },
      {
        id: 'P-B6-008',
        name: 'P-B6-008',
        riskIndex: 68,
        palms: 159,
        disease: 'Ganoderma',
        lastUpdate: '02/05',
      },
      {
        id: 'P-B6-009',
        name: 'P-B6-009',
        riskIndex: 71,
        palms: 147,
        disease: 'Phytophthora',
        lastUpdate: '01/05',
      },
    ],
  },
  {
    id: 'B7',
    name: 'Bloc B7',
    avgRisk: 18,
    supervisor: 'Koné Drissa',
    parcels: [
      {
        id: 'P-B7-001',
        name: 'P-B7-001',
        riskIndex: 15,
        palms: 180,
        disease: null,
        lastUpdate: '29/04',
      },
      {
        id: 'P-B7-002',
        name: 'P-B7-002',
        riskIndex: 21,
        palms: 173,
        disease: null,
        lastUpdate: '28/04',
      },
    ],
  },
];

interface BlockListPanelProps {
  siteId: string;
  selectedParcel: string | null;
  onParcelSelect: (id: string) => void;
}

export default function BlockListPanel({
  siteId: _siteId,
  selectedParcel,
  onParcelSelect,
}: BlockListPanelProps) {
  const [expandedBlock, setExpandedBlock] = useState<string | null>('B4');

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Blocs — Ehania
        </h3>
        <span className="text-[10px] text-muted-foreground font-tabular">
          {BLOCKS_DATA.length} blocs
        </span>
      </div>

      <div className="space-y-2">
        {BLOCKS_DATA.map((block) => {
          const isExpanded = expandedBlock === block.id;
          const blockRiskColor =
            block.avgRisk >= 60 ? '#F04444' : block.avgRisk >= 30 ? '#F59820' : '#2ECC71';

          return (
            <div
              key={`block-${block.id}`}
              className="rounded-xl overflow-hidden"
              style={{
                border: `1px solid ${isExpanded ? `${blockRiskColor}30` : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {/* Block header */}
              <button
                onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-surface-1 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-8 rounded-full" style={{ background: blockRiskColor }} />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-foreground">{block.name}</div>
                    <div className="text-[10px] text-muted-foreground">{block.supervisor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <div
                      className="text-right text-sm font-bold font-tabular"
                      style={{ color: blockRiskColor }}
                    >
                      {block.avgRisk}%
                    </div>
                    <div className="text-[10px] text-muted-foreground text-right">
                      {block.parcels.length} parcelles
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {/* Parcels list */}
              {isExpanded && (
                <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  {block.parcels.map((parcel) => {
                    const parcelRiskColor =
                      parcel.riskIndex >= 60
                        ? '#F04444'
                        : parcel.riskIndex >= 30
                          ? '#F59820'
                          : '#2ECC71';
                    const isSelected = selectedParcel === parcel.id;

                    return (
                      <button
                        key={`parcel-${parcel.id}`}
                        onClick={() => onParcelSelect(parcel.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2.5
                          hover:bg-surface-1 transition-colors border-b last:border-b-0
                          ${isSelected ? 'bg-surface-2' : ''}
                        `}
                        style={{ borderColor: 'rgba(255,255,255,0.03)' }}
                      >
                        <div className="flex items-center gap-2">
                          <TreePine size={11} className="text-muted-foreground" />
                          <div className="text-left">
                            <div className="text-xs font-medium text-foreground font-mono">
                              {parcel.name}
                            </div>
                            {parcel.disease && (
                              <div
                                className="text-[10px] flex items-center gap-1"
                                style={{ color: parcelRiskColor }}
                              >
                                <AlertTriangle size={8} />
                                {parcel.disease}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold font-tabular"
                            style={{ color: parcelRiskColor }}
                          >
                            {parcel.riskIndex}%
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {parcel.lastUpdate}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
