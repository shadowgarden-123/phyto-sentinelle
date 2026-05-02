// PhytoBox PALMCI — Moteur d'analyse des capteurs IoT

export interface SensorReading {
  temperature_air: number;
  humidite_air: number;
  humidite_sol: number;
  cov: number;
  alcool: number;
  vibration: number;
  frequence: number;
  batterie?: number;
  signal?: number;
  timestamp?: number;
}

export interface DiseaseAnalysis {
  maladie: string;
  maladieCle: string;
  icon: string;
  probabilite: number;
  scoreGlobal: number;
  niveauUrgence: 'normal' | 'modéré' | 'élevé' | 'critique';
  color: string;
  traitement: string;
  ecologique: boolean;
  features: Record<string, number>;
  allScores: Record<string, number>;
  timestamp: number;
}

export const DISEASES = {
  ganoderma: {
    label: 'Ganoderma boninense',
    icon: '🍄',
    color: '#8B5CF6',
    traitement: 'Trichoderma harzianum + drainage amélioré',
    ecologique: true,
  },
  phytophthora: {
    label: 'Phytophthora palmivora',
    icon: '💧',
    color: '#06b6d4',
    traitement: 'Bouillie bordelaise 4L/ha + drainage urgent',
    ecologique: true,
  },
  fusariose: {
    label: 'Fusarium oxysporum',
    icon: '🌿',
    color: '#F59820',
    traitement: 'Propiconazole + mycorrhizes VAM',
    ecologique: false,
  },
  oryctes: {
    label: 'Oryctes rhinoceros',
    icon: '🪲',
    color: '#EF4444',
    traitement: 'Metarhizium anisopliae + pièges phéromones',
    ecologique: true,
  },
  coelaenomenodera: {
    label: 'Coelaenomenodera lameensis',
    icon: '🐛',
    color: '#F97316',
    traitement: 'Pediobius elasmi 500ind/ha + Bt',
    ecologique: true,
  },
  carence_mg: {
    label: 'Carence Magnésium',
    icon: '🌱',
    color: '#22c55e',
    traitement: 'MgSO₄ 3kg/palmier, amendement calcaire',
    ecologique: true,
  },
  jaunissement: {
    label: 'Jaunissement mortel (MLO)',
    icon: '💀',
    color: '#991B1B',
    traitement: 'Abattage + incinération URGENT',
    ecologique: false,
  },
};

export function analyzePalmHealth(data: SensorReading): DiseaseAnalysis {
  const {
    temperature_air = 28,
    humidite_air = 65,
    humidite_sol = 55,
    cov = 200,
    alcool = 80,
    vibration = 0.1,
    frequence = 100,
  } = data;

  // Derived features (0–1 normalized)
  const features: Record<string, number> = {
    stress_global: Math.min(
      1,
      (temperature_air > 32 ? 0.4 : temperature_air > 28 ? 0.2 : 0) +
        (humidite_sol > 70 ? 0.3 : humidite_sol > 80 ? 0.5 : 0) +
        (cov > 400 ? 0.3 : cov > 200 ? 0.1 : 0)
    ),
    activite_biologique: Math.min(1, vibration / 0.5),
    niveau_fermentation: Math.min(1, (alcool / 150) * 0.5 + Math.min(1, cov / 400) * 0.5),
    risque_champignon: Math.min(1, (humidite_sol / 100) * 0.6 + Math.min(1, cov / 400) * 0.4),
    stress_racinaire: humidite_sol > 80 ? 0.8 : humidite_sol > 70 ? 0.5 : 0.2,
    decomposition: Math.min(1, (alcool > 150 ? 0.5 : 0.1) + (cov > 400 ? 0.5 : 0.1)),
    presence_larves: vibration > 0.5 ? 0.9 : vibration > 0.3 ? 0.5 : 0.1,
    stress_thermique: temperature_air > 35 ? 0.9 : temperature_air > 32 ? 0.5 : 0.15,
    acidite_sol: humidite_sol > 75 ? 0.6 : 0.2, // proxy: high moisture → leaching → low pH
  };

  // Scoring per disease
  const scores: Record<string, number> = {
    ganoderma:
      features.risque_champignon * 0.45 +
      features.stress_racinaire * 0.35 +
      (1 - features.activite_biologique) * 0.2,
    phytophthora:
      features.risque_champignon * 0.4 +
      features.stress_racinaire * 0.4 +
      features.acidite_sol * 0.2,
    fusariose:
      features.stress_thermique * 0.35 + (cov > 200 ? 0.35 : 0.1) + features.stress_global * 0.3,
    oryctes: features.presence_larves * 0.7 + features.activite_biologique * 0.3,
    coelaenomenodera:
      features.activite_biologique * 0.35 +
      (humidite_air > 70 ? 0.3 : 0.1) +
      (temperature_air > 28 ? 0.35 : 0.1),
    carence_mg:
      features.acidite_sol * 0.5 +
      (humidite_sol > 70 ? 0.3 : 0.1) +
      (temperature_air > 30 ? 0.2 : 0.1),
    jaunissement:
      features.stress_global * 0.45 + (cov < 200 ? 0.35 : 0) + (temperature_air > 30 ? 0.2 : 0.05),
  };

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const [topKey, topScore] = sorted[0];
  const probability = Math.min(0.97, topScore);
  const scoreGlobal = Math.round(probability * 100);

  let niveauUrgence: DiseaseAnalysis['niveauUrgence'] = 'normal';
  if (scoreGlobal >= 80) niveauUrgence = 'critique';
  else if (scoreGlobal >= 60) niveauUrgence = 'élevé';
  else if (scoreGlobal >= 40) niveauUrgence = 'modéré';

  const disease = DISEASES[topKey as keyof typeof DISEASES];

  return {
    maladie: disease.label,
    maladieCle: topKey,
    icon: disease.icon,
    probabilite: probability,
    scoreGlobal,
    niveauUrgence,
    color: disease.color,
    traitement: disease.traitement,
    ecologique: disease.ecologique,
    features,
    allScores: Object.fromEntries(sorted.map(([k, v]) => [k, Math.round(v * 100)])),
    timestamp: Date.now(),
  };
}

export function simulateSensorReading(): SensorReading {
  return {
    temperature_air: 27 + Math.random() * 9,
    humidite_air: 58 + Math.random() * 28,
    humidite_sol: 42 + Math.random() * 40,
    cov: 120 + Math.random() * 380,
    alcool: 40 + Math.random() * 160,
    vibration: Math.random() * 0.65,
    frequence: 75 + Math.random() * 130,
    batterie: 60 + Math.random() * 40,
    signal: -92 + Math.random() * 45,
    timestamp: Date.now(),
  };
}

export const PHYTOBOX_STATIONS = [
  { id: 'PB-047', lat: 5.274, lng: 3.314, parcel: 'P-B4-012', online: true },
  { id: 'PB-048', lat: 5.274, lng: 3.322, parcel: 'P-B4-015', online: true },
  { id: 'PB-049', lat: 5.282, lng: 3.314, parcel: 'P-B5-001', online: true },
  { id: 'PB-050', lat: 5.29, lng: 3.316, parcel: 'P-B6-007', online: false },
  { id: 'PB-051', lat: 5.291, lng: 3.328, parcel: 'P-B6-008', online: true },
  { id: 'PB-052', lat: 5.3, lng: 3.318, parcel: 'P-B7-001', online: true },
];
