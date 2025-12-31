import { Injectable } from '@angular/core';
import { AppData, Block, Employee, RoleConfig, RoleKey } from '../types';

@Injectable({ providedIn: 'root' })
export class DataService {
  
  readonly ROLES: Record<RoleKey, RoleConfig> = {
    GERENTE: { title: 'Gerente de Operaciones', color: 'bg-slate-800', textColor: 'text-slate-800', iconName: 'briefcase', level: 1 },
    COORD: { title: 'Coordinador', color: 'bg-indigo-600', textColor: 'text-indigo-600', iconName: 'users', level: 2 },
    MONTACARGUISTA: { title: 'Op. Montacargas', color: 'bg-blue-500', textColor: 'text-blue-500', iconName: 'truck', level: 3 },
    AUXILIAR: { title: 'Aux. Fleteo', color: 'bg-emerald-500', textColor: 'text-emerald-500', iconName: 'package', level: 3 },
    AMARRADOR: { title: 'Amarrador', color: 'bg-orange-500', textColor: 'text-orange-500', iconName: 'anchor', level: 3 },
  };

  // Team configurations
  private readonly TEAMS = [
    { 
      name: 'GLADIADORES', // Azul (Blue)
      headerBg: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      titleColor: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-700',
      progressBar: 'bg-gradient-to-r from-blue-600 to-blue-400',
      teamIcon: 'swords'
    },
    { 
      name: 'ARMAGEDON', // Amarillo (Yellow)
      headerBg: 'bg-yellow-50', 
      borderColor: 'border-yellow-200', 
      titleColor: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-700',
      progressBar: 'bg-gradient-to-r from-yellow-500 to-yellow-400',
      teamIcon: 'flame'
    },
    { 
      name: 'CRACKS', // Rosa (Pink)
      headerBg: 'bg-pink-50', 
      borderColor: 'border-pink-200', 
      titleColor: 'text-pink-700',
      badge: 'bg-pink-100 text-pink-700',
      progressBar: 'bg-gradient-to-r from-pink-500 to-pink-400',
      teamIcon: 'trophy'
    },
    { 
      name: 'X-MEN', // Verde (Green)
      headerBg: 'bg-green-50', 
      borderColor: 'border-green-200', 
      titleColor: 'text-green-700',
      badge: 'bg-green-100 text-green-700',
      progressBar: 'bg-gradient-to-r from-green-600 to-green-400',
      teamIcon: 'crosshair'
    }
  ];

  generateData(): AppData {
    let idCounter = 1;
    const blocks: Block[] = [];

    const createEmployee = (roleKey: RoleKey, blockId: number, specificRoleTitle: string | null = null): Employee => {
      const role = this.ROLES[roleKey];
      const firstNames = ['Juan', 'Ana', 'Carlos', 'Luisa', 'Pedro', 'Maria', 'Jose', 'Elena', 'Roberto', 'Sofia', 'Diego', 'Valentina'];
      const lastNames = ['Perez', 'Gomez', 'Lopez', 'Diaz', 'Martinez', 'Ruiz', 'Silva', 'Santos', 'Vega', 'Mendoza', 'Castillo'];
      const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      return {
        id: `EMP-${(idCounter++).toString().padStart(3, '0')}`,
        name: `${randomFirst} ${randomLast}`,
        role: specificRoleTitle || role.title,
        roleKey,
        blockId,
        performance: Math.floor(Math.random() * (100 - 80) + 80),
        years: Math.floor(Math.random() * 10) + 1,
        status: Math.random() > 0.9 ? 'Ausente' : 'Activo',
        email: `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}@empresa.com`,
        phone: `+52 55 ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000)}`
      };
    };

    // Generate blocks based on the TEAMS configuration
    this.TEAMS.forEach((team, index) => {
      const blockId = index + 1;
      
      const coords = Array(2).fill(null).map(() => createEmployee('COORD', blockId));
      const montas = Array(16).fill(null).map(() => createEmployee('MONTACARGUISTA', blockId));
      const aux = Array(1).fill(null).map(() => createEmployee('AUXILIAR', blockId));
      const amarradores = Array(4).fill(null).map(() => createEmployee('AMARRADOR', blockId));

      // New Metrics Generation
      const efficiency = parseFloat((Math.random() * (99.9 - 92.0) + 92.0).toFixed(1));
      const adherence = parseFloat((Math.random() * (100.0 - 94.0) + 94.0).toFixed(1));
      const safetyScore = parseFloat((Math.random() * (100 - 95) + 95).toFixed(1)); // High safety standards
      const unitsProcessed = Math.floor(Math.random() * (2400 - 1800) + 1800);
      
      const ranking = index === 0 ? 1 : (index === 1 ? 4 : (index === 2 ? 2 : 3)); 
      
      const criticalEvent = team.name === 'X-MEN' 
        ? 'Retraso en inicio de operación por bloqueo en andenes (Unidad T1)' 
        : undefined;

      blocks.push({
        id: blockId,
        name: team.name,
        styles: {
          headerBg: team.headerBg,
          borderColor: team.borderColor,
          titleColor: team.titleColor,
          badge: team.badge,
          progressBar: team.progressBar,
          teamIcon: team.teamIcon
        },
        stats: { total: 2 + 16 + 1 + 4 },
        metrics: {
          efficiency,
          adherence,
          safetyScore,
          unitsProcessed,
          ranking,
          criticalEvent,
          isEfficiencyGood: efficiency >= 96,
          isAdherenceGood: adherence >= 97,
        },
        staff: {
          coordinators: coords,
          operators: montas,
          auxiliaries: aux,
          lashers: amarradores
        }
      });
    });

    return {
      manager: createEmployee('GERENTE', 0),
      blocks
    };
  }

  getRoleConfig(key: RoleKey): RoleConfig {
    return this.ROLES[key];
  }

  getTeamName(id: number): string {
    if (id < 1 || id > this.TEAMS.length) return 'Oficina Central';
    return this.TEAMS[id - 1].name;
  }
}