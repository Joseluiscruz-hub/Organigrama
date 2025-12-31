import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { IconService } from '../services/icon.service';

@Component({
  selector: 'app-ui-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      [class]="cssClass()" 
      [attr.width]="size()" 
      [attr.height]="size()" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      [innerHTML]="svgContent()">
    </svg>
  `
})
export class UiIconComponent {
  private iconService = inject(IconService);
  private sanitizer = inject(DomSanitizer);

  // Use signal inputs
  name = input('');
  size = input(24);
  cssClass = input('', { alias: 'class' });
  
  // Computed tracks the signals automatically
  svgContent = computed(() => {
    return this.sanitizer.bypassSecurityTrustHtml(this.iconService.getPath(this.name()));
  });
}