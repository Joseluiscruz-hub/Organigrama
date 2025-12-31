
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

export interface TeamMetrics {
  // New specific metrics
  efficiency: number;     // % (0-100)
  adherence: number;      // % (0-100)
  safetyScore: number;    // % (0-100)
  unitsProcessed: number; // Count
  
  // Legacy/Computed for internal logic if needed
  ranking: number;
  criticalEvent?: string; 
  
  // Visual flags
  isEfficiencyGood: boolean;
  isAdherenceGood: boolean;
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
    progressBar: string; // New: specific color for progress bars
    teamIcon: string; // Distinctive icon
  };
  stats: { total: number };
  metrics: TeamMetrics; // Updated metrics
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
}