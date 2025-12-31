import { Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../types';
import { DataService } from '../services/data.service';
import { UiIconComponent } from './ui-icon.component';

export type AvatarVariant = 'card' | 'compact' | 'row';

@Component({
  selector: 'app-employee-avatar',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  template: `
    @switch (variant()) {
      
      @case ('compact') {
        <!-- Compact Mode (Just the circle) -->
        <div 
          class="group relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:z-50 shadow-sm hover:shadow-lg border-2 border-white ring-1 ring-slate-100"
          [class]="roleConfig().color"
        >
          <app-ui-icon [name]="roleConfig().iconName" class="text-white" [size]="15" />
          <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" [class]="statusColorClass()"></div>
          
          <!-- Tooltip included in compact -->
          <ng-container *ngTemplateOutlet="tooltipTpl"></ng-container>
        </div>
      }

      @case ('row') {
        <!-- Row Mode (PDF Style: Rectangular small card) -->
        <div 
          class="group relative flex items-center gap-3 p-2.5 bg-white/80 backdrop-blur rounded-xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-indigo-300 hover:bg-white hover:scale-[1.02] transition-all duration-300 cursor-pointer w-full max-w-[260px] mx-auto ring-1 ring-transparent hover:ring-indigo-100"
        >
          <!-- Avatar -->
          <div [class]="'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white shadow-sm transition-transform group-hover:scale-110 ' + roleConfig().color">
             <app-ui-icon [name]="roleConfig().iconName" [size]="16" />
          </div>
          
          <!-- Text -->
          <div class="flex-1 min-w-0 text-left">
            <p class="text-xs font-bold text-slate-800 truncate leading-tight group-hover:text-indigo-700 transition-colors">{{ employee().name }}</p>
            <p class="text-[10px] text-slate-500 truncate mt-0.5 tracking-wide">{{ employee().role }}</p>
          </div>

          <!-- Status Dot -->
          <div [class]="'w-2 h-2 rounded-full shrink-0 ' + statusColorClass()"></div>

          <!-- Reuse Tooltip -->
          <ng-container *ngTemplateOutlet="tooltipTpl"></ng-container>
        </div>
      }

      @default {
        <!-- Card Mode (Large Coordinator/Manager) -->
        <div 
          class="group relative bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:border-indigo-200 overflow-visible shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
        >
          <!-- Inner wrapper for clipping background effects -->
          <div class="absolute inset-0 rounded-2xl overflow-hidden z-0">
             <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <div class="relative z-10">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <div [class]="'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md shadow-slate-200 transform group-hover:rotate-3 transition-transform duration-300 ' + roleConfig().color">
                    <app-ui-icon [name]="roleConfig().iconName" [size]="24" />
                  </div>
                  <div [class]="'absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full border-[3px] border-white ' + statusColorClass()">
                  </div>
                </div>
                <div class="overflow-hidden">
                  <p class="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">{{ employee().name }}</p>
                  <p class="text-xs text-slate-500 truncate mt-0.5">{{ employee().role }}</p>
                  <div class="mt-1.5 flex items-center gap-1.5">
                     <span class="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{{ employee().id }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Performance Bar -->
            <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div class="flex flex-col w-full mr-4">
                <div class="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
                  <span>KPI Global</span>
                  <span [class]="getPerformanceColor(employee().performance)">{{ employee().performance }}%</span>
                </div>
                <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-1000 ease-out" [class]="getPerformanceColorBg(employee().performance)" [style.width.%]="employee().performance"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tooltip for Card Mode -->
          <ng-container *ngTemplateOutlet="tooltipTpl"></ng-container>
        </div>
      }

    }

    <!-- Shared Tooltip Template -->
    <ng-template #tooltipTpl>
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block min-w-[160px] bg-slate-800/95 backdrop-blur-md text-white text-center rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-4 z-50 animate-fadeIn border border-white/10 pointer-events-none ring-1 ring-black/20">
          <div class="text-xs font-bold leading-tight mb-1 tracking-wide text-white">{{employee().name}}</div>
          <div class="text-[10px] text-slate-400 mb-3 pb-2 border-b border-white/10">{{employee().role}}</div>
          <div class="flex items-center justify-between px-1">
             <span class="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Rendimiento</span>
             <span [class]="'text-xs font-bold font-mono ' + getPerformanceColorLight(employee().performance)">{{employee().performance}}%</span>
          </div>
          <!-- Arrow -->
          <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800/95"></div>
      </div>
    </ng-template>
  `,
  styles: [`
    .animate-fadeIn { animation: fadeIn 0.2s cubic-bezier(0.2, 0, 0.2, 1) forwards; }
    @keyframes fadeIn { 
      from { opacity: 0; transform: translate(-50%, 8px) scale(0.95); } 
      to { opacity: 1; transform: translate(-50%, 0) scale(1); } 
    }
  `]
})
export class EmployeeAvatarComponent {
  private dataService = inject(DataService);
  
  employee = input.required<Employee>();
  
  // Changed logic: 'variant' handles the display mode now
  variant = input<AvatarVariant>('card'); 
  
  // Backwards compatibility if needed, though variant is preferred
  compact = input(false); 

  roleConfig = computed(() => this.dataService.getRoleConfig(this.employee().roleKey));
  
  statusColorClass = computed(() => {
    return this.employee().status === 'Activo' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]';
  });

  getPerformanceColor(val: number): string {
    if (val >= 95) return 'text-emerald-600';
    if (val >= 85) return 'text-indigo-600';
    return 'text-amber-600';
  }
  getPerformanceColorLight(val: number): string {
    if (val >= 95) return 'text-emerald-300';
    if (val >= 85) return 'text-indigo-300';
    return 'text-amber-300';
  }
  getPerformanceColorBg(val: number): string {
    if (val >= 95) return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
    if (val >= 85) return 'bg-gradient-to-r from-indigo-500 to-indigo-400';
    return 'bg-gradient-to-r from-amber-500 to-amber-400';
  }
}