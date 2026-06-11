import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../layout/header/header.component';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  icon: string;
  title: string;
  description: string;
  route: string;
  color: string;
  permissao?: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, HeaderComponent],
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent implements OnInit {


  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

menuItems: MenuItem[] = [
  {
    icon: 'pi-users',
    title: 'Pacientes',
    description: 'Gerenciar informações de pacientes',
    route: '/pacientes/listar',
    color: '#3d7ab5',
    permissao: 'pacientes'
  },
  {
    icon: 'pi-plus',
    title: 'Avaliações',
    description: 'Registrar e consultar avaliações',
    route: '/avaliacoes',
    color: '#5a8fc4',
    permissao: 'avaliacoes'
  },
  {
    icon: 'pi-calendar',
    title: 'Calendário',
    description: 'Agendar e visualizar consultas',
    route: '/calendario',
    color: '#4a90c4',
    permissao: 'agendamentos'
  },
  {
    icon: 'pi-file',
    title: 'Relatórios',
    description: 'Visualizar e gerar relatórios',
    route: '/relatorios',
    color: '#4a90c4',
    permissao: 'relatorios'
  },
  {
    icon: 'pi-user-edit',
    title: 'Usuários',
    description: 'Administrar usuários do sistema',
    route: '/usuarios',
    color: '#2a5f8f',
    adminOnly: true
  }

];

  mainMenuItems: MenuItem[] =[];
  adminMenuItems: MenuItem[] =[];

  // executa quando a tela do menu é carregada
  ngOnInit(): void {
    this.organizarMenu();
  }


  // navega pra rota do card clicado
  navigate(route: string): void {
    this.router.navigate([route]);
  }

private organizarMenu(): void {

  const usuario = this.authService.getUsuarioLogado();

  console.log('USUARIO LOGADO:', usuario);
  console.log('PERMISSOES:', usuario?.permissoes);

  const permissoes = usuario?.permissoes || [];

  const itensVisiveis = this.menuItems.filter(item => {

    if (item.adminOnly) {
      return this.authService.isAdmin();
    }

    if (this.authService.isAdmin()) {
      return true;
    }

    return item.permissao
      ? permissoes.includes(item.permissao)
      : true;
  });

  console.log('ITENS VISIVEIS:', itensVisiveis);

  this.mainMenuItems = itensVisiveis.filter(item => !item.adminOnly);
  this.adminMenuItems = itensVisiveis.filter(item => item.adminOnly);
}



}


