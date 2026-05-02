// PhytoBox PALMCI — Base de données des ravageurs du palmier à huile
// Système: IA capteurs + règles agronomiques

export interface CapteurSeuils {
  normale?: string;
  elevee?: string;
  faible?: string;
  moyen?: string;
  moyenne?: string;
}

export interface SeuilsConfig {
  temperature_air: CapteurSeuils;
  humidite_air: CapteurSeuils;
  COV: CapteurSeuils;
  alcool: CapteurSeuils;
  vibration: CapteurSeuils;
}

export interface SignatureCapteur {
  vibration?: 'faible' | 'moyenne' | 'elevee';
  frequence?: 'reguliere' | 'irreguliere';
  alcool?: 'faible' | 'eleve';
  COV?: 'faible' | 'moyen' | 'eleve';
  temperature_air?: 'normale' | 'elevee';
  humidite_air?: 'normale' | 'elevee';
}

export interface Interpretation {
  larves_dans_tronc?: boolean;
  degradation_interne?: boolean;
  attaque_surface?: boolean;
  detection_indirecte?: boolean;
  attaque_actuelle?: string;
  attaque_future?: string;
}

export interface DetectionConfig {
  capteur_principal?: string;
  confirmation?: string[];
  type?: string;
  logique?: string;
  micro_piezo?: string;
  SHT31?: string;
  prediction?: boolean;
}

export interface Traitement {
  produit: string;
  type: 'biologique' | 'biocontrôle' | 'naturel' | 'mecanique' | 'chimique';
  efficacite: number;
  risque_env: number;
}

export interface Ravageur {
  nom: string;
  type: string;
  signes_terrain: string[] | { chenilles?: string[]; papillons?: string[] };
  signatures_capteurs: SignatureCapteur | { chenilles?: SignatureCapteur; papillons?: SignatureCapteur };
  interpretation: Interpretation;
  detection: DetectionConfig;
  traitements: Traitement[];
  stades?: string[];
}

export interface SortieFormat {
  ravageur_detecte: string;
  probabilite: number;
  type_detection: 'directe' | 'indirecte';
  traitement_recommande: string;
  risque_environnement: number;
}

export const SEUILS: SeuilsConfig = {
  temperature_air: { normale: '24-32', elevee: '>32' },
  humidite_air: { normale: '50-80', elevee: '>80' },
  COV: { faible: '<200', moyen: '200-400' },
  alcool: { faible: '<150', elevee: '>150' },
  vibration: { faible: '<0.2', moyenne: '0.2-0.5', elevee: '>0.5' },
};

export const CAPTEURS_UTILISES = {
  SHT31: ['temperature_air', 'humidite_air'],
  MQ135: ['COV'],
  MQ3: ['alcool'],
  micro_piezo: ['vibration', 'frequence'],
};

export const RAVAGEURS: Ravageur[] = [
  // ================= CHARANÇON =================
  {
    nom: 'Charançon du palmier',
    type: 'insecte foreur interne',
    signes_terrain: [
      'trous dans tronc',
      'écoulement liquide',
      'odeur fermentation',
      'affaiblissement du palmier',
    ],
    signatures_capteurs: {
      vibration: 'elevee',
      frequence: 'irreguliere',
      alcool: 'eleve',
      COV: 'moyen',
    },
    interpretation: {
      larves_dans_tronc: true,
      degradation_interne: true,
    },
    detection: {
      capteur_principal: 'micro_piezo',
      confirmation: ['MQ3', 'MQ135'],
    },
    traitements: [
      {
        produit: 'Beauveria bassiana',
        type: 'biologique',
        efficacite: 0.8,
        risque_env: 0.05,
      },
      {
        produit: 'pièges phéromones',
        type: 'biocontrôle',
        efficacite: 0.75,
        risque_env: 0.0,
      },
    ],
  },

  // ================= COELAENOMENODERA =================
  {
    nom: 'Coelaenomenodera',
    type: 'mineuse des feuilles',
    signes_terrain: [
      'feuilles jaunies',
      'taches brunes',
      'galeries dans feuilles',
    ],
    signatures_capteurs: {
      temperature_air: 'elevee',
      humidite_air: 'elevee',
      vibration: 'faible',
      COV: 'faible',
    },
    interpretation: {
      attaque_surface: true,
      detection_indirecte: true,
    },
    detection: {
      type: 'indirecte',
      logique: 'conditions climatiques favorables + stress',
    },
    traitements: [
      {
        produit: 'Bacillus thuringiensis',
        type: 'biologique',
        efficacite: 0.85,
        risque_env: 0.02,
      },
    ],
  },

  // ================= LÉPIDOPTÈRES =================
  {
    nom: 'Lépidoptères (papillons + chenilles)',
    type: 'cycle complet',
    stades: ['oeuf', 'chenille (danger)', 'chrysalide', 'papillon'],
    signes_terrain: {
      chenilles: ['feuilles mangées', 'défoliation', 'excréments'],
      papillons: ['présence autour du palmier', 'ponte sur feuilles'],
    },
    signatures_capteurs: {
      chenilles: {
        vibration: 'moyenne',
        frequence: 'irreguliere',
        humidite_air: 'elevee',
        temperature_air: 'elevee',
      },
      papillons: {
        vibration: 'faible',
      },
    },
    interpretation: {
      attaque_actuelle: 'vibration + climat',
      attaque_future: 'conditions reproduction favorables',
    },
    detection: {
      micro_piezo: 'détecte larves',
      SHT31: 'détecte climat reproduction',
      prediction: true,
    },
    traitements: [
      {
        produit: 'Bacillus thuringiensis (Bt)',
        type: 'biologique',
        efficacite: 0.9,
        risque_env: 0.02,
      },
      {
        produit: 'huile de neem',
        type: 'naturel',
        efficacite: 0.7,
        risque_env: 0.1,
      },
      {
        produit: 'pièges lumineux',
        type: 'mecanique',
        efficacite: 0.6,
        risque_env: 0.0,
      },
    ],
  },
];

export const MOTEUR_DECISION = {
  type: 'scoring',
  logique: [
    'analyser vibration (clé principale)',
    'vérifier gaz (alcool/COV)',
    'vérifier climat',
    'associer signatures ravageur',
    'calculer probabilité',
  ],
};

export function createEmptySortie(): SortieFormat {
  return {
    ravageur_detecte: '',
    probabilite: 0.0,
    type_detection: 'directe',
    traitement_recommande: '',
    risque_environnement: 0.0,
  };
}

export function analyzeRavageur(
  sensorData: {
    vibration: number;
    frequence: number;
    alcool: number;
    COV: number;
    temperature_air: number;
    humidite_air: number;
  },
  ravageur: Ravageur
): SortieFormat {
  const sortie = createEmptySortie();
  let score = 0;
  let facteurs = 0;

  const signature = ravageur.signatures_capteurs as SignatureCapteur;

  // Analyse vibration
  if (signature.vibration) {
    facteurs++;
    if (signature.vibration === 'elevee' && sensorData.vibration > 0.5) score += 1;
    else if (signature.vibration === 'moyenne' && sensorData.vibration >= 0.2 && sensorData.vibration <= 0.5) score += 1;
    else if (signature.vibration === 'faible' && sensorData.vibration < 0.2) score += 1;
  }

  // Analyse alcool
  if (signature.alcool) {
    facteurs++;
    if (signature.alcool === 'eleve' && sensorData.alcool > 150) score += 1;
    else if (signature.alcool === 'faible' && sensorData.alcool < 150) score += 1;
  }

  // Analyse COV
  if (signature.COV) {
    facteurs++;
    if (signature.COV === 'moyen' && sensorData.COV >= 200 && sensorData.COV <= 400) score += 1;
    else if (signature.COV === 'faible' && sensorData.COV < 200) score += 1;
  }

  // Analyse température
  if (signature.temperature_air) {
    facteurs++;
    if (signature.temperature_air === 'elevee' && sensorData.temperature_air > 32) score += 1;
    else if (signature.temperature_air === 'normale' && sensorData.temperature_air >= 24 && sensorData.temperature_air <= 32) score += 1;
  }

  // Analyse humidité
  if (signature.humidite_air) {
    facteurs++;
    if (signature.humidite_air === 'elevee' && sensorData.humidite_air > 80) score += 1;
    else if (signature.humidite_air === 'normale' && sensorData.humidite_air >= 50 && sensorData.humidite_air <= 80) score += 1;
  }

  const probabilite = facteurs > 0 ? score / facteurs : 0;

  // Sélection du meilleur traitement
  const meilleurTraitement = ravageur.traitements.reduce((best, current) =>
    current.efficacite > best.efficacite ? current : best
  );

  return {
    ravageur_detecte: ravageur.nom,
    probabilite: Math.min(0.97, probabilite),
    type_detection: ravageur.detection.type === 'indirecte' ? 'indirecte' : 'directe',
    traitement_recommande: meilleurTraitement.produit,
    risque_environnement: meilleurTraitement.risque_env,
  };
}
