import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },

  { path: 'acesso-negado',
    loadComponent: () => import('./pages/acesso-negado/acesso-negado.component').then(m => m.AcessoNegadoComponent) },

  { path: 'menu', canActivate: [authGuard],
    loadComponent: () => import('./pages/menu-principal/menu-principal.component').then(m => m.MenuPrincipalComponent) },

  { path: 'pacientes', canActivate: [authGuard], children: [
    { path: 'listar', loadComponent: () => import('./pages/pacientes/listar/listar.component').then(m => m.PacientesComponent) },
    { path: 'editar', loadComponent: () => import('./pages/pacientes/editar/editar.component').then(m => m.EditarComponent) },
    { path: 'editar/:id', loadComponent: () => import('./pages/pacientes/editar/editar.component').then(m => m.EditarComponent) },
  ]},

  { path: 'pacientes/:id/historico', canActivate: [authGuard],
    loadComponent: () => import('./pages/pacientes/historico-paciente/historico-paciente.component').then(m => m.HistoricoPacienteComponent) },

  { path: 'usuarios', canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent) },

  { path: 'logs', canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/logs/logs.component').then(m => m.LogsComponent) },

  { path: 'avaliacoes', canActivate: [authGuard],
    loadComponent: () => import('./pages/avaliacoes/listar-avaliacoes/listar-avaliacoes.component').then(m => m.ListarAvaliacoesComponent) },

  { path: 'avaliacoes/nova', canActivate: [authGuard],
    loadComponent: () => import('./pages/avaliacoes/nova-avaliacao/nova-avaliacao.component').then(m => m.NovaAvaliacaoComponent) },

  { path: 'avaliacoes/checklist', canActivate: [authGuard],
    loadComponent: () => import('./pages/avaliacoes/checklist/checklist.component').then(m => m.ChecklistComponent) },

  { path: 'avaliacoes/resultado', canActivate: [authGuard],
    loadComponent: () => import('./pages/avaliacoes/resultado-triagem/resultado-triagem.component').then(m => m.ResultadoTriagemComponent) },

  { path: 'avaliacoes/:id', canActivate: [authGuard],
    loadComponent: () => import('./pages/avaliacoes/detalhe-avaliacao/detalhe-avaliacao.component').then(m => m.DetalheAvaliacaoComponent) },

  { path: 'relatorios', canActivate: [authGuard],
    loadComponent: () => import('./pages/relatorios/relatorios.component').then(m => m.RelatoriosComponent) },

  { path: '**', redirectTo: '/login' },
];