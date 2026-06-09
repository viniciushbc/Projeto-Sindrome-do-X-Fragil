import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HeaderComponent } from '../../../layout/header/header.component';

import { AvaliacaoService } from '../../../services/avaliacao.service';
import { AvaliacaoResumo } from '../../../models/avaliacao.model';

@Component({
  selector: 'app-listar-avaliacoes',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ToastModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './listar-avaliacoes.component.html',
  styleUrl: './listar-avaliacoes.component.css',
  providers: [MessageService],
})
export class ListarAvaliacoesComponent implements OnInit {

  avaliacoes: AvaliacaoResumo[] = [];
  carregando = false;
  erro = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private avaliacaoService: AvaliacaoService,
  ) {}

  ngOnInit(): void {
    this.carregarAvaliacoes();
  }

  private carregarAvaliacoes(): void {
    this.carregando = true;
    this.erro = false;

    this.avaliacaoService.listarAvaliacoes().subscribe({
      next: (dados) => {
        this.avaliacoes = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as avaliações.',
        });
      },
    });
  }

  novaAvaliacao(): void {
    this.router.navigate(['/avaliacoes/nova']);
  }

  scorePercent(score: number): number {
    return Math.round(score * 100);
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatarSexo(sexo: string): string {
    return sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Feminino' : sexo;
  }

  getSeverity(resultado: string): 'danger' | 'success' {  return resultado === 'ENCAMINHAR' ? 'danger' : 'success';}

  getResultadoLabel(resultado: string): string {
    return resultado === 'ENCAMINHAR' ? 'Encaminhar' : 'Não encaminhar';
  }
}