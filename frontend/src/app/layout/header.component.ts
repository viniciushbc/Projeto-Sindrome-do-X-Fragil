import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToolbarModule],
  template: `
    <header class="sigma-header">
      <div class="sigma-header__brand">
        <div class="sigma-header__logo">Σ</div>
        <div class="sigma-header__title-group">
          <span class="sigma-header__title">SIGMA</span>
          <span class="sigma-header__subtitle">Sistema Integrado de Gestão Médica</span>
        </div>
      </div>
      <div class="sigma-header__user" *ngIf="showUser">
        <div class="sigma-header__user-info">
          <span class="sigma-header__user-name">{{ userName }}</span>
          <span class="sigma-header__user-role">{{ userRole }}</span>
        </div>
        <button class="sigma-header__logout" (click)="onLogout()" title="Sair">
          <i class="pi pi-sign-out"></i>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .sigma-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--sigma-primary);
      padding: 0 24px;
      height: 64px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .sigma-header__brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sigma-header__logo {
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      font-weight: 700;
    }

    .sigma-header__title-group {
      display: flex;
      flex-direction: column;
    }

    .sigma-header__title {
      color: white;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
    }

    .sigma-header__subtitle {
      color: rgba(255,255,255,0.65);
      font-size: 11px;
      font-weight: 400;
    }

    .sigma-header__user {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .sigma-header__user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .sigma-header__user-name {
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .sigma-header__user-role {
      color: rgba(255,255,255,0.65);
      font-size: 11px;
    }

    .sigma-header__logout {
      background: rgba(255,255,255,0.12);
      border: none;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 16px;
    }

    .sigma-header__logout:hover {
      background: rgba(255,255,255,0.22);
    }
  `]
})
export class HeaderComponent {
  @Input() userName = 'Dr. João Silva';
  @Input() userRole = 'Administrador';
  @Input() showUser = true;

  constructor(private router: Router) {}

  onLogout() {
    this.router.navigate(['/login']);
  }
}
