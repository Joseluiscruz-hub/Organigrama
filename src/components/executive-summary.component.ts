
import { Component, Input, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, TeamObjectives } from '../types';
import { UiIconComponent } from './ui-icon.component';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  message: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-executive-summary',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  template: `
    <!-- EXECUTIVE SUMMARY PANEL -->
    <div class="w-full max-w-7xl mx-auto mb-8 animate-fadeIn">
      
      <!-- Header with Title & Notifications -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
              <app-ui-icon name="gauge" class="text-white" [size]="20" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-800 dark:text-white">Panel Ejecutivo</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Resumen en tiempo real de operaciones</p>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="flex items-center gap-2">
          <!-- Notification Bell -->
          <div class="relative">
            <button 
              (click)="toggleNotifications()"
              class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm relative"
            >
              <app-ui-icon name="bellRing" [size]="18" class="text-slate-600 dark:text-slate-300" />
              @if (unreadCount() > 0) {
                <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {{ unreadCount() }}
                </span>
              }
            </button>
            
            <!-- Notifications Dropdown -->
            @if (showNotifications()) {
              <div class="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                <div class="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span class="font-bold text-sm text-slate-800 dark:text-white">Notificaciones</span>
                  <button (click)="clearNotifications()" class="text-xs text-indigo-600 hover:underline">Limpiar todo</button>
                </div>
                <div class="max-h-80 overflow-y-auto">
                  @for (notification of notifications(); track notification.id) {
                    <div class="px-4 py-3 border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div class="flex items-start gap-3">
                        <div [class]="getNotificationIconClass(notification.type)">
                          <app-ui-icon [name]="notification.icon" [size]="14" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-bold text-slate-800 dark:text-white">{{ notification.title }}</p>
                          <p class="text-xs text-slate-500 dark:text-slate-400">{{ notification.message }}</p>
                          <span class="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{{ notification.time }}</span>
                        </div>
                      </div>
                    </div>
                  } @empty {
                    <div class="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                      <app-ui-icon name="bell" [size]="32" class="mx-auto mb-2 opacity-50" />
                      <p class="text-sm">Sin notificaciones</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          
          <!-- Export Button -->
          <button 
            (click)="exportReport()"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-lg"
          >
            <app-ui-icon name="printer" [size]="14" />
            Exportar Reporte
          </button>
        </div>
      </div>
      
      <!-- KPI Cards Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        
        <!-- Total Employees -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <app-ui-icon name="users" [size]="18" class="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div class="text-right flex-1">
              <div class="text-2xl font-black text-slate-800 dark:text-white counter" [attr.data-target]="totalEmployees()">
                {{ animatedEmployees() }}
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Personal</p>
          <div class="flex items-center gap-1 mt-1">
            <app-ui-icon name="trendUp" [size]="12" class="text-emerald-500" />
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+5% vs mes anterior</span>
          </div>
        </div>
        
        <!-- Active Teams -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <app-ui-icon name="trophy" [size]="18" class="text-violet-600 dark:text-violet-400" />
            </div>
            <div class="text-right flex-1">
              <div class="text-2xl font-black text-slate-800 dark:text-white">{{ blocks.length }}</div>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Tripulaciones</p>
          <div class="flex items-center gap-1 mt-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400">Todas activas</span>
          </div>
        </div>
        
        <!-- PDF Average -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <app-ui-icon name="target" [size]="18" class="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="text-right flex-1">
              <div class="text-2xl font-black text-slate-800 dark:text-white">
                {{ avgPdf().toFixed(1) }}%
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">PDF Promedio</p>
          <div class="flex items-center gap-1 mt-1">
            @if (avgPdf() >= 100) {
              <app-ui-icon name="trendUp" [size]="12" class="text-emerald-500" />
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Meta alcanzada</span>
            } @else {
              <app-ui-icon name="trendDown" [size]="12" class="text-amber-500" />
              <span class="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Bajo meta</span>
            }
          </div>
        </div>
        
        <!-- Tarimas Total -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <app-ui-icon name="package" [size]="18" class="text-amber-600 dark:text-amber-400" />
            </div>
            <div class="text-right flex-1">
              <div class="text-2xl font-black text-slate-800 dark:text-white">
                {{ totalTarimas().toLocaleString() }}
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Tarimas Total</p>
          <div class="flex items-center gap-1 mt-1">
            <app-ui-icon name="trendUp" [size]="12" class="text-emerald-500" />
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+12% productividad</span>
          </div>
        </div>
        
        <!-- Safety Score -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
              <app-ui-icon name="shield" [size]="18" class="text-sky-600 dark:text-sky-400" />
            </div>
            <div class="text-right flex-1">
              <div class="text-2xl font-black text-slate-800 dark:text-white">
                {{ avgSafety().toFixed(1) }}/5
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Seguridad Prom.</p>
          <div class="flex items-center gap-1 mt-1">
            @if (avgSafety() >= 4) {
              <app-ui-icon name="checkCircle" [size]="12" class="text-emerald-500" />
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Excelente</span>
            } @else {
              <app-ui-icon name="info" [size]="12" class="text-amber-500" />
              <span class="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Mejorable</span>
            }
          </div>
        </div>
        
        <!-- Stop Cards -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center gap-3 mb-3">
            <div [class]="totalStopCards() > 0 ? 'w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center' : 'w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center'">
              <app-ui-icon name="flag" [size]="18" [class]="totalStopCards() > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'" />
            </div>
            <div class="text-right flex-1">
              <div class="text-2xl font-black text-slate-800 dark:text-white">{{ totalStopCards() }}</div>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Tarjetas Stop</p>
          <div class="flex items-center gap-1 mt-1">
            @if (totalStopCards() === 0) {
              <app-ui-icon name="checkCircle" [size]="12" class="text-emerald-500" />
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Sin incidentes</span>
            } @else {
              <app-ui-icon name="alertTriangle" [size]="12" class="text-red-500" />
              <span class="text-[10px] text-red-600 dark:text-red-400 font-bold">Requiere atención</span>
            }
          </div>
        </div>
      </div>
      
      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Bar Chart: Team Comparison -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <app-ui-icon name="barChart" [size]="16" class="text-indigo-600" />
              Comparativa PDF por Tripulación
            </h3>
            <span class="text-xs text-slate-400 dark:text-slate-500">Meta: {{ objectives?.pdf ?? 100 }}%</span>
          </div>
          
          <div class="space-y-4">
            @for (block of blocks; track block.id) {
              <div class="flex items-center gap-4">
                <span class="w-24 text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{{ block.name }}</span>
                <div class="flex-1 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                  <!-- Target Line -->
                  <div class="absolute top-0 bottom-0 w-px bg-red-400 z-10" [style.left.%]="getBarPosition(objectives?.pdf ?? 100)"></div>
                  <!-- Bar -->
                  <div 
                    class="h-full rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                    [style.width.%]="getBarPosition(block.metrics.pdf)"
                    [class]="block.metrics.isPdfAboveTarget ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'"
                  >
                    <span class="text-xs font-black text-white drop-shadow">{{ block.metrics.pdf.toFixed(1) }}%</span>
                  </div>
                </div>
                <div class="w-8 flex justify-center">
                  @if (block.metrics.isPdfAboveTarget) {
                    <app-ui-icon name="trendUp" [size]="14" class="text-emerald-500" />
                  } @else {
                    <app-ui-icon name="trendDown" [size]="14" class="text-amber-500" />
                  }
                </div>
              </div>
            }
          </div>
          
          <!-- Legend -->
          <div class="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-emerald-500"></div>
              <span class="text-xs text-slate-500 dark:text-slate-400">Sobre meta</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-amber-500"></div>
              <span class="text-xs text-slate-500 dark:text-slate-400">Bajo meta</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-1 bg-red-400"></div>
              <span class="text-xs text-slate-500 dark:text-slate-400">Meta (100%)</span>
            </div>
          </div>
        </div>
        
        <!-- Ranking Podium -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <app-ui-icon name="trophy" [size]="16" class="text-amber-500" />
              Ranking General
            </h3>
            <span class="text-xs text-slate-400 dark:text-slate-500">Por suma de scores</span>
          </div>
          
          <!-- Podium -->
          <div class="flex items-end justify-center gap-4 h-48 mb-4">
            @for (team of sortedTeams(); track team.id; let i = $index) {
              <div 
                class="flex flex-col items-center transition-all duration-500"
                [style.animation-delay]="i * 100 + 'ms'"
              >
                <!-- Team Icon -->
                <div 
                  class="w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-lg ring-4 ring-white dark:ring-slate-700"
                  [class]="getPodiumBgClass(i)"
                >
                  <app-ui-icon [name]="team.styles.teamIcon" [size]="24" class="text-white" />
                </div>
                
                <!-- Team Name -->
                <span class="text-xs font-bold text-slate-800 dark:text-white mb-1">{{ team.name }}</span>
                
                <!-- Score -->
                <span class="text-lg font-black" [class]="getPodiumTextClass(i)">{{ team.metrics.suma.toFixed(2) }}</span>
                
                <!-- Podium Bar -->
                <div 
                  class="w-20 rounded-t-lg flex items-end justify-center pb-2 mt-2"
                  [style.height.px]="getPodiumHeight(i)"
                  [class]="getPodiumBarClass(i)"
                >
                  <span class="text-2xl font-black text-white/80">#{{ i + 1 }}</span>
                </div>
              </div>
            }
          </div>
          
          <!-- Detailed Ranking List -->
          <div class="border-t border-slate-100 dark:border-slate-700 pt-4">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-slate-400 dark:text-slate-500">
                  <th class="text-left pb-2">Pos</th>
                  <th class="text-left pb-2">Tripulación</th>
                  <th class="text-center pb-2">PDF</th>
                  <th class="text-center pb-2">Tarimas</th>
                  <th class="text-right pb-2">Suma</th>
                </tr>
              </thead>
              <tbody>
                @for (team of sortedTeams(); track team.id; let i = $index) {
                  <tr class="border-t border-slate-50 dark:border-slate-700/50">
                    <td class="py-2">
                      <span [class]="getRankBadgeClass(i)">{{ i + 1 }}</span>
                    </td>
                    <td class="py-2 font-bold text-slate-700 dark:text-slate-200">{{ team.name }}</td>
                    <td class="py-2 text-center">
                      <span [class]="team.metrics.isPdfAboveTarget ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                        {{ team.metrics.pdf.toFixed(1) }}%
                      </span>
                    </td>
                    <td class="py-2 text-center text-slate-600 dark:text-slate-300">{{ team.metrics.tarimas }}</td>
                    <td class="py-2 text-right font-bold text-slate-800 dark:text-white">{{ team.metrics.suma.toFixed(2) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExecutiveSummaryComponent implements OnInit, OnDestroy {
  @Input() blocks: Block[] = [];
  @Input() objectives: TeamObjectives | undefined;
  
  // State
  showNotifications = signal(false);
  notifications = signal<Notification[]>([]);
  animatedEmployees = signal(0);
  
  private notificationInterval: any;
  private counterInterval: any;
  
  ngOnInit() {
    // Generate initial notifications
    this.generateNotifications();
    
    // Simulate real-time notifications every 30 seconds
    this.notificationInterval = setInterval(() => {
      this.addRandomNotification();
    }, 30000);
    
    // Animate counter
    this.animateCounter();
  }
  
  ngOnDestroy() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
    }
  }
  
  // Computed values
  totalEmployees = computed(() => {
    let total = 1; // Manager
    this.blocks.forEach(b => {
      total += b.staff.coordinators.length;
      total += b.staff.operators.length;
      total += b.staff.auxiliaries.length;
      total += b.staff.lashers.length;
    });
    return total;
  });
  
  avgPdf = computed(() => {
    if (this.blocks.length === 0) return 0;
    const sum = this.blocks.reduce((acc, b) => acc + b.metrics.pdf, 0);
    return sum / this.blocks.length;
  });
  
  totalTarimas = computed(() => {
    return this.blocks.reduce((acc, b) => acc + b.metrics.tarimas, 0);
  });
  
  avgSafety = computed(() => {
    if (this.blocks.length === 0) return 0;
    const sum = this.blocks.reduce((acc, b) => acc + b.metrics.seguridad, 0);
    return sum / this.blocks.length;
  });
  
  totalStopCards = computed(() => {
    return this.blocks.reduce((acc, b) => acc + b.metrics.tarjetasStop, 0);
  });
  
  unreadCount = computed(() => this.notifications().length);
  
  sortedTeams = computed(() => {
    return [...this.blocks].sort((a, b) => b.metrics.suma - a.metrics.suma);
  });
  
  // Methods
  toggleNotifications() {
    this.showNotifications.update(v => !v);
  }
  
  clearNotifications() {
    this.notifications.set([]);
    this.showNotifications.set(false);
  }
  
  exportReport() {
    // Trigger print dialog
    window.print();
  }
  
  private animateCounter() {
    const target = this.totalEmployees();
    let current = 0;
    const step = Math.ceil(target / 30);
    
    this.counterInterval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(this.counterInterval);
      }
      this.animatedEmployees.set(current);
    }, 30);
  }
  
  private generateNotifications() {
    const initialNotifications: Notification[] = [
      {
        id: 1,
        type: 'success',
        title: 'Meta Alcanzada',
        message: 'GLADIADORES superó el objetivo de PDF',
        time: 'Hace 5 min',
        icon: 'checkCircle'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Atención Requerida',
        message: 'X-MEN reporta tarjeta stop por seguridad',
        time: 'Hace 15 min',
        icon: 'alertTriangle'
      },
      {
        id: 3,
        type: 'info',
        title: 'Actualización de Datos',
        message: 'Métricas actualizadas exitosamente',
        time: 'Hace 30 min',
        icon: 'info'
      }
    ];
    this.notifications.set(initialNotifications);
  }
  
  private addRandomNotification() {
    const types: Array<{ type: Notification['type']; title: string; message: string; icon: string }> = [
      { type: 'success', title: 'Operación Completada', message: 'Turno completado sin incidentes', icon: 'checkCircle' },
      { type: 'info', title: 'Cambio de Turno', message: 'El turno vespertino ha iniciado', icon: 'clock' },
      { type: 'warning', title: 'Capacidad Alta', message: 'Zona A al 90% de capacidad', icon: 'alertTriangle' }
    ];
    
    const random = types[Math.floor(Math.random() * types.length)];
    const newNotification: Notification = {
      id: Date.now(),
      ...random,
      time: 'Ahora'
    };
    
    this.notifications.update(list => [newNotification, ...list.slice(0, 4)]);
  }
  
  getNotificationIconClass(type: string): string {
    const classes: Record<string, string> = {
      'success': 'w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400',
      'warning': 'w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400',
      'info': 'w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400',
      'danger': 'w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400'
    };
    return classes[type] || classes['info'];
  }
  
  getBarPosition(value: number): number {
    // Normalize to 0-100 based on max 120%
    return Math.min(value / 1.2, 100);
  }
  
  getPodiumBgClass(index: number): string {
    const classes = [
      'bg-gradient-to-br from-amber-400 to-amber-600', // Gold
      'bg-gradient-to-br from-slate-300 to-slate-500', // Silver
      'bg-gradient-to-br from-amber-700 to-amber-900', // Bronze
      'bg-gradient-to-br from-slate-500 to-slate-700'  // 4th
    ];
    return classes[index] || classes[3];
  }
  
  getPodiumTextClass(index: number): string {
    const classes = [
      'text-amber-500', // Gold
      'text-slate-400', // Silver
      'text-amber-700', // Bronze
      'text-slate-500'  // 4th
    ];
    return classes[index] || classes[3];
  }
  
  getPodiumBarClass(index: number): string {
    const classes = [
      'bg-gradient-to-t from-amber-500 to-amber-400',
      'bg-gradient-to-t from-slate-400 to-slate-300',
      'bg-gradient-to-t from-amber-800 to-amber-700',
      'bg-gradient-to-t from-slate-600 to-slate-500'
    ];
    return classes[index] || classes[3];
  }
  
  getPodiumHeight(index: number): number {
    const heights = [120, 90, 70, 50];
    return heights[index] || 50;
  }
  
  getRankBadgeClass(index: number): string {
    const classes = [
      'inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold',
      'inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold',
      'inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 text-amber-800 font-bold',
      'inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold'
    ];
    return classes[index] || classes[3];
  }
}
