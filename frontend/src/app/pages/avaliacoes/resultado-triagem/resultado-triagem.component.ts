import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Imports do PrimeNG (TableModule foi removido)
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

import { CriarAvaliacaoResponse } from '../../../models/avaliacao.model';
import { AvaliacaoService } from '../../../services/avaliacao.service';

@Component({
  selector: 'app-resultado-triagem',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    MessageModule,
    DividerModule,
    ButtonModule
  ],
  templateUrl: './resultado-triagem.component.html',
  styleUrls: ['./resultado-triagem.component.css']
})
export class ResultadoTriagemComponent implements OnInit {

  // Variável vazia esperando EXATAMENTE a estrutura do back-end
  resultadoReal: CriarAvaliacaoResponse | null = null;

  constructor(
    private router: Router,
    private avaliacaoService: AvaliacaoService,
  ) {}

  ngOnInit(): void {
    this.avaliacaoService.resultado$.subscribe((dados: CriarAvaliacaoResponse | null) => {
      if (dados) {
        this.resultadoReal = dados;
      } else {
        this.router.navigate(['/avaliacoes/nova']);
      }
    });
  }

  voltar() {
    this.router.navigate(['/pacientes/listar']);
  }

  novaAvaliacao() {
    this.router.navigate(['/avaliacoes/nova']);
  }

  verHistorico() {
    console.log('Navegar para o histórico do paciente (Sprint 6)');
  }
}