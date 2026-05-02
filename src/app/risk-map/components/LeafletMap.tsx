'use client';

import React, { useEffect, useRef, useState } from 'react';
import type * as Leaflet from 'leaflet';
import type { Feature, Geometry } from 'geojson';
import {
  createMockPhytoBoxSensorsFromParcels,
  MOCK_PARCELS_GEOJSON,
  SENSOR_COVERAGE_RADIUS_M,
} from '../lib/mockData';

const PHYTOBOX_MARKERS = createMockPhytoBoxSensorsFromParcels(MOCK_PARCELS_GEOJSON);

interface LeafletMapProps {
  selectedSite: string;
  showKriging: boolean;
  showVariance: boolean;
  showPhytoBox: boolean;
  selectedParcel: string | null;
  onParcelSelect: (id: string) => void;
}

function getRiskColor(risk: number): string {
  if (risk >= 60) return '#ff4444';
  if (risk >= 30) return '#F77F00';
  return '#009E60';
}

type ParcelProps = { id: string; risk: number; name: string; disease: string | null };

export default function LeafletMap({
  selectedSite: _selectedSite,
  showKriging,
  showVariance,
  showPhytoBox,
  selectedParcel,
  onParcelSelect,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);
  const parcelsLayerRef = useRef<Leaflet.GeoJSON | null>(null);
  const phytoboxLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const krigingLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const varianceLayerRef = useRef<Leaflet.LayerGroup | null>(null);
  const selectedParcelRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    selectedParcelRef.current = selectedParcel;
  }, [selectedParcel]);

  useEffect(() => {
    const containerEl = mapRef.current;
    if (!containerEl || mapInstanceRef.current) return;

    let cancelled = false;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      if (cancelled) return;

      leafletRef.current = L;

      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (mapInstanceRef.current) return;
      if (!containerEl.isConnected) return;

      // React StrictMode (dev) can mount/unmount quickly; Leaflet keeps an internal id on the container.
      // Reset it defensively to avoid "Map container is already initialized."
      const container = containerEl as unknown as { innerHTML: string; _leaflet_id?: unknown };
      if (container._leaflet_id) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete container._leaflet_id;
        container.innerHTML = '';
      }

      const map = L.map(containerEl, {
        center: [5.282, -3.326],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      // Base maps
      const googleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '© Google',
        maxZoom: 20,
        className: 'sat-filter', // Optional: CSS filter for sci-fi look
      });

      const darkMatter = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      );

      // Default to Dark Futuristic Map
      darkMatter.addTo(map);

      const baseMaps = {
        'Radar Global (Dark)': darkMatter,
        'Satellite Tactique': googleSat,
      };

      L.control.layers(baseMaps, undefined, { position: 'topleft' }).addTo(map);

      // GeoJSON parcels layer
      const geoLayer = L.geoJSON(MOCK_PARCELS_GEOJSON, {
        style: (feature?: Feature<Geometry, ParcelProps>) => {
          const risk = feature?.properties?.risk ?? 0;
          const color = getRiskColor(risk);
          const isSelected = feature?.properties?.id === selectedParcelRef.current;
          return {
            fillColor: color,
            fillOpacity: isSelected ? 0.55 : 0.35,
            color: color,
            weight: isSelected ? 2.5 : 1.5,
            opacity: 0.9,
          };
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties;
          const riskColor = getRiskColor(props.risk);

          layer.bindTooltip(
            `<div style="font-size:11px;font-weight:700;color:${riskColor};text-shadow:0 0 10px ${riskColor}80;letter-spacing:1px">${props.name}</div>
             <div style="font-size:10px;color:#8ba393;margin-top:2px">Niveau de menace: <span style="color:#fff">${props.risk}%</span></div>
             ${props.disease ? `<div style="font-size:10px;color:#ff4444;font-style:italic;margin-top:2px;border-top:1px solid #ff444440;padding-top:2px">⚠ ${props.disease}</div>` : ''}`,
            { permanent: false, direction: 'top', className: 'futuristic-tooltip' }
          );

          layer.on('click', () => {
            onParcelSelect(props.id);
          });

          layer.on('mouseover', () => {
            const pathLayer = layer as unknown as Leaflet.Path;
            pathLayer.setStyle({
              fillOpacity: 0.6,
              weight: 2.5,
            });
          });

          layer.on('mouseout', () => {
            geoLayer.resetStyle(layer);
          });
        },
      }).addTo(map);

      parcelsLayerRef.current = geoLayer;

      const phytoboxGroup = L.layerGroup();
      phytoboxLayerRef.current = phytoboxGroup;

      const krigingGroup = L.layerGroup();
      krigingLayerRef.current = krigingGroup;

      const varianceGroup = L.layerGroup();
      varianceLayerRef.current = varianceGroup;

      // PhytoBox markers (+ coverage zones)
      PHYTOBOX_MARKERS.forEach((pb) => {
        const markerColor = pb.online ? '#00e5ff' : '#4b5563'; // Cyan for online in dark mode
        const shadowColor = pb.online ? '#00e5ff80' : 'transparent';
        const markerHtml = `
          <div style="
            width:26px;height:26px;border-radius:999px;
            background:${pb.online ? 'rgba(0, 229, 255, 0.15)' : 'rgba(75, 85, 99, 0.2)'};
            border:2px solid ${markerColor};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 15px ${shadowColor}, inset 0 0 10px ${shadowColor};
            backdrop-filter: blur(4px);
          ">
            <div style="width:8px;height:8px;border-radius:999px;background:${markerColor};box-shadow:0 0 8px ${markerColor}"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([pb.lat, pb.lng], { icon });
        marker.bindPopup(`
          <div style="min-width:240px;color:#e2e8f0;font-family:'Space Grotesk', sans-serif">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;border-bottom:1px solid rgba(0,229,255,0.2);padding-bottom:8px">
              <div style="font-weight:700;color:${markerColor};font-size:14px;letter-spacing:1px;text-shadow:0 0 8px ${markerColor}80">SYS-${pb.id}</div>
              <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${pb.online ? '#00e5ff' : '#ef4444'};border:1px solid ${pb.online ? '#00e5ff50' : '#ef444450'};padding:2px 6px;border-radius:4px;background:${pb.online ? '#00e5ff10' : '#ef444410'}">
                ${pb.online ? 'ONLINE' : 'OFFLINE'}
              </div>
            </div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;display:flex;justify-content:space-between">
              <span>Secteur: <span style="color:#fff">${pb.parcel}</span></span>
              <span>Rayon: <span style="color:#00e5ff">${SENSOR_COVERAGE_RADIUS_M}m</span></span>
            </div>
            ${
              pb.online
                ? `
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:12px">
              <div style="text-align:center;background:rgba(0,229,255,0.05);padding:8px 4px;border-radius:6px;border:1px solid rgba(0,229,255,0.2);box-shadow:inset 0 0 10px rgba(0,229,255,0.05)">
                <div style="font-size:15px;font-weight:700;color:#00e5ff;text-shadow:0 0 8px rgba(0,229,255,0.5)">${pb.humidity}%</div>
                <div style="font-size:8px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-top:2px">H2O Sol</div>
              </div>
              <div style="text-align:center;background:rgba(245,152,32,0.05);padding:8px 4px;border-radius:6px;border:1px solid rgba(245,152,32,0.2);box-shadow:inset 0 0 10px rgba(245,152,32,0.05)">
                <div style="font-size:15px;font-weight:700;color:#F59820;text-shadow:0 0 8px rgba(245,152,32,0.5)">${pb.temp}°</div>
                <div style="font-size:8px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-top:2px">Therm</div>
              </div>
              <div style="text-align:center;background:rgba(168,85,247,0.05);padding:8px 4px;border-radius:6px;border:1px solid rgba(168,85,247,0.2);box-shadow:inset 0 0 10px rgba(168,85,247,0.05)">
                <div style="font-size:15px;font-weight:700;color:#a855f7;text-shadow:0 0 8px rgba(168,85,247,0.5)">${pb.ph}</div>
                <div style="font-size:8px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-top:2px">pH Lvl</div>
              </div>
            </div>`
                : '<div style="font-size:11px;color:#ef4444;margin-top:12px;padding:8px;background:rgba(239,68,68,0.1);border:1px dashed rgba(239,68,68,0.4);border-radius:6px;text-align:center;text-transform:uppercase;letter-spacing:1px">Signal Perdu - Diag Requis</div>'
            }
          </div>
        `);

        const coverage = L.circle([pb.lat, pb.lng], {
          radius: SENSOR_COVERAGE_RADIUS_M,
          color: markerColor,
          weight: 1,
          dashArray: '4, 6',
          opacity: 0.5,
          fillColor: markerColor,
          fillOpacity: pb.online ? 0.08 : 0.02,
        });

        phytoboxGroup.addLayer(coverage);
        phytoboxGroup.addLayer(marker);
      });

      // Kriging simulation — colored grid overlay
      const krigingPoints = [
        { lat: 5.274, lng: 3.31, risk: 78 },
        { lat: 5.274, lng: 3.322, risk: 54 },
        { lat: 5.274, lng: 3.334, risk: 32 },
        { lat: 5.274, lng: 3.342, risk: 45 },
        { lat: 5.282, lng: 3.31, risk: 22 },
        { lat: 5.282, lng: 3.326, risk: 48 },
        { lat: 5.29, lng: 3.316, risk: 82 },
        { lat: 5.291, lng: 3.328, risk: 68 },
        { lat: 5.291, lng: 3.338, risk: 71 },
        { lat: 5.3, lng: 3.318, risk: 15 },
        { lat: 5.3, lng: 3.334, risk: 21 },
      ];

      // Simple kriging visualization via small circles
      krigingPoints.forEach((pt) => {
        const color = getRiskColor(pt.risk);
        const dot = L.circleMarker([pt.lat, pt.lng], {
          radius: 18,
          fillColor: color,
          fillOpacity: 0.18,
          color: color,
          weight: 0.5,
          opacity: 0.3,
        });
        krigingGroup.addLayer(dot);

        const variance = L.circleMarker([pt.lat, pt.lng], {
          radius: 34,
          fillColor: '#009E60',
          fillOpacity: 0.06,
          color: '#009E60',
          weight: 0.5,
          opacity: 0.2,
        });
        varianceGroup.addLayer(variance);
      });

      if (showPhytoBox) phytoboxGroup.addTo(map);
      if (showKriging) krigingGroup.addTo(map);
      if (showVariance) varianceGroup.addTo(map);

      // Attribution
      L.control.attribution({ prefix: false }).addTo(map);

      mapInstanceRef.current = map;

      // Fix Leaflet tile loading glitch on React mount
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      setMapReady(true);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      const container = containerEl as unknown as { innerHTML: string; _leaflet_id?: unknown };
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete container._leaflet_id;
      container.innerHTML = '';
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = phytoboxLayerRef.current;
    if (!map || !group) return;
    if (showPhytoBox) group.addTo(map);
    else group.remove();
  }, [showPhytoBox]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = krigingLayerRef.current;
    if (!map || !group) return;
    if (showKriging) group.addTo(map);
    else group.remove();
  }, [showKriging]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = varianceLayerRef.current;
    if (!map || !group) return;
    if (showVariance) group.addTo(map);
    else group.remove();
  }, [showVariance]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const parcelsLayer = parcelsLayerRef.current;
    if (!map || !parcelsLayer) return;

    parcelsLayer.setStyle((feature?: Feature<Geometry, ParcelProps>) => {
      const risk = feature?.properties?.risk ?? 0;
      const color = getRiskColor(risk);
      const isSelected = feature?.properties?.id === selectedParcelRef.current;
      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.55 : 0.35,
        color: color,
        weight: isSelected ? 2.5 : 1.5,
        opacity: 0.9,
      };
    });

    if (!selectedParcel) return;
    type FeatureLayer = Leaflet.Layer & {
      feature?: Feature<Geometry, ParcelProps>;
      getBounds?: () => Leaflet.LatLngBounds;
    };
    parcelsLayer.eachLayer((layer: FeatureLayer) => {
      const id = layer.feature?.properties?.id;
      const bounds = layer.getBounds?.();
      if (id === selectedParcel && bounds)
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
    });
  }, [selectedParcel]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full z-0" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAFBFC] z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#009E60] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#5a6b5f]">Initialisation de la carte…</span>
          </div>
        </div>
      )}
    </div>
  );
}
