export const PALMS_PER_SENSOR = 50;
export const PALMS_PER_HECTARE = 143;

function estimateCoverageRadiusMeters(palmsPerSensor: number) {
  const areaM2 = (palmsPerSensor / PALMS_PER_HECTARE) * 10_000;
  return Math.sqrt(areaM2 / Math.PI);
}

export const SENSOR_COVERAGE_RADIUS_M = Math.max(
  20,
  Math.round(estimateCoverageRadiusMeters(PALMS_PER_SENSOR) / 5) * 5
);

export type GeoJsonPolygon = {
  type: 'Polygon';
  coordinates: number[][][];
};

export type ParcelFeature = {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    risk: number;
    bloc: string;
    disease: string | null;
    palms: number;
  };
  geometry: GeoJsonPolygon;
};

export type ParcelFeatureCollection = {
  type: 'FeatureCollection';
  features: ParcelFeature[];
};

export const MOCK_PARCELS_GEOJSON: ParcelFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'P-B4-012',
        name: 'P-B4-012',
        risk: 78,
        bloc: 'B4',
        disease: 'Ganoderma',
        palms: 156,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.31, 5.27],
            [-3.318, 5.27],
            [-3.318, 5.278],
            [-3.31, 5.278],
            [-3.31, 5.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B4-013',
        name: 'P-B4-013',
        risk: 54,
        bloc: 'B4',
        disease: 'Phytophthora',
        palms: 148,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.318, 5.27],
            [-3.326, 5.27],
            [-3.326, 5.278],
            [-3.318, 5.278],
            [-3.318, 5.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B4-014',
        name: 'P-B4-014',
        risk: 32,
        bloc: 'B4',
        disease: null,
        palms: 162,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.326, 5.27],
            [-3.334, 5.27],
            [-3.334, 5.278],
            [-3.326, 5.278],
            [-3.326, 5.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B4-015',
        name: 'P-B4-015',
        risk: 45,
        bloc: 'B4',
        disease: 'Coelaenomenodera',
        palms: 142,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.334, 5.27],
            [-3.342, 5.27],
            [-3.342, 5.278],
            [-3.334, 5.278],
            [-3.334, 5.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B5-001',
        name: 'P-B5-001',
        risk: 22,
        bloc: 'B5',
        disease: null,
        palms: 171,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.31, 5.278],
            [-3.318, 5.278],
            [-3.318, 5.286],
            [-3.31, 5.286],
            [-3.31, 5.278],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B5-002',
        name: 'P-B5-002',
        risk: 48,
        bloc: 'B5',
        disease: 'Carence Mg',
        palms: 155,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.318, 5.278],
            [-3.326, 5.278],
            [-3.326, 5.286],
            [-3.318, 5.286],
            [-3.318, 5.278],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B5-003',
        name: 'P-B5-003',
        risk: 41,
        bloc: 'B5',
        disease: null,
        palms: 168,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.326, 5.278],
            [-3.342, 5.278],
            [-3.342, 5.286],
            [-3.326, 5.286],
            [-3.326, 5.278],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B6-007',
        name: 'P-B6-007',
        risk: 82,
        bloc: 'B6',
        disease: 'Fusarium',
        palms: 144,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.31, 5.286],
            [-3.322, 5.286],
            [-3.322, 5.296],
            [-3.31, 5.296],
            [-3.31, 5.286],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B6-008',
        name: 'P-B6-008',
        risk: 68,
        bloc: 'B6',
        disease: 'Ganoderma',
        palms: 159,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.322, 5.286],
            [-3.334, 5.286],
            [-3.334, 5.296],
            [-3.322, 5.296],
            [-3.322, 5.286],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B6-009',
        name: 'P-B6-009',
        risk: 71,
        bloc: 'B6',
        disease: 'Phytophthora',
        palms: 147,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.334, 5.286],
            [-3.342, 5.286],
            [-3.342, 5.296],
            [-3.334, 5.296],
            [-3.334, 5.286],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B7-001',
        name: 'P-B7-001',
        risk: 15,
        bloc: 'B7',
        disease: null,
        palms: 180,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.31, 5.296],
            [-3.326, 5.296],
            [-3.326, 5.305],
            [-3.31, 5.305],
            [-3.31, 5.296],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'P-B7-002',
        name: 'P-B7-002',
        risk: 21,
        bloc: 'B7',
        disease: null,
        palms: 173,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.326, 5.296],
            [-3.342, 5.296],
            [-3.342, 5.305],
            [-3.326, 5.305],
            [-3.326, 5.296],
          ],
        ],
      },
    },
  ],
};

export type PhytoboxSensor = {
  id: string;
  lat: number;
  lng: number;
  online: boolean;
  humidity: number;
  temp: number;
  ph: number;
  parcel: string;
  coversPalms: number;
  parcelPalms: number;
  recommendedSensorsInParcel: number;
};

function stableHashInt(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function pointInPolygon(point: [number, number], polygon: [number, number][]) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function generatePointsInParcel(polygon: [number, number][], count: number) {
  const xs = polygon.map((p) => p[0]);
  const ys = polygon.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const marginX = (maxX - minX) * 0.18;
  const marginY = (maxY - minY) * 0.18;
  const startX = minX + marginX;
  const endX = maxX - marginX;
  const startY = minY + marginY;
  const endY = maxY - marginY;

  const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.max(1, Math.ceil(count / cols));

  const dx = cols === 1 ? 0 : (endX - startX) / (cols - 1);
  const dy = rows === 1 ? 0 : (endY - startY) / (rows - 1);

  const points: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = startX + dx * c;
      const py = startY + dy * r;
      if (pointInPolygon([px, py], polygon)) points.push([px, py]);
      if (points.length >= count) return points;
    }
  }

  // Fallback: centroid
  const centroid: [number, number] = [(minX + maxX) / 2, (minY + maxY) / 2];
  while (points.length < count) points.push(centroid);
  return points;
}

export function createMockPhytoBoxSensorsFromParcels(
  parcels: ParcelFeatureCollection,
  startIndex = 47
): PhytoboxSensor[] {
  let seq = startIndex;
  const sensors: PhytoboxSensor[] = [];

  for (const feature of parcels.features) {
    const parcelPalms = feature.properties.palms;
    const recommendedSensorsInParcel = Math.max(1, Math.ceil(parcelPalms / PALMS_PER_SENSOR));
    const ring = feature.geometry.coordinates[0] as [number, number][];
    const points = generatePointsInParcel(ring, recommendedSensorsInParcel);

    points.forEach(([lng, lat], idx) => {
      const id = `PB-${String(seq).padStart(3, '0')}`;
      const hash = stableHashInt(`${feature.properties.id}:${idx}:${id}`);
      const online = hash % 7 !== 0;
      const humidity = online ? 60 + (hash % 30) : 0;
      const temp = online ? Math.round((26 + ((hash >> 3) % 60) / 10) * 10) / 10 : 0;
      const ph = online ? Math.round(((52 + ((hash >> 4) % 18)) / 10) * 10) / 10 : 0;

      sensors.push({
        id,
        lat,
        lng,
        online,
        humidity,
        temp,
        ph,
        parcel: feature.properties.id,
        coversPalms: PALMS_PER_SENSOR,
        parcelPalms,
        recommendedSensorsInParcel,
      });
      seq++;
    });
  }

  return sensors;
}
