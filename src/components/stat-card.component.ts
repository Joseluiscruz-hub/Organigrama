import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiIconComponent } from './ui-icon.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  template: `
    <div class="group bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-lg hover:border-indigo-100 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden">
      
      <!-- Decorative background blur -->
      <div [class]="'absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ' + bgColorClass()"></div>

      <div [class]="'p-3 rounded-lg bg-opacity-10 transition-transform duration-300 group-hover:scale-110 ' + bgColorClass()">
        <app-ui-icon [name]="iconName()" [class]="'w-6 h-6 ' + textColorClass()" [size]="24" />
      </div>
      <div class="relative z-10">
        <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold group-hover:text-slate-700 transition-colors">{{ label() }}</p>
        <p class="text-2xl font-bold text-slate-800">{{ value() }}</p>
      </div>
    </div>
  `
})
export class StatCardComponent {
  label = input('');
  value = input<string | number>('');
  iconName = input('');
  bgColorClass = input('');
  textColorClass = input('');
}