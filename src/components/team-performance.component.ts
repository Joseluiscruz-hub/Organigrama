import { Component, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block } from '../types';
import { UiIconComponent } from './ui-icon.component';

@Component({
  selector: 'app-team-performance',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  template: `
    <section class="mt-16 pb-12 transition-opacity duration-500" [class.opacity-100]="true">
      
      @if (isLoading()) {
        <!-- SKELETON LOADING STATE -->
        <div class="animate-pulse space-y-8">
          
          <!-- Header Skeleton -->
          <div class="flex justify-between items-center">
             <div class="space-y-2">
               <div class="h-8 bg-slate-200 rounded-lg w-64"></div>
               <div class="h-4 bg-slate-100 rounded w-48"></div>
             </div>
             <div class="flex gap-3">
               <div class="h-8 w-32 bg-slate-100 rounded-lg"></div>
               <div class="h-8 w-32 bg-slate-100 rounded-lg"></div>
             </div>
          </div>

          <!-- Cards Grid Skeleton -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
             @for (i of [1,2,3,4]; track i) {
               <div class="bg-white rounded-2xl border border-slate-200 h-[340px] p-6 space-y-6">
                 <!-- Card Header -->
                 <div class="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-slate-200"></div>
                      <div class="h-4 w-24 bg-slate-200 rounded"></div>
                    </div>
                    <div class="w-16 h-6 rounded-full bg-slate-100"></div>
                 </div>
                 <!-- Metrics -->
                 <div class="space-y-4">
                   <div class="space-y-2">
                     <div class="flex justify-between">
                       <div class="h-3 w-16 bg-slate-200 rounded"></div>
                       <div class="h-3 w-10 bg-slate-200 rounded"></div>
                     </div>
                     <div class="h-2.5 w-full bg-slate-100 rounded-full"></div>
                   </div>
                   <div class="space-y-2">
                     <div class="flex justify-between">
                       <div class="h-3 w-16 bg-slate-200 rounded"></div>
                       <div class="h-3 w-10 bg-slate-200 rounded"></div>
                     </div>
                     <div class="h-2.5 w-full bg-slate-100 rounded-full"></div>
                   </div>
                 </div>
                 <!-- Footer Stats -->
                 <div class="grid grid-cols-2 gap-4 pt-2">
                    <div class="h-20 bg-slate-50 rounded-xl"></div>
                    <div class="h-20 bg-slate-50 rounded-xl"></div>
                 </div>
               </div>
             }
          </div>

          <!-- Table Header Skeleton -->
          <div class="flex items-center gap-2 mb-4">
            <div class="w-5 h-5 bg-slate-200 rounded"></div>
            <div class="h-6 w-48 bg-slate-200 rounded"></div>
          </div>

          <!-- Table Skeleton -->
          <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
             <div class="h-12 bg-slate-100 border-b border-slate-200"></div>
             <div class="divide-y divide-slate-100">
               @for (row of [1,2,3,4]; track row) {
                 <div class="h-16 flex items-center px-6 gap-4">
                    <div class="w-1/4 h-8 bg-slate-50 rounded"></div>
                    <div class="flex-1 h-6 bg-slate-50 rounded mx-2"></div>
                    <div class="flex-1 h-6 bg-slate-50 rounded mx-2"></div>
                    <div class="flex-1 h-6 bg-slate-50 rounded mx-2"></div>
                    <div class="flex-1 h-6 bg-slate-50 rounded mx-2"></div>
                 </div>
               }
             </div>
          </div>

        </div>

      } @else {
        <!-- ACTUAL CONTENT -->
        <div class="animate-fadeIn">
          <!-- Section Header -->
          <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-3xl font-bold text-slate-900 uppercase tracking-tight">Tablero de Rendimiento</h2>
              <p class="text-sm text-slate-500 mt-1">Métricas clave y estado operativo por tripulación</p>
            </div>
            <div class="flex gap-3">
              <div class="bg-white/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></div>
                <span class="text-xs font-bold text-slate-600 uppercase">Meta Cumplida</span>
              </div>
              <div class="bg-white/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100"></div>
                <span class="text-xs font-bold text-slate-600 uppercase">Atención</span>
              </div>
            </div>
          </div>

          <!-- VISUAL DASHBOARD CARDS -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            @for (block of blocks(); track block.id) {
              <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/40 overflow-hidden hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group ring-1 ring-slate-900/5">
                
                <!-- Card Header -->
                <div [class]="'px-6 py-5 border-b flex justify-between items-center relative overflow-hidden ' + block.styles.headerBg + ' ' + block.styles.borderColor">
                   <!-- Subtle pattern overlay for header -->
                   <div class="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]"></div>
                   
                  <div class="flex items-center gap-3 relative z-10">
                    <div [class]="'p-2 rounded-xl bg-white/70 shadow-sm ring-1 ring-black/5 ' + block.styles.titleColor">
                      <app-ui-icon [name]="block.styles.teamIcon" [size]="18" />
                    </div>
                    <span [class]="'font-black tracking-wide text-sm ' + block.styles.titleColor">{{ block.name }}</span>
                  </div>
                  <div [class]="'relative z-10 text-[10px] font-extrabold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm border border-white/50 ' + block.styles.titleColor">
                    #{{block.metrics.ranking}}
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-6 space-y-7">
                  
                  <!-- Efficiency Meter -->
                  <div>
                    <div class="flex justify-between items-end mb-2">
                      <div class="flex items-center gap-1.5 text-slate-400">
                        <app-ui-icon name="zap" [size]="14" />
                        <span class="text-[10px] font-bold uppercase tracking-widest">Eficiencia</span>
                      </div>
                      <span [class]="'text-lg font-mono font-bold ' + (block.metrics.isEfficiencyGood ? 'text-emerald-600' : 'text-amber-600')">
                        {{ block.metrics.efficiency }}%
                      </span>
                    </div>
                    <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner ring-1 ring-slate-900/5">
                      <div class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                          [style.width.%]="showProgress() ? block.metrics.efficiency : 0"
                          [class]="block.metrics.isEfficiencyGood ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'">
                          <div class="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Adherence Meter -->
                  <div>
                    <div class="flex justify-between items-end mb-2">
                      <div class="flex items-center gap-1.5 text-slate-400">
                        <app-ui-icon name="activity" [size]="14" />
                        <span class="text-[10px] font-bold uppercase tracking-widest">Adherencia</span>
                      </div>
                      <span class="text-lg font-mono font-bold text-slate-700">
                        {{ block.metrics.adherence }}%
                      </span>
                    </div>
                    <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner ring-1 ring-slate-900/5">
                      <div class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                          [style.width.%]="showProgress() ? block.metrics.adherence : 0"
                          [class]="block.styles.progressBar + ' shadow-sm'">
                          <div class="absolute inset-0 bg-white/10 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Bottom Stats Grid -->
                  <div class="grid grid-cols-2 gap-4 pt-1">
                    <!-- Safety -->
                    <div class="bg-slate-50/80 rounded-xl p-3 ring-1 ring-slate-200/60 flex flex-col items-center justify-center group-hover:bg-slate-50 transition-colors">
                      <div class="mb-1 text-slate-400">
                        <app-ui-icon name="shield" [size]="18" />
                      </div>
                      <span class="text-xl font-bold text-slate-800">{{ block.metrics.safetyScore }}</span>
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Seguridad</span>
                    </div>

                    <!-- Units -->
                    <div class="bg-slate-50/80 rounded-xl p-3 ring-1 ring-slate-200/60 flex flex-col items-center justify-center group-hover:bg-slate-50 transition-colors">
                      <div class="mb-1 text-slate-400">
                        <app-ui-icon name="package" [size]="18" />
                      </div>
                      <span class="text-xl font-bold text-slate-800">{{ block.metrics.unitsProcessed | number }}</span>
                      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Unidades</span>
                    </div>
                  </div>

                </div>
              </div>
            }
          </div>

          <!-- DETAILED TABLE HEADER -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
               <div class="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                 <app-ui-icon name="barChart" [size]="20" class="text-slate-700" />
               </div>
               <div>
                 <h3 class="text-lg font-bold text-slate-900 uppercase tracking-tight">Detalle Consolidado</h3>
                 <p class="text-xs text-slate-500">Desglose de KPIs por célula operativa</p>
               </div>
            </div>
          </div>

          <!-- Main Report Table (Modern Floating Rows) -->
          <div class="overflow-x-auto pb-4">
            <table class="w-full text-sm border-separate border-spacing-y-3">
              <!-- Table Header -->
              <thead>
                <tr class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th class="px-6 pb-2 text-left w-1/4">Tripulación</th>
                  <th class="px-6 pb-2 text-center">Eficiencia</th>
                  <th class="px-6 pb-2 text-center">Adherencia</th>
                  <th class="px-6 pb-2 text-center">Seguridad</th>
                  <th class="px-6 pb-2 text-center">Unidades</th>
                  <th class="px-6 pb-2 text-center">Ranking</th>
                </tr>
              </thead>
              <!-- Table Body -->
              <tbody>
                @for (block of blocks(); track block.id) {
                  <tr class="bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] group">
                    <!-- Team Name -->
                    <td class="px-6 py-5 rounded-l-2xl border-l border-t border-b border-slate-100">
                      <div class="flex items-center gap-4">
                        <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center ' + block.styles.headerBg + ' ' + block.styles.titleColor">
                          <app-ui-icon [name]="block.styles.teamIcon" [size]="18" />
                        </div>
                        <div>
                          <div class="font-bold text-slate-800 uppercase tracking-tight">{{ block.name }}</div>
                          <div class="text-[10px] text-slate-400">ID: #{{ block.id }}</div>
                        </div>
                      </div>
                    </td>
                    
                    <!-- Efficiency -->
                    <td class="px-6 py-5 text-center border-t border-b border-slate-100">
                      <div [class]="'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold ' + (block.metrics.isEfficiencyGood ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' : 'bg-amber-50/50 border-amber-100 text-amber-700')">
                        {{ block.metrics.efficiency }}%
                      </div>
                    </td>
                    
                    <!-- Adherence -->
                    <td class="px-6 py-5 text-center border-t border-b border-slate-100">
                       <div class="relative w-24 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
                          <div [class]="'absolute top-0 left-0 h-full rounded-full ' + block.styles.progressBar" [style.width.%]="block.metrics.adherence"></div>
                       </div>
                       <div class="mt-1.5 font-mono font-bold text-slate-600 text-xs">{{ block.metrics.adherence }}%</div>
                    </td>

                    <!-- Safety Score -->
                    <td class="px-6 py-5 text-center border-t border-b border-slate-100">
                      <div class="flex items-center justify-center gap-1.5">
                         <app-ui-icon name="shield" [size]="14" class="text-slate-400" />
                         <span class="font-bold text-slate-700">{{ block.metrics.safetyScore }}</span>
                      </div>
                    </td>

                    <!-- Units Processed -->
                    <td class="px-6 py-5 text-center border-t border-b border-slate-100">
                      <span class="font-bold text-slate-800 text-base tracking-tight">{{ block.metrics.unitsProcessed | number }}</span>
                    </td>

                    <!-- Ranking -->
                    <td class="px-6 py-5 text-center rounded-r-2xl border-r border-t border-b border-slate-100">
                      <div class="flex items-center justify-center gap-1.5">
                        <app-ui-icon name="flag" [size]="16" [class]="getRankingColor(block.metrics.ranking) + ' fill-current'" />
                        <span class="font-black text-lg text-slate-800">{{ block.metrics.ranking }}</span>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Critical Events Log -->
          <div class="mt-10 border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm rounded-xl overflow-hidden">
            <div class="bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-slate-200">
              <span class="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-slate-600">
                <app-ui-icon name="alertTriangle" [size]="14" class="text-red-500" />
                Bitácora de Eventos Críticos
              </span>
              <span class="text-[10px] text-slate-400 font-mono font-medium px-2 py-0.5 bg-slate-200 rounded">EN VIVO</span>
            </div>
            
            <div class="divide-y divide-slate-100">
              @for (block of blocks(); track block.id) {
                @if (block.metrics.criticalEvent) {
                  <div class="flex flex-col md:flex-row p-0 hover:bg-slate-50 transition-colors">
                    <div class="w-full md:w-48 bg-red-50/30 p-4 flex items-center gap-3 border-b md:border-b-0 md:border-r border-red-100/50">
                        <div [class]="'w-2 h-2 rounded-full ' + block.styles.progressBar"></div>
                        <span class="font-bold text-slate-800 text-sm">{{ block.name }}</span>
                    </div>
                    <div class="p-4 flex-1 text-sm text-slate-600 flex items-center">
                      <span class="font-bold text-red-600 mr-3 uppercase text-[9px] border border-red-200 bg-red-50 px-2 py-0.5 rounded-md tracking-wider">Incidencia</span>
                      {{ block.metrics.criticalEvent }}
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        </div>
      }

    </section>
  `,
  styles: [`
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `]
})
export class TeamPerformanceComponent {
  blocks = input<Block[]>([]);
  isLoading = input(false);
  
  // Animation state to trigger transitions
  showProgress = signal(false);

  constructor() {
    effect(() => {
      const loading = this.isLoading();
      if (!loading) {
        this.showProgress.set(false);
        setTimeout(() => {
          this.showProgress.set(true);
        }, 300);
      }
    });
  }

  getRankingColor(rank: number): string {
     if (rank === 1) return 'text-emerald-500';
     if (rank === 2) return 'text-blue-500';
     if (rank === 3) return 'text-amber-500';
     return 'text-slate-300';
  }
}