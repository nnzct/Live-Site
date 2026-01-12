
export interface User {
  nickname: string;
  isAdmin: boolean;
}

export interface Hotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string;
  type: 'info' | 'encounter';
  content: string; // Message for info, story for encounter
  choices?: EncounterChoice[];
}

export interface EncounterChoice {
  id: string;
  text: string;
  response: string;
}

export interface Zone {
  id: string;
  name: string;
  imageUrl: string;
  hotspots: Hotspot[];
}

export interface PlanetMetadata {
  formationTime: string;
  orbit: string;
  satellites: number;
  gravity: string;
  diameter: string;
  landSeaRatio: string;
  geology: string;
  atmosphere: { o2: number; n2: number; other: string };
  internalStructure: string;
  rotationPeriod: string;
  revolutionPeriod: string;
  circulationSystem: string;
}

export interface Stage {
  id: string;
  name: string;
  code: string;
  overview: string;
  metadata: PlanetMetadata;
  zones: Zone[];
  isPublished: boolean;
  createdAt: number;
}

export interface ExplorationLog {
  id: string;
  stageId: string;
  nickname: string;
  content: string;
  timestamp: number;
}
