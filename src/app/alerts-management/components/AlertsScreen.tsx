'use client';

import React, { useState, useMemo } from 'react';
import {
  Bell,
  Plus,
  Filter,
  Search,
  ChevronDown,
  X,
  Activity,
  User,
  Bot,
  RefreshCw,
  CheckCheck,
  SlidersHorizontal,
} from 'lucide-react';
import AlertCard from './AlertCard';
import AlertDetailDrawer from './AlertDetailDrawer';
import CreateAlertModal from './CreateAlertModal';

export type AlertLevel = 'critique' | 'élevé' | 'modéré' | 'faible';
export type AlertSource = 'capteur' | 'manuel' | 'ia';
export type AlertStatus = 'nouveau' | 'assigné' | 'en_cours' | 'résolu';

export interface Alert {
  id: string;
  parcelId: string;
  parcelName: string;
  bloc: string;
  site: string;
  disease: string;
  level: AlertLevel;
  source: AlertSource;
  status: AlertStatus;
  riskIndex: number;
  description: string;
  gps: { lat: number; lng: number };
  reportedBy: string;
  reportedAt: string;
  assignedTo: string | null;
  teamName: string | null;
  photoUrl: string | null;
  aiRecommendation: string | null;
  product: string | null;
  dose: string | null;
  read: boolean;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-2026-0847',
    parcelId: 'P-B6-007',
    parcelName: 'P-B6-007',
    bloc: 'Bloc B6',
    site: 'Ehania-Toumaguié',
    disease: 'Fusarium oxysporum',
    level: 'critique',
    source: 'ia',
    status: 'nouveau',
    riskIndex: 82,
    description:
      'Détection IA: 3 palmiers avec symptômes de flétrissement vasculaire. Jaunissement rapide des frondes inférieures, tige noircie à la base.',
    gps: { lat: 5.29, lng: 3.316 },
    reportedBy: 'PhytoSentinelle IA',
    reportedAt: '02/05/2026 01:47',
    assignedTo: null,
    teamName: null,
    photoUrl: null,
    aiRecommendation:
      'Abattage et incinération immédiate. Zone de quarantaine 50m. Traitement préventif Trichoderma 2kg/ha sur palmiers adjacents.',
    product: 'Trichoderma asperellum',
    dose: '2 kg/ha',
    read: false,
  },
  {
    id: 'ALT-2026-0846',
    parcelId: 'P-B4-012',
    parcelName: 'P-B4-012',
    bloc: 'Bloc B4',
    site: 'Ehania-Toumaguié',
    disease: 'Ganoderma boninense',
    level: 'critique',
    source: 'manuel',
    status: 'assigné',
    riskIndex: 78,
    description:
      'Ouvrier Kouadio signale carpophores de Ganoderma visibles à la base de 2 palmiers (numéros 0412-089 et 0412-092). Frondes en jupe caractéristiques.',
    gps: { lat: 5.274, lng: 3.314 },
    reportedBy: 'Kouadio Franck (PAL-5821)',
    reportedAt: '01/05/2026 14:23',
    assignedTo: 'Équipe Phyto B4',
    teamName: 'Équipe Phyto B4',
    photoUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d1f4c111-1767729814755.png',
    aiRecommendation:
      'Isoler les palmiers (ruban jaune). Pulvériser Trichoderma asperellum 2kg/ha sur la zone racinaire. Cureter les carpophores. Réévaluer dans 21 jours.',
    product: 'Trichoderma asperellum',
    dose: '2 kg/ha',
    read: false,
  },
  {
    id: 'ALT-2026-0845',
    parcelId: 'P-B6-009',
    parcelName: 'P-B6-009',
    bloc: 'Bloc B6',
    site: 'Ehania-Toumaguié',
    disease: 'Phytophthora palmivora',
    level: 'critique',
    source: 'capteur',
    status: 'en_cours',
    riskIndex: 71,
    description:
      'PhytoBox PB-051: humidité sol 91% (seuil: 80%), pH 5.2 (acide). Conditions favorables à Phytophthora. Corrélation avec symptômes de pourriture du cœur observés.',
    gps: { lat: 5.291, lng: 3.338 },
    reportedBy: 'PhytoBox PB-051',
    reportedAt: '01/05/2026 09:15',
    assignedTo: 'Traoré Moussa (PAL-3341)',
    teamName: 'Équipe Drainage B6',
    photoUrl: null,
    aiRecommendation:
      'Retirer les feuilles centrales infectées. Bouillie bordelaise (cuivre) 4L/ha sur couronne. Répéter tous les 14 jours. Drainage urgent de la parcelle.',
    product: 'Bouillie bordelaise (Cuivre)',
    dose: '4 L/ha',
    read: true,
  },
  {
    id: 'ALT-2026-0844',
    parcelId: 'P-B6-008',
    parcelName: 'P-B6-008',
    bloc: 'Bloc B6',
    site: 'Ehania-Toumaguié',
    disease: 'Ganoderma boninense',
    level: 'élevé',
    source: 'ia',
    status: 'assigné',
    riskIndex: 68,
    description:
      'Analyse kriging: cluster de risque élevé détecté (IC 95%: 58–78%). Corrélation avec données PhytoBox PB-051 (pH bas, humidité élevée).',
    gps: { lat: 5.291, lng: 3.328 },
    reportedBy: 'PhytoSentinelle IA',
    reportedAt: '01/05/2026 06:00',
    assignedTo: 'Bamba Seydou (PAL-2847)',
    teamName: 'Équipe Phyto B6',
    photoUrl: null,
    aiRecommendation:
      'Inspection terrain prioritaire. Vérifier présence de carpophores. Prélèvement sol pour analyse laboratoire.',
    product: null,
    dose: null,
    read: true,
  },
  {
    id: 'ALT-2026-0843',
    parcelId: 'P-B4-013',
    parcelName: 'P-B4-013',
    bloc: 'Bloc B4',
    site: 'Ehania-Toumaguié',
    disease: 'Phytophthora palmivora',
    level: 'élevé',
    source: 'manuel',
    status: 'en_cours',
    riskIndex: 54,
    description:
      'Chef de bloc signale 5 palmiers avec pourriture du cœur au stade précoce. Spear leaves non déployées, odeur putride caractéristique.',
    gps: { lat: 5.274, lng: 3.322 },
    reportedBy: 'Kouassi Yao (PAL-2847)',
    reportedAt: '30/04/2026 16:41',
    assignedTo: 'Équipe Phyto B4',
    teamName: 'Équipe Phyto B4',
    photoUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_11fb71ccd-1777690598377.png',
    aiRecommendation: null,
    product: 'Bouillie bordelaise (Cuivre)',
    dose: '4 L/ha',
    read: true,
  },
  {
    id: 'ALT-2026-0842',
    parcelId: 'P-B5-002',
    parcelName: 'P-B5-002',
    bloc: 'Bloc B5',
    site: 'Ehania-Toumaguié',
    disease: 'Carence Magnésium',
    level: 'modéré',
    source: 'capteur',
    status: 'assigné',
    riskIndex: 48,
    description:
      'PhytoBox PB-049: pH sol 5.1, lessivage intense. Symptômes de carence Mg: jaunissement des frondes médianes et inférieures sur 12 palmiers.',
    gps: { lat: 5.282, lng: 3.322 },
    reportedBy: 'PhytoBox PB-049',
    reportedAt: '30/04/2026 11:20',
    assignedTo: 'Koné Drissa (PAL-4102)',
    teamName: null,
    photoUrl: null,
    aiRecommendation:
      'MgSO₄ 3kg/palmier, épandage sol dans rayon 1m du stipe. Irriguer si possible. Résultats visibles en 6-8 semaines.',
    product: 'Sulfate de Magnésium (MgSO₄)',
    dose: '3 kg/palmier',
    read: true,
  },
  {
    id: 'ALT-2026-0841',
    parcelId: 'P-B4-015',
    parcelName: 'P-B4-015',
    bloc: 'Bloc B4',
    site: 'Ehania-Toumaguié',
    disease: 'Coelaenomenodera lameensis',
    level: 'élevé',
    source: 'manuel',
    status: 'résolu',
    riskIndex: 45,
    description:
      "Défoliation 35% observée sur bloc. Larves de Coelaenomenodera actives. Seuil d'intervention dépassé (>30%).",
    gps: { lat: 5.274, lng: 3.338 },
    reportedBy: 'Diabaté Issouf (PAL-6234)',
    reportedAt: '28/04/2026 08:30',
    assignedTo: 'Équipe Bio B4',
    teamName: 'Équipe Bio B4',
    photoUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_18f31d2c4-1773545845007.png',
    aiRecommendation:
      'Lâcher Pediobius elasmi: 500 ind/ha. Si >60% défoliation:Bacillus thuringiensis autorisé. Éviter pyréthrinoïdes de synthèse (interdit RSPO).',
    product: 'Pediobius elasmi',
    dose: '500 individus/ha',
    read: true,
  },
  {
    id: 'ALT-2026-0840',
    parcelId: 'P-B7-001',
    parcelName: 'P-B7-001',
    bloc: 'Bloc B7',
    site: 'Ehania-Toumaguié',
    disease: 'Rhynchophorus ferrugineus',
    level: 'élevé',
    source: 'capteur',
    status: 'en_cours',
    riskIndex: 38,
    description:
      'Piège à phéromones PB-052: capture anormale de 8 charançons rouges en 24h (seuil: 3). Inspection visuelle confirmée: galeries dans stipe palmier 0701-044.',
    gps: { lat: 5.3, lng: 3.318 },
    reportedBy: 'PhytoBox PB-052',
    reportedAt: '29/04/2026 07:55',
    assignedTo: 'Koné Drissa (PAL-4102)',
    teamName: 'Équipe Phyto B7',
    photoUrl: null,
    aiRecommendation:
      'Beauveria bassiana intra-stipe 1kg/ha. Renouveler pièges phéromones (1/ha, délai 30j). Inspecter stipes voisins dans 72h. Appliquer 06h-09h ou 16h-18h.',
    product: 'Beauveria bassiana',
    dose: '1 kg/ha',
    read: true,
  },
  {
    id: 'ALT-2026-0839',
    parcelId: 'P-B5-001',
    parcelName: 'P-B5-001',
    bloc: 'Bloc B5',
    site: 'Ehania-Toumaguié',
    disease: 'Carence Bore',
    level: 'modéré',
    source: 'ia',
    status: 'résolu',
    riskIndex: 22,
    description:
      'IA: symptômes de carence bore détectés — dépérissement apex, feuilles crochues sur 7 palmiers. Site Ehania particulièrement exposé (sols lessivés).',
    gps: { lat: 5.282, lng: 3.314 },
    reportedBy: 'PhytoSentinelle IA',
    reportedAt: '27/04/2026 12:00',
    assignedTo: 'Bamba Seydou (PAL-2847)',
    teamName: null,
    photoUrl: null,
    aiRecommendation:
      'Acide borique 0.5kg/palmier — application foliaire ou sol. Site Ehania fréquemment déficitaire en bore.',
    product: 'Acide borique',
    dose: '0.5 kg/palmier',
    read: true,
  },
  {
    id: 'ALT-2026-0838',
    parcelId: 'P-B4-014',
    parcelName: 'P-B4-014',
    bloc: 'Bloc B4',
    site: 'Ehania-Toumaguié',
    disease: 'Surveillance normale',
    level: 'faible',
    source: 'capteur',
    status: 'résolu',
    riskIndex: 32,
    description:
      'Contrôle périodique PhytoBox PB-047: tous paramètres dans les normes. Humidité 72%, temp 27.1°C, pH 6.2. RAS.',
    gps: { lat: 5.274, lng: 3.33 },
    reportedBy: 'PhytoBox PB-047',
    reportedAt: '26/04/2026 06:00',
    assignedTo: null,
    teamName: null,
    photoUrl: null,
    aiRecommendation: null,
    product: null,
    dose: null,
    read: true,
  },
  {
    id: 'ALT-2026-0837',
    parcelId: 'P-B5-003',
    parcelName: 'P-B5-003',
    bloc: 'Bloc B5',
    site: 'Ehania-Toumaguié',
    disease: 'Cercospora elaeidis',
    level: 'modéré',
    source: 'manuel',
    status: 'assigné',
    riskIndex: 41,
    description:
      "Taches foliaires caractéristiques de Cercospora sur 9 palmiers. Lésions elliptiques jaune-orangé sur folioles. Taux d'infection estimé à 18%.",
    gps: { lat: 5.282, lng: 3.334 },
    reportedBy: "N'Goran Aimé (PAL-7821)",
    reportedAt: '25/04/2026 15:10',
    assignedTo: 'Équipe Phyto B5',
    teamName: 'Équipe Phyto B5',
    photoUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_198d46321-1777690597795.png',
    aiRecommendation: 'Traitement fongicide cuivrique. Améliorer drainage. Surveiller propagation.',
    product: 'Bouillie bordelaise (Cuivre)',
    dose: '3 L/ha',
    read: true,
  },
  {
    id: 'ALT-2026-0836',
    parcelId: 'P-B7-002',
    parcelName: 'P-B7-002',
    bloc: 'Bloc B7',
    site: 'Ehania-Toumaguié',
    disease: 'Surveillance normale',
    level: 'faible',
    source: 'capteur',
    status: 'résolu',
    riskIndex: 21,
    description: 'Relevé capteur hebdomadaire. Paramètres optimaux. Aucune anomalie détectée.',
    gps: { lat: 5.3, lng: 3.334 },
    reportedBy: 'PhytoBox PB-052',
    reportedAt: '24/04/2026 06:00',
    assignedTo: null,
    teamName: null,
    photoUrl: null,
    aiRecommendation: null,
    product: null,
    dose: null,
    read: true,
  },
];

const DISEASE_OPTIONS = [
  'Toutes les maladies',
  'Ganoderma boninense',
  'Phytophthora palmivora',
  'Fusarium oxysporum',
  'Rhynchophorus ferrugineus',
  'Coelaenomenodera lameensis',
  'Cercospora elaeidis',
  'Carence Magnésium',
  'Carence Bore',
  'Surveillance normale',
];

const BLOC_OPTIONS = ['Tous les blocs', 'Bloc B4', 'Bloc B5', 'Bloc B6', 'Bloc B7'];

const ITEMS_PER_PAGE = 8;

export default function AlertsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [diseaseFilter, setDiseaseFilter] = useState<string>('Toutes les maladies');
  const [blocFilter, setBlocFilter] = useState<string>('Tous les blocs');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [sortBy, setSortBy] = useState<'date' | 'risk' | 'level'>('date');

  const unreadCount = useMemo(() => alerts.filter((a) => !a.read).length, [alerts]);

  const filteredAlerts = useMemo(() => {
    let result = [...alerts];

    if (searchQuery.trim()) {
      const q = searchQuery
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      result = result.filter(
        (a) =>
          a.parcelName.toLowerCase().includes(q) ||
          a.disease
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(q) ||
          a.bloc.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.description
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(q)
      );
    }

    if (levelFilter !== 'all') {
      result = result.filter((a) => a.level === levelFilter);
    }

    if (sourceFilter !== 'all') {
      result = result.filter((a) => a.source === sourceFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (diseaseFilter !== 'Toutes les maladies') {
      result = result.filter((a) => a.disease === diseaseFilter);
    }

    if (blocFilter !== 'Tous les blocs') {
      result = result.filter((a) => a.bloc === blocFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'risk') return b.riskIndex - a.riskIndex;
      if (sortBy === 'level') {
        const order: Record<AlertLevel, number> = { critique: 0, élevé: 1, modéré: 2, faible: 3 };
        return order[a.level] - order[b.level];
      }
      return (
        new Date(b.reportedAt.split(' ')[0].split('/').reverse().join('-')).getTime() -
        new Date(a.reportedAt.split(' ')[0].split('/').reverse().join('-')).getTime()
      );
    });

    return result;
  }, [
    alerts,
    searchQuery,
    levelFilter,
    sourceFilter,
    statusFilter,
    diseaseFilter,
    blocFilter,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleMarkRead = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, read: true } : a)));
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleStatusChange = (alertId: string, newStatus: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a)));
  };

  const activeFiltersCount = [
    levelFilter !== 'all',
    sourceFilter !== 'all',
    statusFilter !== 'all',
    diseaseFilter !== 'Toutes les maladies',
    blocFilter !== 'Tous les blocs',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setLevelFilter('all');
    setSourceFilter('all');
    setStatusFilter('all');
    setDiseaseFilter('Toutes les maladies');
    setBlocFilter('Tous les blocs');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFBFC] overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 pt-4 pb-3"
        style={{
          background: '#ffffff',
          borderBottom: '2px solid #009E60',
          boxShadow: '0 2px 8px rgba(0,158,96,0.1)',
        }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: '#fef2f2',
                border: '1px solid #ff4444',
              }}
            >
              <Bell size={17} style={{ color: '#ff4444' }} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none" style={{ color: '#1a1a1a' }}>
                Alertes Phytosanitaires
              </h1>
              <p className="text-[11px] mt-0.5" style={{ color: '#5a6b5f' }}>
                Site Ehania-Toumaguié · Bloc B4–B7
              </p>
            </div>
            {unreadCount > 0 && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full font-tabular"
                style={{
                  background: '#fef2f2',
                  color: '#ff4444',
                  border: '1px solid #ff4444',
                }}
              >
                {unreadCount} non lues
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[#f0fdf4]"
                style={{ color: '#009E60', border: '1px solid #d4e0d8' }}
                title="Tout marquer comme lu"
              >
                <CheckCheck size={13} />
                <span className="hidden sm:inline">Tout lire</span>
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #009E60 0%, #007A4A 100%)',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 158, 96, 0.2)',
              }}
            >
              <Plus size={14} />
              <span>Signaler</span>
            </button>
          </div>
        </div>

        {/* KPI summary row */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            {
              label: 'Critiques',
              value: alerts.filter((a) => a.level === 'critique').length,
              color: '#ff4444',
              bg: '#fef2f2',
              border: '#fecaca',
              filter: () => setLevelFilter('critique'),
              active: levelFilter === 'critique',
            },
            {
              label: 'Élevées',
              value: alerts.filter((a) => a.level === 'élevé').length,
              color: '#F77F00',
              bg: '#fef3c7',
              border: '#fcd34d',
              filter: () => setLevelFilter('élevé'),
              active: levelFilter === 'élevé',
            },
            {
              label: 'Non résolues',
              value: alerts.filter((a) => a.status !== 'résolu').length,
              color: '#009E60',
              bg: '#f0fdf4',
              border: '#86efac',
              filter: () => setStatusFilter('nouveau'),
              active: statusFilter === 'nouveau',
            },
            {
              label: 'Résolues',
              value: alerts.filter((a) => a.status === 'résolu').length,
              color: '#007A4A',
              bg: '#dcfce7',
              border: '#bbf7d0',
              filter: () => setStatusFilter('résolu'),
              active: statusFilter === 'résolu',
            },
          ].map((kpi) => (
            <button
              key={`kpi-${kpi.label}`}
              onClick={() => {
                kpi.filter();
                setCurrentPage(1);
              }}
              className="rounded-xl p-2 text-center transition-all hover:opacity-90 active:scale-95"
              style={{
                background: kpi.active ? `${kpi.color}15` : kpi.bg,
                border: `1px solid ${kpi.active ? kpi.color : kpi.border}`,
              }}
            >
              <div className="text-lg font-bold font-tabular" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-[9px] leading-tight" style={{ color: '#5a6b5f' }}>{kpi.label}</div>
            </button>
          ))}
        </div>

        {/* Search + filter toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6b5f]"
            />
            <input
              type="text"
              placeholder="Rechercher parcelle, maladie, ID…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white border border-[#d4e0d8] focus:outline-none focus:ring-1 focus:ring-[#009E60]/40 focus:border-[#009E60] transition-colors"
              style={{ color: '#1a1a1a' }}
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6b5f] hover:text-[#1a1a1a]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background:
                showFilters || activeFiltersCount > 0
                  ? '#f0fdf4'
                  : '#ffffff',
              border: `1px solid ${showFilters || activeFiltersCount > 0 ? '#009E60' : '#d4e0d8'}`,
              color: showFilters || activeFiltersCount > 0 ? '#009E60' : '#5a6b5f',
            }}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filtres</span>
            {activeFiltersCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: '#009E60', color: '#ffffff' }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'risk' | 'level')}
              className="appearance-none px-3 py-2 pr-7 rounded-xl text-sm bg-white border border-[#d4e0d8] text-[#5a6b5f] focus:outline-none focus:border-[#009E60] transition-colors cursor-pointer"
              aria-label="Trier par"
            >
              <option value="date">Date</option>
              <option value="risk">Risque</option>
              <option value="level">Niveau</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5a6b5f] pointer-events-none"
            />
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div
            className="mt-3 p-3 rounded-xl space-y-3 fade-in"
            style={{
              background: '#f8faf9',
              border: '1px solid #d4e0d8',
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Level filter */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#5a6b5f' }}>
                  Niveau de risque
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: 'all', label: 'Tous', color: '#5a6b5f' },
                    { value: 'critique', label: 'Critique', color: '#ff4444' },
                    { value: 'élevé', label: 'Élevé', color: '#F77F00' },
                    { value: 'modéré', label: 'Modéré', color: '#009E60' },
                    { value: 'faible', label: 'Faible', color: '#007A4A' },
                  ].map((opt) => (
                    <button
                      key={`level-${opt.value}`}
                      onClick={() => {
                        setLevelFilter(opt.value);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                      style={{
                        background:
                          levelFilter === opt.value ? `${opt.color}15` : '#ffffff',
                        border: `1px solid ${levelFilter === opt.value ? opt.color : '#d4e0d8'}`,
                        color: levelFilter === opt.value ? opt.color : '#5a6b5f',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source filter */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#5a6b5f' }}>
                  Source
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: 'all', label: 'Toutes', icon: <Filter size={10} /> },
                    { value: 'capteur', label: 'Capteur', icon: <Activity size={10} /> },
                    { value: 'manuel', label: 'Manuel', icon: <User size={10} /> },
                    { value: 'ia', label: 'IA', icon: <Bot size={10} /> },
                  ].map((opt) => (
                    <button
                      key={`source-${opt.value}`}
                      onClick={() => {
                        setSourceFilter(opt.value);
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                      style={{
                        background:
                          sourceFilter === opt.value
                            ? '#f0fdf4'
                            : '#ffffff',
                        border: `1px solid ${sourceFilter === opt.value ? '#009E60' : '#d4e0d8'}`,
                        color: sourceFilter === opt.value ? '#009E60' : '#5a6b5f',
                      }}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status filter */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#5a6b5f' }}>
                  Statut
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: 'all', label: 'Tous' },
                    { value: 'nouveau', label: 'Nouveau' },
                    { value: 'assigné', label: 'Assigné' },
                    { value: 'en_cours', label: 'En cours' },
                    { value: 'résolu', label: 'Résolu' },
                  ].map((opt) => (
                    <button
                      key={`status-${opt.value}`}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                      style={{
                        background:
                          statusFilter === opt.value
                            ? '#f0fdf4'
                            : '#ffffff',
                        border: `1px solid ${statusFilter === opt.value ? '#009E60' : '#d4e0d8'}`,
                        color: statusFilter === opt.value ? '#009E60' : '#5a6b5f',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Disease filter */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#5a6b5f' }}>
                  Maladie
                </label>
                <div className="relative">
                  <select
                    value={diseaseFilter}
                    onChange={(e) => {
                      setDiseaseFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none px-3 py-2 pr-7 rounded-xl text-xs bg-white border border-[#d4e0d8] focus:outline-none focus:border-[#009E60] transition-colors"
                    style={{ color: '#1a1a1a' }}
                  >
                    {DISEASE_OPTIONS.map((d) => (
                      <option key={`disease-opt-${d}`} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={11}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5a6b5f] pointer-events-none"
                  />
                </div>
              </div>

              {/* Bloc filter */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#5a6b5f' }}>
                  Bloc
                </label>
                <div className="relative">
                  <select
                    value={blocFilter}
                    onChange={(e) => {
                      setBlocFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none px-3 py-2 pr-7 rounded-xl text-xs bg-white border border-[#d4e0d8] focus:outline-none focus:border-[#009E60] transition-colors"
                    style={{ color: '#1a1a1a' }}
                  >
                    {BLOC_OPTIONS.map((b) => (
                      <option key={`bloc-opt-${b}`} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={11}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-[#5a6b5f] hover:text-[#1a1a1a] transition-colors"
              >
                <X size={12} />
                Effacer tous les filtres ({activeFiltersCount})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="text-xs text-muted-foreground font-tabular">
          {filteredAlerts.length} alerte{filteredAlerts.length !== 1 ? 's' : ''}
          {activeFiltersCount > 0 && <span className="text-primary ml-1">filtrées</span>}
        </span>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw size={11} />
          <span>02/05/2026 02:31</span>
        </button>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto scrollbar-dark px-4 py-3 space-y-2.5 pb-4">
        {paginatedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.12)',
              }}
            >
              <Bell size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Aucune alerte trouvée</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Aucune alerte ne correspond à vos critères de filtrage. Modifiez les filtres ou
              signalez un nouveau problème.
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                }}
              >
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          paginatedAlerts.map((alert) => (
            <AlertCard
              key={`alert-${alert.id}`}
              alert={alert}
              onClick={() => {
                setSelectedAlert(alert);
                if (!alert.read) handleMarkRead(alert.id);
              }}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-3"
          style={{ borderTop: '1px solid rgba(34, 197, 94, 0.08)' }}
        >
          <span className="text-xs text-muted-foreground font-tabular">
            Page {currentPage} / {totalPages} · {filteredAlerts.length} résultats
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6b9b74',
              }}
            >
              ← Préc.
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background:
                      currentPage === page ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${currentPage === page ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: currentPage === page ? '#22c55e' : '#6b9b74',
                  }}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6b9b74',
              }}
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {selectedAlert && (
        <AlertDetailDrawer
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Create alert modal */}
      {showCreateModal && (
        <CreateAlertModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newAlert) => {
            setAlerts((prev) => [newAlert, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
