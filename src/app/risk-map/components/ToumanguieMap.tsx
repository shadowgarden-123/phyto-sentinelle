'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import geoData from '@/lib/toumanguieData.geojson';

// Icônes personnalisées selon le statut - PALMCI Theme
const getIcon = (status: string) => {
  const colors = {
    critique: '#ff4444',
    orange: '#F77F00',
    sain: '#009E60',
    warning: '#F77F00',
    normal: '#009E60',
  };

  const color = colors[status as keyof typeof colors] || '#009E60';
  const size = status === 'critique' ? 12 : status === 'orange' ? 10 : 8;

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size * 2}px;
      height: ${size * 2}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
  });
};

// Style des parcelles (polygones) - PALMCI Theme
const parcelleStyle = (feature: any) => {
  const status = feature.properties?.status;
  const colors = {
    critique: { fill: 'rgba(255,68,68,0.2)', stroke: '#ff4444' },
    warning: { fill: 'rgba(247,127,0,0.2)', stroke: '#F77F00' },
    normal: { fill: 'rgba(0,158,96,0.15)', stroke: '#009E60' },
  };
  const style = colors[status as keyof typeof colors] || colors.normal;

  return {
    fillColor: style.fill,
    color: style.stroke,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  };
};

// Popup pour les sentinelles (points)
const SentinellePopup = ({ properties }: { properties: any }) => (
  <div className="p-2 min-w-[200px]">
    <h3 className="font-bold text-sm mb-1">{properties.id}</h3>
    <p className="text-xs text-muted-foreground mb-2">{properties.parcelle}</p>

    {properties.status === 'critique' && (
      <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium mb-2">
        ⚠️ CRITIQUE — {properties.maladie_suspectee}
      </div>
    )}

    {properties.status === 'orange' && (
      <div className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium mb-2">
        ⚡ Vigilance
      </div>
    )}

    {properties.status === 'sain' && (
      <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium mb-2">
        ✅ Sain
      </div>
    )}

    <div className="space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Risk Index:</span>
        <span className="font-mono font-bold" style={{ color: properties.icon_color }}>
          {properties.risk_index}%
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">COV:</span>
        <span className="font-mono">{properties.cov_ppm} ppm</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Acoustique:</span>
        <span className="font-mono">{properties.acoustique}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Humidité sol:</span>
        <span className="font-mono">{properties.humidite_sol}%</span>
      </div>
    </div>

    {properties.note && (
      <p className="text-[10px] text-muted-foreground mt-2 italic">{properties.note}</p>
    )}
  </div>
);

// Popup pour les parcelles
const ParcellePopup = ({ feature }: { feature: any }) => (
  <div className="p-2 min-w-[180px]">
    <h3 className="font-bold text-sm mb-1">{feature.properties.nom}</h3>
    <p className="text-xs text-muted-foreground mb-2">{feature.properties.id}</p>

    <div className="space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Superficie:</span>
        <span className="font-mono">{feature.properties.superficie_ha} ha</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Palmiers:</span>
        <span className="font-mono">{feature.properties.nb_palmiers}</span>
      </div>
    </div>
  </div>
);

export default function ToumanguieMap() {
  // Centre de la zone Toumanguié (moyenne des coordonnées)
  const center: [number, number] = [5.358, -3.386];

  // Séparer points (sentinelles) et polygones (parcelles)
  const sentinelles = geoData.features.filter((f: any) => f.properties?.type === 'sentinelle');
  const parcelles = geoData.features.filter((f: any) => f.properties?.type === 'parcelle');

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ background: '#e8ede9' }}
      >
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="Google Earth (Satellite)">
            <TileLayer
              attribution='&copy; Google'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Plan (OSM)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Parcelles (polygones) */}
        {parcelles.map((feature: any, idx: number) => (
          <GeoJSON
            key={`parcelle-${idx}`}
            data={feature}
            style={parcelleStyle}
          >
            <Popup>
              <ParcellePopup feature={feature} />
            </Popup>
          </GeoJSON>
        ))}

        {/* Sentinelles (marqueurs) */}
        {sentinelles.map((feature: any, idx: number) => {
          const coords = feature.geometry.coordinates as [number, number];
          const [lng, lat] = coords;

          return (
            <Marker
              key={`sentinelle-${idx}`}
              position={[lat, lng]}
              icon={getIcon(feature.properties.status)}
            >
              <Popup>
                <SentinellePopup properties={feature.properties} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Légende */}
      <div
        className="absolute bottom-4 left-4 p-3 rounded-lg z-[1000]"
        style={{
          background: '#ffffff',
          border: '1px solid #d4e0d8',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h4 className="text-xs font-semibold mb-2 text-[#1a1a1a]">Légende</h4>
        <div className="space-y-1.5 text-[10px] text-[#5a6b5f]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff4444] border-2 border-white shadow-sm"></span>
            <span>Alerte critique</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F77F00] border-2 border-white shadow-sm"></span>
            <span>Vigilance orange</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#009E60] border-2 border-white shadow-sm"></span>
            <span>Sentinelle saine</span>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div
        className="absolute top-4 right-4 p-3 rounded-lg z-[1000]"
        style={{
          background: '#ffffff',
          border: '1px solid #d4e0d8',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h4 className="text-xs font-semibold mb-2 text-[#1a1a1a]">Toumanguié</h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-[#ff4444]">5</div>
            <div className="text-[9px] text-[#5a6b5f]">Critiques</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#F77F00]">8</div>
            <div className="text-[9px] text-[#5a6b5f]">Orange</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#009E60]">8</div>
            <div className="text-[9px] text-[#5a6b5f]">Sains</div>
          </div>
        </div>
      </div>
    </div>
  );
}
