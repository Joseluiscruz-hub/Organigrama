
export type RoleKey = 'GERENTE' | 'COORD' | 'MONTACARGUISTA' | 'AUXILIAR' | 'AMARRADOR';

export interface RoleConfig {
  title: string;
  color: string; // Tailwind class for bg
  textColor: string; // Tailwind class for text
  iconName: string;
  level: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  roleKey: RoleKey;
  blockId: number;
  performance: number;
  years: number;
  status: 'Activo' | 'Ausente';
  email: string;
  phone: string;
}

// Objetivos corporativos
export interface TeamObjectives {
  pdf: number;           // 100%
  tiempoEstancia: string; // "00:55"
  tiempoPlanta: string;   // "00:55"
  tarimas: number;        // 1579
  seguridad: number;      // 5
}

export interface TeamMetrics {
  // Métricas principales (basadas en la imagen corporativa)
  pdf: number;              // Porcentaje de eficiencia (ej: 105.51%)
  pdfScore: number;         // Score normalizado (ej: 1.06)
  tiempoEstancia: string;   // Tiempo estancia (ej: "00:54")
  tiempoPlanta: string;     // Tiempo de planta (ej: "00:49")
  tarimas: number;          // Tarimas promedio (ej: 1530)
  tarimasScore: number;     // Score normalizado
  seguridad: number;        // Score seguridad (0-5)
  tarjetasStop: number;     // Cantidad de incidentes
  
  // Cálculos
  suma: number;             // Suma total de scores
  ranking: number;          // Posición 1-4
  
  // Estados visuales
  isPdfAboveTarget: boolean;
  isTiempoEstanciaGood: boolean;
  isTiempoPlantaGood: boolean;
  isTarimasAboveTarget: boolean;
  
  // Evento crítico
  criticalEvent?: string;
  hasCriticalEvent: boolean;
}

export interface Block {
  id: number;
  name: string;
  // Visual branding for the team
  styles: {
    headerBg: string;
    borderColor: string;
    titleColor: string;
    badge: string;
    progressBar: string;
    teamIcon: string;
    accentColor: string;
    gradientFrom: string;
    gradientTo: string;
  };
  stats: { total: number };
  metrics: TeamMetrics;
  staff: {
    coordinators: Employee[];
    operators: Employee[];
    auxiliaries: Employee[];
    lashers: Employee[];
  };
}

export interface AppData {
  manager: Employee;
  blocks: Block[];
  objectives: TeamObjectives;
  reportMonth: string;
  reportYear: number;
}