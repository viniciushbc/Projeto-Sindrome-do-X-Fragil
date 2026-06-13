import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { HeaderComponent } from '../../../layout/header/header.component';
import { CriarAvaliacaoResponse } from '../../../models/avaliacao.model';
import { AvaliacaoService } from '../../../services/avaliacao.service';

@Component({
  selector: 'app-resultado-triagem',
  standalone: true,
  imports: [
    CommonModule, HeaderComponent, TagModule, ButtonModule, TableModule, ToastModule
  ],
  templateUrl: './resultado-triagem.component.html',
  styleUrls: ['./resultado-triagem.component.css'],
  providers: [MessageService]
})
export class ResultadoTriagemComponent implements OnInit {
  resultadoReal: CriarAvaliacaoResponse | null = null;
  detalheAvaliacao: any = null;
  carregandoDetalhe = false;

  constructor(
    private router: Router,
    private avaliacaoService: AvaliacaoService,
  ) {}

  ngOnInit(): void {
    this.avaliacaoService.resultado$.subscribe((dados: CriarAvaliacaoResponse | null) => {
      if (dados) {
        this.resultadoReal = dados;
        this.carregarDetalhe(dados.id_avaliacao);
      } else {
        this.router.navigate(['/avaliacoes/nova']);
      }
    });
  }

  carregarDetalhe(id: number): void {
    this.carregandoDetalhe = true;
    this.avaliacaoService.buscarPorId(id).subscribe({
      next: (av: any) => { this.detalheAvaliacao = av; this.carregandoDetalhe = false; },
      error: (_err: any) => { this.carregandoDetalhe = false; }
    });
  }

  getSintomosPresentes(): any[] {
    if (!this.detalheAvaliacao?.respostas) return [];
    return this.detalheAvaliacao.respostas.filter((r: any) => r.presente);
  }

  voltar(): void { this.router.navigate(['/pacientes/listar']); }
  novaAvaliacao(): void { this.router.navigate(['/avaliacoes/nova']); }

  verHistorico(): void {
    const idPaciente = this.resultadoReal?.id_paciente
      ?? this.detalheAvaliacao?.paciente?.id_paciente;
    if (idPaciente) {
      this.router.navigate(['/pacientes', idPaciente, 'historico']);
    } else {
      this.router.navigate(['/avaliacoes']);
    }
  }

  verDetalhes(): void {
    if (this.resultadoReal?.id_avaliacao) {
      this.router.navigate(['/avaliacoes', this.resultadoReal.id_avaliacao]);
    }
  }
}