import { Routes } from '@angular/router';

export const routes: Routes = [
  
   { 
    path: '', 
    redirectTo: 'login',
    pathMatch: 'full'
   },

   {
     path: 'login',
     loadComponent: () =>
       import('./pages/login/login.component').then(
        (m) => m.LoginComponent),
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
      path: 'listar',
      loadComponent: () =>
        import('./pages/pacientes/listar/listar.component')
          .then((m) => m.PacientesComponent),
    },
    {
      path: 'editar',
      loadComponent: () =>
        import('./pages/pacientes/editar/editar.component')
          .then((m) => m.EditarComponent),
    },
    {
      path: 'editar/:id',   
      loadComponent: () =>
        import('./pages/pacientes/editar/editar.component')
          .then((m) => m.EditarComponent),
    },
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
      import('./pages/avaliacoes/listar-avaliacoes/listar-avaliacoes.component').then(
        (m) => m.ListarAvaliacoesComponent
      ),
  },

    {
    path: 'avaliacoes/nova',
    loadComponent: () =>
      import('./pages/avaliacoes/nova-avaliacao/nova-avaliacao.component').then(
        (m) => m.NovaAvaliacaoComponent
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
