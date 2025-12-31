import { Injectable } from '@angular/core';
import { AppData, Block, Employee, RoleConfig, RoleKey, TeamMetrics, TeamObjectives } from '../types';

@Injectable({ providedIn: 'root' })
export class DataService {
  
  readonly ROLES: Record<RoleKey, RoleConfig> = {
    GERENTE: { title: 'Gerente de Operaciones', color: 'bg-slate-800', textColor: 'text-slate-800', iconName: 'briefcase', level: 1 },
    COORD: { title: 'Coordinador', color: 'bg-indigo-600', textColor: 'text-indigo-600', iconName: 'users', level: 2 },
    MONTACARGUISTA: { title: 'Op. Montacargas', color: 'bg-blue-500', textColor: 'text-blue-500', iconName: 'truck', level: 3 },
    AUXILIAR: { title: 'Aux. Fleteo', color: 'bg-emerald-500', textColor: 'text-emerald-500', iconName: 'package', level: 3 },
    AMARRADOR: { title: 'Amarrador', color: 'bg-orange-500', textColor: 'text-orange-500', iconName: 'anchor', level: 3 },
  };

  // Objetivos corporativos
  readonly OBJECTIVES: TeamObjectives = {
    pdf: 100,
    tiempoEstancia: '00:55',
    tiempoPlanta: '00:55',
    tarimas: 1579,
    seguridad: 5
  };

  // Team configurations with enhanced styling
  private readonly TEAMS = [
    { 
      name: 'GLADIADORES',
      headerBg: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      titleColor: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-700',
      progressBar: 'bg-gradient-to-r from-blue-600 to-blue-400',
      teamIcon: 'swords',
      accentColor: 'blue',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      // Datos reales basados en la imagen
      metrics: {
        pdf: 105.51,
        tiempoEstancia: '00:54',
        tiempoPlanta: '00:49',
        tarimas: 1530,
        seguridad: 5,
        tarjetasStop: 0
      }
    },
    { 
      name: 'ARMAGEDON',
      headerBg: 'bg-amber-50', 
      borderColor: 'border-amber-200', 
      titleColor: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-700',
      progressBar: 'bg-gradient-to-r from-amber-500 to-amber-400',
      teamIcon: 'flame',
      accentColor: 'amber',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-orange-600',
      metrics: {
        pdf: 103.34,
        tiempoEstancia: '00:52',
        tiempoPlanta: '00:46',
        tarimas: 1467,
        seguridad: 5,
        tarjetasStop: 0
      }
    },
    { 
      name: 'CRACKS',
      headerBg: 'bg-rose-50', 
      borderColor: 'border-rose-200', 
      titleColor: 'text-rose-700',
      badge: 'bg-rose-100 text-rose-700',
      progressBar: 'bg-gradient-to-r from-rose-500 to-rose-400',
      teamIcon: 'trophy',
      accentColor: 'rose',
      gradientFrom: 'from-rose-500',
      gradientTo: 'to-pink-600',
      metrics: {
        pdf: 99.28,
        tiempoEstancia: '01:02',
        tiempoPlanta: '00:56',
        tarimas: 1473,
        seguridad: 5,
        tarjetasStop: 0
      }
    },
    { 
      name: 'X-MEN',
      headerBg: 'bg-emerald-50', 
      borderColor: 'border-emerald-200', 
      titleColor: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700',
      progressBar: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
      teamIcon: 'crosshair',
      accentColor: 'emerald',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-teal-600',
      metrics: {
        pdf: 107.72,
        tiempoEstancia: '00:55',
        tiempoPlanta: '00:52',
        tarimas: 1579,
        seguridad: 5,
        tarjetasStop: 1,
        criticalEvent: 'OMC cruza el bloqueo de seguridad en los andenes cuando se ingresó unidad T1'
      }
    }
  ];

  private timeToMinutes(time: string): number {
    const [min, sec] = time.split(':').map(Number);
    return min + sec / 60;
  }

  private calculateScore(value: number, target: number, higherIsBetter: boolean = true): number {
    if (higherIsBetter) {
      return parseFloat((value / target).toFixed(2));
    }
    return parseFloat((target / value).toFixed(2));
  }

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

    // Calcular métricas y rankings
    const teamsWithScores = this.TEAMS.map((team, index) => {
      const m = team.metrics;
      const pdfScore = this.calculateScore(m.pdf, this.OBJECTIVES.pdf);
      const tiempoEstanciaScore = this.calculateScore(
        this.timeToMinutes(this.OBJECTIVES.tiempoEstancia),
        this.timeToMinutes(m.tiempoEstancia)
      );
      const tiempoPlantaScore = this.calculateScore(
        this.timeToMinutes(this.OBJECTIVES.tiempoPlanta),
        this.timeToMinutes(m.tiempoPlanta)
      );
      const tarimasScore = this.calculateScore(m.tarimas, this.OBJECTIVES.tarimas);
      
      // Suma no considera PDF según la imagen
      const suma = parseFloat((tiempoEstanciaScore + tiempoPlantaScore + tarimasScore + m.seguridad).toFixed(2));
      
      return {
        ...team,
        index,
        pdfScore,
        tarimasScore,
        suma
      };
    });

    // Ordenar por suma para ranking
    const sortedForRanking = [...teamsWithScores].sort((a, b) => b.suma - a.suma);
    const rankings = new Map<number, number>();
    sortedForRanking.forEach((team, idx) => rankings.set(team.index, idx + 1));

    // Generate blocks
    teamsWithScores.forEach((team, index) => {
      const blockId = index + 1;
      const m = team.metrics;
      
      const coords = Array(2).fill(null).map(() => createEmployee('COORD', blockId));
      const montas = Array(16).fill(null).map(() => createEmployee('MONTACARGUISTA', blockId));
      const aux = Array(1).fill(null).map(() => createEmployee('AUXILIAR', blockId));
      const amarradores = Array(4).fill(null).map(() => createEmployee('AMARRADOR', blockId));

      const metrics: TeamMetrics = {
        pdf: m.pdf,
        pdfScore: team.pdfScore,
        tiempoEstancia: m.tiempoEstancia,
        tiempoPlanta: m.tiempoPlanta,
        tarimas: m.tarimas,
        tarimasScore: team.tarimasScore,
        seguridad: m.seguridad,
        tarjetasStop: m.tarjetasStop,
        suma: team.suma,
        ranking: rankings.get(index) || 4,
        isPdfAboveTarget: m.pdf >= this.OBJECTIVES.pdf,
        isTiempoEstanciaGood: this.timeToMinutes(m.tiempoEstancia) <= this.timeToMinutes(this.OBJECTIVES.tiempoEstancia),
        isTiempoPlantaGood: this.timeToMinutes(m.tiempoPlanta) <= this.timeToMinutes(this.OBJECTIVES.tiempoPlanta),
        isTarimasAboveTarget: m.tarimas >= this.OBJECTIVES.tarimas,
        criticalEvent: (m as any).criticalEvent,
        hasCriticalEvent: !!(m as any).criticalEvent
      };

      blocks.push({
        id: blockId,
        name: team.name,
        styles: {
          headerBg: team.headerBg,
          borderColor: team.borderColor,
          titleColor: team.titleColor,
          badge: team.badge,
          progressBar: team.progressBar,
          teamIcon: team.teamIcon,
          accentColor: team.accentColor,
          gradientFrom: team.gradientFrom,
          gradientTo: team.gradientTo
        },
        stats: { total: 2 + 16 + 1 + 4 },
        metrics,
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
      blocks,
      objectives: this.OBJECTIVES,
      reportMonth: 'Noviembre',
      reportYear: 2025
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