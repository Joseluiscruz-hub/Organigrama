import { Component, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, TeamObjectives } from '../types';
import { UiIconComponent } from './ui-icon.component';

@Component({
  selector: 'app-team-performance',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  template: `
    <section class="mt-8 lg:mt-16 pb-12 transition-opacity duration-500">
      
      @if (isLoading()) {
        <!-- SKELETON LOADING STATE -->
        <div class="animate-pulse space-y-8">
          <div class="flex justify-between items-center">
             <div class="space-y-2">
               <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-64"></div>
               <div class="h-4 bg-slate-100 dark:bg-slate-800 rounded w-48"></div>
             </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
             @for (i of [1,2,3,4]; track i) {
               <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 h-[420px] p-6"></div>
             }
          </div>
        </div>

      } @else {
        <!-- ACTUAL CONTENT -->
        <div class="animate-fadeIn">
          
          <!-- Section Header - Corporate Style -->
          <div class="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div class="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-lg">
                  <app-ui-icon name="barChart" [size]="20" class="text-white" />
                </div>
                <span class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Resultados Operaciones</span>
              </div>
              <h2 class="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Tripulaciones {{ reportMonth() }} {{ reportYear() }}
              </h2>
            </div>
            
            <!-- Objectives Legend -->
            <div class="flex flex-wrap gap-2">
              <div class="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <span class="text-[10px] text-slate-400 uppercase">Objetivo PDF</span>
                <p class="text-sm font-bold text-slate-800 dark:text-white">{{ objectives()?.pdf }}%</p>
              </div>
              <div class="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <span class="text-[10px] text-slate-400 uppercase">T. Estancia</span>
                <p class="text-sm font-bold text-slate-800 dark:text-white">{{ objectives()?.tiempoEstancia }}</p>
              </div>
              <div class="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <span class="text-[10px] text-slate-400 uppercase">T. Planta</span>
                <p class="text-sm font-bold text-slate-800 dark:text-white">{{ objectives()?.tiempoPlanta }}</p>
              </div>
              <div class="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <span class="text-[10px] text-slate-400 uppercase">Tarimas</span>
                <p class="text-sm font-bold text-slate-800 dark:text-white">{{ objectives()?.tarimas | number }}</p>
              </div>
            </div>
          </div>

          <!-- TEAM PERFORMANCE CARDS - Corporate Design -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            @for (block of blocks(); track block.id) {
              <div class="group bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
                
                <!-- Card Header with Gradient -->
                <div [class]="'relative px-5 py-4 bg-gradient-to-r ' + block.styles.gradientFrom + ' ' + block.styles.gradientTo">
                  <!-- Ranking Badge -->
                  <div class="absolute -right-2 -top-2 w-14 h-14">
                    <div [class]="'absolute inset-0 flex items-center justify-center ' + getRankingBgClass(block.metrics.ranking)">
                      <span class="text-white font-black text-xl">#{{ block.metrics.ranking }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <div class="bg-white/20 backdrop-blur p-2 rounded-lg">
                      <app-ui-icon [name]="block.styles.teamIcon" [size]="22" class="text-white" />
                    </div>
                    <div>
                      <h3 class="font-black text-white text-lg tracking-wide">{{ block.name }}</h3>
                      <div class="flex items-center gap-1 mt-0.5">
                        @for (i of getStars(); track i) {
                          <app-ui-icon name="star" [size]="12" [class]="i <= getFilledStars(block.metrics.pdfScore) ? 'text-yellow-300' : 'text-white/30'" />
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-5 space-y-4">
                  
                  <!-- PDF Metric - Main KPI -->
                  <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-100 dark:from-slate-600 to-transparent rounded-bl-full opacity-50"></div>
                    <div class="relative">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">*PDF</span>
                        <span [class]="'text-xs font-bold px-2 py-0.5 rounded-full ' + (block.metrics.isPdfAboveTarget ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400')">
                          {{ block.metrics.isPdfAboveTarget ? '✓ Meta' : '✗ Bajo' }}
                        </span>
                      </div>
                      <div class="flex items-end gap-2">
                        <span class="text-4xl font-black text-slate-900 dark:text-white">{{ block.metrics.pdf }}</span>
                        <span class="text-lg text-slate-400 mb-1">%</span>
                      </div>
                      <div class="mt-2 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-1000"
                          [class]="block.metrics.isPdfAboveTarget ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-red-500 to-red-400'"
                          [style.width.%]="showProgress() ? getProgressWidth(block.metrics.pdf) : 0"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- Time Metrics Grid -->
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Tiempo Estancia -->
                    <div class="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-100 dark:border-slate-600 shadow-sm">
                      <div class="flex items-center gap-1.5 mb-1">
                        <app-ui-icon name="clock" [size]="12" class="text-slate-400" />
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Estancia</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <span class="text-xl font-bold text-slate-900 dark:text-white font-mono">{{ block.metrics.tiempoEstancia }}</span>
                        @if (block.metrics.isTiempoEstanciaGood) {
                          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        } @else {
                          <span class="w-2 h-2 rounded-full bg-red-500"></span>
                        }
                      </div>
                    </div>
                    
                    <!-- Tiempo Planta -->
                    <div class="bg-white dark:bg-slate-700 rounded-lg p-3 border border-slate-100 dark:border-slate-600 shadow-sm">
                      <div class="flex items-center gap-1.5 mb-1">
                        <app-ui-icon name="timer" [size]="12" class="text-slate-400" />
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Planta</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <span class="text-xl font-bold text-slate-900 dark:text-white font-mono">{{ block.metrics.tiempoPlanta }}</span>
                        @if (block.metrics.isTiempoPlantaGood) {
                          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        } @else {
                          <span class="w-2 h-2 rounded-full bg-red-500"></span>
                        }
                      </div>
                    </div>
                  </div>

                  <!-- Tarimas & Seguridad -->
                  <div class="grid grid-cols-2 gap-3">
                    <!-- Tarimas -->
                    <div class="text-center p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200/50 dark:border-slate-600">
                      <app-ui-icon name="package" [size]="18" class="text-slate-400 mx-auto mb-1" />
                      <p class="text-xl font-black text-slate-900 dark:text-white">{{ block.metrics.tarimas | number }}</p>
                      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tarimas Prom.</p>
                    </div>
                    
                    <!-- Seguridad -->
                    <div class="text-center p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200/50 dark:border-slate-600">
                      <app-ui-icon name="shield" [size]="18" class="text-emerald-500 mx-auto mb-1" />
                      <p class="text-xl font-black text-slate-900 dark:text-white">{{ block.metrics.seguridad }}/5</p>
                      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seguridad</p>
                    </div>
                  </div>

                  <!-- Tarjetas Stop -->
                  <div [class]="'flex items-center justify-between p-3 rounded-lg border ' + (block.metrics.tarjetasStop > 0 ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800')">
                    <div class="flex items-center gap-2">
                      <app-ui-icon name="alertTriangle" [size]="16" [class]="block.metrics.tarjetasStop > 0 ? 'text-red-500' : 'text-emerald-500'" />
                      <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Tarjetas Stop</span>
                    </div>
                    <span [class]="'text-lg font-black ' + (block.metrics.tarjetasStop > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')">
                      {{ block.metrics.tarjetasStop }}
                    </span>
                  </div>

                  <!-- Suma Score -->
                  <div class="pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Suma Total</span>
                      <span class="text-2xl font-black text-slate-900 dark:text-white">{{ block.metrics.suma.toFixed(2) }}</span>
                    </div>
                  </div>

                </div>
              </div>
            }
          </div>

          <!-- CONSOLIDATED TABLE - Corporate Style -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
            <!-- Table Header -->
            <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <div class="flex items-center gap-3">
                <app-ui-icon name="barChart" [size]="20" class="text-white" />
                <h3 class="text-lg font-bold text-white uppercase tracking-wide">Detalle Consolidado por Tripulación</h3>
              </div>
            </div>
            
            <!-- Table Content -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                    <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tripulación</th>
                    <th class="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">*PDF</th>
                    <th class="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">T. Estancia</th>
                    <th class="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">*T. Planta</th>
                    <th class="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tarimas</th>
                    <th class="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Seguridad</th>
                    <th class="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">T. Stop</th>
                    <th class="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-600">Suma</th>
                    <th class="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-600">Ranking</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  @for (block of blocks(); track block.id) {
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <!-- Team Name -->
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ' + block.styles.gradientFrom + ' ' + block.styles.gradientTo">
                            <app-ui-icon [name]="block.styles.teamIcon" [size]="18" class="text-white" />
                          </div>
                          <span class="font-bold text-slate-800 dark:text-white uppercase">{{ block.name }}</span>
                        </div>
                      </td>
                      
                      <!-- PDF -->
                      <td class="px-4 py-4 text-center">
                        <span [class]="'font-bold ' + (block.metrics.isPdfAboveTarget ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')">
                          {{ block.metrics.pdf }}%
                        </span>
                      </td>
                      
                      <!-- Tiempo Estancia -->
                      <td class="px-4 py-4 text-center">
                        <span [class]="'px-2 py-1 rounded font-mono font-bold ' + (block.metrics.isTiempoEstanciaGood ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400')">
                          {{ block.metrics.tiempoEstancia }}
                        </span>
                      </td>
                      
                      <!-- Tiempo Planta -->
                      <td class="px-4 py-4 text-center">
                        <span [class]="'px-2 py-1 rounded font-mono font-bold ' + (block.metrics.isTiempoPlantaGood ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400')">
                          {{ block.metrics.tiempoPlanta }}
                        </span>
                      </td>
                      
                      <!-- Tarimas -->
                      <td class="px-4 py-4 text-center">
                        <span [class]="'font-bold ' + (block.metrics.isTarimasAboveTarget ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300')">
                          {{ block.metrics.tarimas | number }}
                        </span>
                      </td>
                      
                      <!-- Seguridad -->
                      <td class="px-4 py-4 text-center">
                        <div class="flex items-center justify-center gap-1">
                          @for (i of [1,2,3,4,5]; track i) {
                            <div [class]="'w-2 h-2 rounded-full ' + (i <= block.metrics.seguridad ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-600')"></div>
                          }
                        </div>
                      </td>
                      
                      <!-- Tarjetas Stop -->
                      <td class="px-4 py-4 text-center">
                        <span [class]="'inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ' + (block.metrics.tarjetasStop > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400')">
                          {{ block.metrics.tarjetasStop }}
                        </span>
                      </td>
                      
                      <!-- Suma -->
                      <td class="px-4 py-4 text-center bg-slate-50 dark:bg-slate-700/30">
                        <span class="text-lg font-black text-slate-900 dark:text-white">{{ block.metrics.suma.toFixed(2) }}</span>
                      </td>
                      
                      <!-- Ranking -->
                      <td class="px-4 py-4 text-center bg-slate-50 dark:bg-slate-700/30">
                        <div class="flex items-center justify-center gap-2">
                          <div [class]="'w-3 h-6 rounded-sm ' + getRankingFlagClass(block.metrics.ranking)"></div>
                          <span class="text-xl font-black text-slate-900 dark:text-white">{{ block.metrics.ranking }}</span>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- CRITICAL EVENTS LOG -->
          @if (hasCriticalEvents()) {
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 overflow-hidden">
              <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-white/20 p-2 rounded-lg">
                    <app-ui-icon name="alertTriangle" [size]="20" class="text-white" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-white uppercase tracking-wide">Tarjetas Stop Críticas</h3>
                    <p class="text-xs text-red-100">Descripción del Evento</p>
                  </div>
                </div>
                <span class="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">En Vivo</span>
              </div>
              
              <div class="divide-y divide-red-100 dark:divide-red-900/50">
                @for (block of blocks(); track block.id) {
                  @if (block.metrics.hasCriticalEvent) {
                    <div class="flex flex-col md:flex-row hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                      <div class="w-full md:w-48 bg-red-50 dark:bg-red-900/20 p-5 flex items-center gap-3 border-b md:border-b-0 md:border-r border-red-100 dark:border-red-900/50">
                        <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ' + block.styles.gradientFrom + ' ' + block.styles.gradientTo">
                          <app-ui-icon [name]="block.styles.teamIcon" [size]="18" class="text-white" />
                        </div>
                        <span class="font-bold text-slate-800 dark:text-white uppercase">{{ block.name }}</span>
                      </div>
                      <div class="p-5 flex-1 flex items-center gap-4">
                        <span class="shrink-0 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded tracking-wider">
                          Incidencia
                        </span>
                        <p class="text-sm text-slate-700 dark:text-slate-300">{{ block.metrics.criticalEvent }}</p>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          }

        </div>
      }

    </section>
  `,
  styles: [\`
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  \`]
})
export class TeamPerformanceComponent {
  blocks = input<Block[]>([]);
  objectives = input<TeamObjectives | undefined>();
  reportMonth = input('');
  reportYear = input(0);
  isLoading = input(false);
  
  showProgress = signal(false);

  constructor() {
    effect(() => {
      const loading = this.isLoading();
      if (!loading) {
        this.showProgress.set(false);
        setTimeout(() => this.showProgress.set(true), 300);
      }
    });
  }

  getStars(): number[] {
    return [1, 2, 3];
  }

  getFilledStars(score: number): number {
    if (score >= 1.05) return 3;
    if (score >= 1.0) return 2;
    return 1;
  }
  
  getProgressWidth(pdf: number): number {
    return Math.min(pdf, 120) / 1.2;
  }

  getRankingBgClass(rank: number): string {
    switch(rank) {
      case 1: return 'bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-bl-2xl';
      case 2: return 'bg-gradient-to-br from-blue-500 to-blue-600 rounded-bl-2xl';
      case 3: return 'bg-gradient-to-br from-amber-500 to-amber-600 rounded-bl-2xl';
      default: return 'bg-gradient-to-br from-red-500 to-red-600 rounded-bl-2xl';
    }
  }

  getRankingFlagClass(rank: number): string {
    switch(rank) {
      case 1: return 'bg-emerald-500';
      case 2: return 'bg-blue-500';
      case 3: return 'bg-amber-500';
      default: return 'bg-red-500';
    }
  }

  hasCriticalEvents(): boolean {
    return this.blocks().some(b => b.metrics.hasCriticalEvent);
  }
}
