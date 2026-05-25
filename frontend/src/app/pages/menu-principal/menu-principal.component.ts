import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../layout/header.component';

interface MenuItem {
  icon: string;
  title: string;
  description: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, HeaderComponent],
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent {
  menuItems: MenuItem[] = [
    { icon: 'pi-users', title: 'Cadastro de Pacientes', description: 'Gerenciar informações de pacientes', route: '/pacientes/editar', color: '#3d7ab5' },
    { icon: 'pi-user-edit', title: 'Cadastro de Usuários', description: 'Administrar usuários do sistema', route: '/usuarios', color: '#2a5f8f' },
    { icon: 'pi-file', title: 'Relatórios', description: 'Visualizar e gerar relatórios', route: '/relatorios', color: '#4a90c4' },
    { icon: 'pi-clipboard', title: 'Avaliações', description: 'Registrar e consultar avaliações', route: '/avaliacoes', color: '#5a8fc4' },
    { icon: 'pi-calendar', title: 'Agendamentos', description: 'Gerenciar consultas e procedimentos', route: '/menu', color: '#3a7ab0' },
    { icon: 'pi-building', title: 'Instituições', description: 'Cadastro de clínicas e hospitais', route: '/menu', color: '#4a8fbf' },
    { icon: 'pi-chart-bar', title: 'Dashboard', description: 'Visão geral e estatísticas', route: '/menu', color: '#2e6a9e' },
    { icon: 'pi-cog', title: 'Configurações', description: 'Ajustes e preferências do sistema', route: '/menu', color: '#1e3a5f' },
  ];

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }
}