import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HeaderComponent } from '../../../layout/header/header.component';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Sintoma } from '../../../models/sintoma.model';
import { CriarAvaliacaoResponse, NovaAvaliacaoInicial, PayloadAvaliacao, RespostaSintoma } from '../../../models/avaliacao.model';
import { SintomasService } from '../../../services/sintoma.service';
import { AvaliacaoService } from '../../../services/avaliacao.service';

interface ItemChecklist {
  sintoma: Sintoma;
  presente: boolean;
}

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    ToastModule,
    CardModule,
    CheckboxModule,
    ButtonModule,
    DividerModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css',
  providers: [MessageService],
})
export class ChecklistComponent implements OnInit {

  avaliacaoInicial: NovaAvaliacaoInicial | null = null;

  sintomas: ItemChecklist[] = [];
  carregandoSintomas = false;
  erroCarregamento = false;
  enviando = false;

  resultado: CriarAvaliacaoResponse | null = null;

  private readonly ID_MACROORQUIDISMO = 3;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private sintomasService: SintomasService,
    private avaliacaoService: AvaliacaoService,
  ) {}

  ngOnInit(): void {
    this.avaliacaoInicial = this.avaliacaoService.obterAvaliacaoInicial();

    if (!this.avaliacaoInicial) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Nenhuma avaliação em andamento. Redirecionando...',
      });
      this.router.navigate(['/avaliacoes/nova']);
      return;
    }

    this.carregarSintomas();
  }

  private carregarSintomas(): void {
    this.carregandoSintomas = true;
    this.erroCarregamento = false;

    this.sintomasService.listarSintomas().subscribe({
      next: (sintomas) => {
        this.sintomas = sintomas.map((s) => ({ sintoma: s, presente: false }));
        this.carregandoSintomas = false;
      },
      error: () => {
        this.erroCarregamento = true;
        this.carregandoSintomas = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os sintomas.',
        });
      },
    });
  }

  isNaoAplicavel(sintoma: Sintoma): boolean {
    if (sintoma.id_sintoma !== this.ID_MACROORQUIDISMO) return false;
    return this.avaliacaoInicial?.paciente?.sexo === 'F';
  }

  contagemPresentes(): number {
    return this.sintomas.filter(
      (item) => item.presente && !this.isNaoAplicavel(item.sintoma),
    ).length;
  }

  totalAplicaveis(): number {
    return this.sintomas.filter((item) => !this.isNaoAplicavel(item.sintoma)).length;
  }

  limparSelecoes(): void {
    this.sintomas.forEach((item) => {
      if (!this.isNaoAplicavel(item.sintoma)) {
        item.presente = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/avaliacoes/nova']);
  }

  novaAvaliacao(): void {
    this.resultado = null;
    this.avaliacaoService.limparAvaliacaoInicial();
    this.router.navigate(['/avaliacoes/nova']);
  }

  irParaListagem(): void {
    this.resultado = null;
    this.avaliacaoService.limparAvaliacaoInicial();
    this.router.navigate(['/avaliacoes']);
  }

  enviarAvaliacao(): void {
    if (!this.avaliacaoInicial) return;

    if (this.sintomas.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'A lista de sintomas não foi carregada.',
      });
      return;
    }

    const respostas: RespostaSintoma[] = this.sintomas.map((item) => ({
      id_sintoma: item.sintoma.id_sintoma,
      presente: this.isNaoAplicavel(item.sintoma) ? false : item.presente,
    }));

    const payload: PayloadAvaliacao = {
      id_paciente: this.avaliacaoInicial.id_paciente,
      respondente_nome: this.avaliacaoInicial.nome_respondente,
      respondente_parentesco: this.avaliacaoInicial.relacao_respondente,
      respondente_documento: this.avaliacaoInicial.respondente_documento,
      observacoes: this.avaliacaoInicial.observacoes,
      respostas,
    };

    this.enviando = true;

    this.avaliacaoService.criarAvaliacao(payload).subscribe({
      next: (resposta) => {
        this.enviando = false;
        this.resultado = resposta;
        this.avaliacaoService.limparAvaliacaoInicial();
        this.avaliacaoService.setResultado(resposta);
        this.router.navigate(['/avaliacoes/resultado']);
      },
      error: (erro: HttpErrorResponse) => {
        this.enviando = false;

        if (erro.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Sessão expirada',
            detail: 'Sessão expirada. Faça login novamente.',
            life: 4000,
          });
          setTimeout(() => this.router.navigate(['/login']), 2000);
          return;
        }

        if (erro.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Servidor indisponível',
            detail: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
            life: 5000,
          });
          return;
        }

        const detalhe = erro.error?.message || 'Não foi possível salvar a avaliação. Tente novamente.';
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao enviar',
          detail: detalhe,
          life: 5000,
        });
      },
    });
  }

  get scorePercent(): number {
    if (!this.resultado) return 0;
    return Math.round(this.resultado.score * 100);
  }

  get deveEncaminhar(): boolean {
    return this.resultado?.resultado === 'ENCAMINHAR';
  }

  trackBySintoma(_: number, item: ItemChecklist): number {
    return item.sintoma.id_sintoma;
  }
}