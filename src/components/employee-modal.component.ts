import { Component, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../types';
import { DataService } from '../services/data.service';
import { UiIconComponent } from './ui-icon.component';

@Component({
  selector: 'app-employee-modal',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="close()"></div>
      
      <!-- Modal Content -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all animate-slideUp z-10">
        
        <!-- Header color -->
        <div [class]="'h-24 relative ' + roleConfig().color">
          <button (click)="close()" class="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-1.5 rounded-full text-white transition-colors cursor-pointer z-20">
            <app-ui-icon name="x" [size]="20" />
          </button>
          
          <!-- Avatar container -->
          <div class="absolute -bottom-10 left-8">
            <div class="w-24 h-24 bg-white dark:bg-slate-800 rounded-full p-1.5 shadow-xl">
              <div [class]="'w-full h-full rounded-full flex items-center justify-center text-white ' + roleConfig().color">
                <app-ui-icon [name]="roleConfig().iconName" [size]="40" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="pt-14 pb-8 px-8">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ employee().name }}</h2>
              <p class="text-slate-500 dark:text-slate-400 font-medium">{{ employee().role }}</p>
              
              <div class="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border"
                [class.bg-green-50]="employee().status === 'Activo'"
                [class.text-green-700]="employee().status === 'Activo'"
                [class.border-green-200]="employee().status === 'Activo'"
                [class.dark:bg-green-900/50]="employee().status === 'Activo'"
                [class.dark:text-green-400]="employee().status === 'Activo'"
                [class.dark:border-green-800]="employee().status === 'Activo'"
                [class.bg-red-50]="employee().status !== 'Activo'"
                [class.text-red-700]="employee().status !== 'Activo'"
                [class.border-red-200]="employee().status !== 'Activo'"
                [class.dark:bg-red-900/50]="employee().status !== 'Activo'"
                [class.dark:text-red-400]="employee().status !== 'Activo'"
                [class.dark:border-red-800]="employee().status !== 'Activo'"
              >
                {{ employee().status }}
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">ID Corp</p>
              <p class="font-mono font-bold text-slate-700 dark:text-slate-200 text-lg">{{ employee().id }}</p>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-2 gap-4">
            <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
              <div class="flex items-center text-slate-500 dark:text-slate-400 mb-2">
                <app-ui-icon name="barChart" [size]="16" class="mr-2" />
                <span class="text-xs font-bold uppercase tracking-wide">KPI</span>
              </div>
              <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ employee().performance }}%</p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
              <div class="flex items-center text-slate-500 dark:text-slate-400 mb-2">
                <app-ui-icon name="award" [size]="16" class="mr-2" />
                <span class="text-xs font-bold uppercase tracking-wide">Exp.</span>
              </div>
              <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ employee().years }} <span class="text-sm text-slate-400 font-normal">Años</span></p>
            </div>
          </div>

          <div class="mt-8 space-y-4">
            <!-- Email with action -->
            <a 
              [href]="'mailto:' + employee().email"
              class="flex items-center text-slate-700 dark:text-slate-300 p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors group cursor-pointer"
            >
              <div class="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full mr-3 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <app-ui-icon name="mail" [size]="16" />
              </div>
              <span class="text-sm font-medium flex-1">{{ employee().email }}</span>
              <app-ui-icon name="messageSend" [size]="14" class="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <!-- Phone with WhatsApp action -->
            <a 
              [href]="getWhatsAppLink()"
              target="_blank"
              class="flex items-center text-slate-700 dark:text-slate-300 p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors group cursor-pointer"
            >
              <div class="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full mr-3 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <app-ui-icon name="whatsapp" [size]="16" />
              </div>
              <span class="text-sm font-medium flex-1">{{ employee().phone }}</span>
              <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
            </a>
            
            <!-- Phone Call -->
            <a 
              [href]="'tel:' + employee().phone"
              class="flex items-center text-slate-700 dark:text-slate-300 p-2 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition-colors group cursor-pointer"
            >
              <div class="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-full mr-3 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                <app-ui-icon name="phone" [size]="16" />
              </div>
              <span class="text-sm font-medium flex-1">Llamar directo</span>
              <app-ui-icon name="chevronRight" [size]="14" class="text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            
            <!-- Location -->
            <div class="flex items-center text-slate-700 dark:text-slate-300 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
               <div class="bg-slate-100 dark:bg-slate-700 p-2 rounded-full mr-3 text-slate-500 dark:text-slate-400">
                <app-ui-icon name="mapPin" [size]="16" />
               </div>
              <span class="text-sm font-medium">
                @if (employee().blockId === 0) {
                  Oficina Central - Gerencia
                } @else {
                  Equipo {{ getBlockName(employee().blockId) }}
                }
              </span>
            </div>
          </div>
          
          <!-- Quick Actions Bar -->
          <div class="mt-6 grid grid-cols-3 gap-2">
            <a 
              [href]="'mailto:' + employee().email"
              class="flex flex-col items-center gap-1 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <app-ui-icon name="mail" [size]="20" />
              <span class="text-[10px] font-bold">Email</span>
            </a>
            <a 
              [href]="getWhatsAppLink()"
              target="_blank"
              class="flex flex-col items-center gap-1 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <app-ui-icon name="whatsapp" [size]="20" />
              <span class="text-[10px] font-bold">WhatsApp</span>
            </a>
            <a 
              [href]="'tel:' + employee().phone"
              class="flex flex-col items-center gap-1 p-3 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
            >
              <app-ui-icon name="phone" [size]="20" />
              <span class="text-[10px] font-bold">Llamar</span>
            </a>
          </div>
          
          <div class="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button 
              (click)="close()"
              class="px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-500 transition shadow-lg hover:shadow-xl font-medium text-sm flex items-center"
            >
              <span>Cerrar Tarjeta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slideUp {
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class EmployeeModalComponent {
  private dataService = inject(DataService);
  
  employee = input.required<Employee>();
  onClose = output<void>();

  roleConfig = computed(() => this.dataService.getRoleConfig(this.employee().roleKey));

  close() {
    this.onClose.emit();
  }

  getBlockName(id: number): string {
    return this.dataService.getTeamName(id);
  }
  
  getWhatsAppLink(): string {
    // Clean phone number and create WhatsApp link
    const phone = this.employee().phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${phone}?text=Hola%20${encodeURIComponent(this.employee().name)},%20te%20contacto%20desde%20el%20Sistema%20de%20Organigrama.`;
  }
}