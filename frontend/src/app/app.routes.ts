import { Routes } from '@angular/router';

export const routes: Routes = [
  
   { path: '', redirectTo: '/login', pathMatch: 'full' },
   {
     path: 'login',
     loadComponent: () =>
       import('./pages/login/login.component').then((m) => m.LoginComponent),
   },

  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu-principal/menu-principal.component').then(
        (m) => m.MenuPrincipalComponent
      ),
  },

 {
    path: 'pacientes',
    children: [
      {
        path: 'editar',
        loadComponent: () => import('./pages/pacientes/editar/editar.component').then((m) => m.EditarComponent),
      }
    ]
  },

  {
    path: 'usuarios',
    loadComponent: () =>
      import('./pages/usuarios/usuarios.component').then(
        (m) => m.UsuariosComponent
      ),
  },

  {
    path: 'avaliacoes',
    loadComponent: () =>
      import('./pages/avaliacoes/avaliacoes.component').then(
        (m) => m.AvaliacoesComponent
      ),
  },

  {
    path: 'relatorios',
    loadComponent: () =>
      import('./pages/relatorios/relatorios.component').then(
        (m) => m.RelatoriosComponent
      ),
  },

  { path: '**', redirectTo: '/login' },

];
