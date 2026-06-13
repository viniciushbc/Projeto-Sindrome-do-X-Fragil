import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './acesso-negado.component.html',
  styleUrl: './acesso-negado.component.css'
})
export class AcessoNegadoComponent {
  constructor(private router: Router) {}
  voltar(): void { this.router.navigate(['/menu']); }
}