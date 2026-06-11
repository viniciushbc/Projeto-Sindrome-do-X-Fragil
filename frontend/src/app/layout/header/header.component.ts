import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';

const ACESSO_ADMIN = ['pacientes','avaliacoes','relatorios','agendamentos','usuarios','logs'];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input() showUser = true;

  userName = 'Usuário';
  userRole = 'Usuário Padrão';

  private acessosUsuario: string[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const u = this.authService.getUsuarioLogado();
    if (u) {
      this.userName = this.authService.getNomeUsuario();
      this.userRole = this.authService.getTipoUsuarioLabel();

      if (u.tipo_usuario === 'ADMIN') {
        this.acessosUsuario = [...ACESSO_ADMIN];
      } else {
        // permissões armazenadas no token/localStorage
        this.acessosUsuario = u.permissoes || ['pacientes','avaliacoes'];
      }
    }
  }

  temAcesso(modulo: string): boolean {
    const u = this.authService.getUsuarioLogado();
    if (!u) return false;
    if (u.tipo_usuario === 'ADMIN') return true;
    return this.acessosUsuario.includes(modulo);
  }

  isAdmin(): boolean { return this.authService.isAdmin(); }

  navigate(path: string): void { this.router.navigate([path]); }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}