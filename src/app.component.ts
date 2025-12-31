
import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { Employee, RoleKey, AppData } from './types';
import { UiIconComponent } from './components/ui-icon.component';
import { EmployeeAvatarComponent } from './components/employee-avatar.component';
import { EmployeeModalComponent } from './components/employee-modal.component';
import { TeamPerformanceComponent } from './components/team-performance.component';
import { ExecutiveSummaryComponent } from './components/executive-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    UiIconComponent,
    EmployeeAvatarComponent,
    EmployeeModalComponent,
    TeamPerformanceComponent,
    ExecutiveSummaryComponent
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
  
  // Dark mode
  darkMode = signal(false);
  
  // Filters
  filterTeam = signal<number | null>(null);
  filterRole = signal<RoleKey | null>(null);
  filterStatus = signal<'Activo' | 'Ausente' | null>(null);
  showFilters = signal(false);

  constructor() {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      this.darkMode.set(savedDarkMode === 'true');
    }
    
    // Persist dark mode changes
    effect(() => {
      localStorage.setItem('darkMode', String(this.darkMode()));
      document.documentElement.classList.toggle('dark', this.darkMode());
    });
    
    // Load saved data from localStorage
    const savedData = localStorage.getItem('orgData');
    if (savedData) {
      try {
        this.data.set(JSON.parse(savedData));
        this.isLoading.set(false);
      } catch {
        this.loadFreshData();
      }
    }
  }

  ngOnInit() {
    if (!this.data()) {
      this.loadFreshData();
    }
  }
  
  private loadFreshData() {
    // Simulate network latency
    setTimeout(() => {
      const newData = this.dataService.generateData();
      this.data.set(newData);
      localStorage.setItem('orgData', JSON.stringify(newData));
      this.isLoading.set(false);
    }, 2000);
  }
  
  toggleDarkMode() {
    this.darkMode.update(v => !v);
  }
  
  toggleFilters() {
    this.showFilters.update(v => !v);
  }
  
  setFilterTeam(teamId: number | null) {
    this.filterTeam.set(teamId);
  }
  
  setFilterRole(role: RoleKey | null) {
    this.filterRole.set(role);
  }
  
  setFilterStatus(status: 'Activo' | 'Ausente' | null) {
    this.filterStatus.set(status);
  }
  
  clearFilters() {
    this.filterTeam.set(null);
    this.filterRole.set(null);
    this.filterStatus.set(null);
  }
  
  get hasActiveFilters(): boolean {
    return this.filterTeam() !== null || this.filterRole() !== null || this.filterStatus() !== null;
  }

  // Computed signal for filtered employees in search
  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const d = this.data();
    const teamFilter = this.filterTeam();
    const roleFilter = this.filterRole();
    const statusFilter = this.filterStatus();
    
    // Safety check for null data during loading
    if (!d) return [];

    const allEmployees: Employee[] = [d.manager];
    
    d.blocks.forEach(block => {
      allEmployees.push(...block.staff.coordinators);
      allEmployees.push(...block.staff.operators);
      allEmployees.push(...block.staff.auxiliaries);
      allEmployees.push(...block.staff.lashers);
    });

    return allEmployees.filter(e => {
      // Text search
      const matchesSearch = !term || e.name.toLowerCase().includes(term) || e.id.toLowerCase().includes(term);
      
      // Filters
      const matchesTeam = teamFilter === null || e.blockId === teamFilter;
      const matchesRole = roleFilter === null || e.roleKey === roleFilter;
      const matchesStatus = statusFilter === null || e.status === statusFilter;
      
      return matchesSearch && matchesTeam && matchesRole && matchesStatus;
    });
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

  // CSV Error handling
  csvError = signal<string | null>(null);
  csvImportedCount = signal(0);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.processCSV(content);
        input.value = '';
      };
      
      reader.readAsText(file);
    }
  }
  
  private processCSV(content: string) {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      this.csvError.set('El archivo CSV está vacío o no tiene datos.');
      setTimeout(() => this.csvError.set(null), 5000);
      return;
    }
    
    const headers = lines[0].split(',').map(h => h.trim().toUpperCase());
    const requiredHeaders = ['ID_EMPLEADO', 'NOMBRE_COMPLETO', 'ROL_CLAVE', 'EQUIPO', 'KPI_PERFORMANCE', 'ESTATUS'];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      this.csvError.set(`Columnas faltantes: ${missingHeaders.join(', ')}`);
      setTimeout(() => this.csvError.set(null), 5000);
      return;
    }
    
    const validRoles: RoleKey[] = ['GERENTE', 'COORD', 'MONTACARGUISTA', 'AUXILIAR', 'AMARRADOR'];
    const validTeams = ['GLADIADORES', 'ARMAGEDON', 'CRACKS', 'X-MEN'];
    
    let importedCount = 0;
    const errors: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < requiredHeaders.length) {
        errors.push(`Línea ${i + 1}: datos incompletos`);
        continue;
      }
      
      const roleIndex = headers.indexOf('ROL_CLAVE');
      const teamIndex = headers.indexOf('EQUIPO');
      const role = values[roleIndex]?.toUpperCase() as RoleKey;
      const team = values[teamIndex]?.toUpperCase();
      
      if (!validRoles.includes(role)) {
        errors.push(`Línea ${i + 1}: rol inválido "${values[roleIndex]}"`);
        continue;
      }
      
      if (!validTeams.includes(team) && team !== 'GERENCIA') {
        errors.push(`Línea ${i + 1}: equipo inválido "${values[teamIndex]}"`);
        continue;
      }
      
      importedCount++;
    }
    
    if (errors.length > 0 && importedCount === 0) {
      this.csvError.set(`Errores: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}`);
      setTimeout(() => this.csvError.set(null), 5000);
      return;
    }
    
    this.csvImportedCount.set(importedCount);
    this.uploadSuccess.set(true);
    setTimeout(() => {
      this.uploadSuccess.set(false);
      this.csvImportedCount.set(0);
    }, 3000);
    
    console.log(`CSV procesado: ${importedCount} registros válidos`, errors.length > 0 ? `con ${errors.length} errores` : '');
  }
  
  refreshData() {
    this.isLoading.set(true);
    localStorage.removeItem('orgData');
    this.loadFreshData();
  }

  // Helpers for the search dropdown
  getRoleColor(key: RoleKey): string {
    return this.dataService.getRoleConfig(key).color;
  }

  getRoleIcon(key: RoleKey): string {
    return this.dataService.getRoleConfig(key).iconName;
  }
}
