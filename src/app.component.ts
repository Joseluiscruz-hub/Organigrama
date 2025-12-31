
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { Employee, RoleKey, AppData } from './types';
import { UiIconComponent } from './components/ui-icon.component';
import { StatCardComponent } from './components/stat-card.component';
import { EmployeeAvatarComponent } from './components/employee-avatar.component';
import { EmployeeModalComponent } from './components/employee-modal.component';
import { TeamPerformanceComponent } from './components/team-performance.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    UiIconComponent,
    StatCardComponent,
    EmployeeAvatarComponent,
    EmployeeModalComponent,
    TeamPerformanceComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private dataService = inject(DataService);

  // Signals for state management
  data = signal<AppData | null>(null);
  isLoading = signal(true);
  selectedEmployee = signal<Employee | null>(null);
  searchTerm = signal('');
  uploadSuccess = signal(false);

  ngOnInit() {
    // Simulate network latency
    setTimeout(() => {
      this.data.set(this.dataService.generateData());
      this.isLoading.set(false);
    }, 2000);
  }

  // Computed signal for filtered employees in search
  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const d = this.data();
    
    // Safety check for null data during loading
    if (!term || !d) return [];

    const allEmployees: Employee[] = [d.manager];
    
    d.blocks.forEach(block => {
      allEmployees.push(...block.staff.coordinators);
      allEmployees.push(...block.staff.operators);
      allEmployees.push(...block.staff.auxiliaries);
      allEmployees.push(...block.staff.lashers);
    });

    return allEmployees.filter(e => 
      e.name.toLowerCase().includes(term) || 
      e.id.toLowerCase().includes(term)
    );
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  updateSearchToEmpty() {
    this.searchTerm.set('');
  }

  selectEmployee(emp: Employee) {
    this.selectedEmployee.set(emp);
  }

  closeModal() {
    this.selectedEmployee.set(null);
  }

  // CSV Template Functionality
  downloadTemplate() {
    const headers = ['ID_EMPLEADO', 'NOMBRE_COMPLETO', 'ROL_CLAVE', 'EQUIPO', 'KPI_PERFORMANCE', 'ESTATUS', 'EMAIL', 'TELEFONO'];
    const exampleRow = ['EMP-999', 'Ejemplo Empleado', 'MONTACARGUISTA', 'GLADIADORES', '95', 'Activo', 'ejemplo@empresa.com', '+52 55 1234 5678'];
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), exampleRow.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_carga_personal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  triggerFileInput() {
    const fileInput = document.getElementById('csvUploadInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Simulation of processing
        console.log('CSV Content loaded:', e.target?.result);
        
        // Show success indicator
        this.uploadSuccess.set(true);
        setTimeout(() => this.uploadSuccess.set(false), 3000);
        
        // Reset input
        input.value = '';
      };
      
      reader.readAsText(file);
    }
  }

  // Helpers for the search dropdown
  getRoleColor(key: RoleKey): string {
    return this.dataService.getRoleConfig(key).color;
  }

  getRoleIcon(key: RoleKey): string {
    return this.dataService.getRoleConfig(key).iconName;
  }
}
