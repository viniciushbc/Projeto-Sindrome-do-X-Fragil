import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})


export class HeaderComponent implements OnInit {
  @Input() userName = 'Usuário';
  @Input() userRole = 'Usuário Padrão';
  @Input() showUser = true;

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  // Esse metodo é executado pelo angular assim q o componente é criado, a ideia é subsituir os dados com os dados do usuáiro que fez login
  ngOnInit(): void {

    if (this.authService.getUsuarioLogado()) {
      this.userName = this.authService.getNomeUsuario();
      this.userRole = this.authService.getTipoUsuarioLabel();

    }

  }

  onLogout(): void {

    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
