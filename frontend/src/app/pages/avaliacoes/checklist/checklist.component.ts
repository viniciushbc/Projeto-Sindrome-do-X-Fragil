import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';


import { Sintoma } from '../../../models/sintoma.model';
import { NovaAvaliacaoInicial, PayloadAvaliacao, RespostaSintoma } from '../../../models/avaliacao.model';
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
    CommonModule,
    FormsModule,
    ToastModule,
    CardModule,
    CheckboxModule,
    ButtonModule,
    DividerModule,
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

    this.avaliacaoService.enviarAvaliacao(payload).subscribe({
      next: () => {
        this.avaliacaoService.limparAvaliacaoInicial();

        this.messageService.add({
          severity: 'success',
          summary: 'Avaliação enviada',
          detail: 'O checklist clínico foi salvo com sucesso.',
        });

        setTimeout(() => this.router.navigate(['/avaliacoes']), 1500);
      },
      error: () => {
        this.enviando = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao enviar',
          detail: 'Não foi possível salvar a avaliação. Tente novamente.',
        });
      },
    });
  }

  trackBySintoma(_: number, item: ItemChecklist): number {
    return item.sintoma.id_sintoma;
  }
}