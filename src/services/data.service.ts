import { Employee, Role, Objective, Team } from './models';

export class DataService {
    private ROLES: Role[] = [
        { key: 'GERENTE', name: 'Gerente' },
        { key: 'EMPLEADO', name: 'Empleado' }
    ];

    private OBJECTIVES: Objective[] = [
        { id: 1, name: 'Objective 1' },
        { id: 2, name: 'Objective 2' }
    ];

    private TEAMS: Team[] = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' }
    ];

    generateData(): Employee {
        return {
            id: 'EMP-001',
            name: 'Jorge Mateos',
            role: 'Gerente de Operaciones',
            roleKey: 'GERENTE',
            blockId: 0,
            performance: 95,
            years: 10,
            status: 'Activo',
            email: 'jorge.mateos@empresa.com',
            phone: '+52 55 1234 5678'
        };
    }

    getRoleConfig(roleKey: string): Role | undefined {
        return this.ROLES.find(role => role.key === roleKey);
    }

    getTeamName(teamId: number): string | undefined {
        const team = this.TEAMS.find(t => t.id === teamId);
        return team ? team.name : undefined;
    }
}