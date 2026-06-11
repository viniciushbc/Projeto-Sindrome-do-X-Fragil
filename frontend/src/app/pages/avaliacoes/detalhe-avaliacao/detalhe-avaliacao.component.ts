import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HeaderComponent } from '../../../layout/header/header.component';
import { AvaliacaoService } from '../../../services/avaliacao.service';

@Component({
  selector: 'app-detalhe-avaliacao',
  standalone: true,
  imports: [
    CommonModule, HeaderComponent, CardModule, TableModule, TagModule,
    MessageModule, DividerModule, ButtonModule, ToastModule, ProgressSpinnerModule
  ],
  templateUrl: './detalhe-avaliacao.component.html',
  styleUrl: './detalhe-avaliacao.component.css',
  providers: [MessageService]
})
export class DetalheAvaliacaoComponent implements OnInit {
  avaliacao: any = null;
  carregando = false;
  erro = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private avaliacaoService: AvaliacaoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.router.navigate(['/avaliacoes']); return; }
    this.carregarAvaliacao(id);
  }

  carregarAvaliacao(id: number): void {
    this.carregando = true;
    this.avaliacaoService.buscarPorId(id).subscribe({
      next: (av: any) => { this.avaliacao = av; this.carregando = false; },
      error: (err: any) => {
        this.erro = err.status === 403 ? 'Acesso negado.' : 'Não foi possível carregar os dados.';
        this.carregando = false;
      }
    });
  }

  getTagSeverity(resultado: string): 'danger' | 'success' {
    return resultado === 'ENCAMINHAR' ? 'danger' : 'success';
  }

  getTagLabel(resultado: string): string {
    return resultado === 'ENCAMINHAR' ? 'ENCAMINHAR' : 'NÃO ENCAMINHAR';
  }

  getSintomaTagSeverity(presente: boolean): 'success' | 'secondary' {
    return presente ? 'success' : 'secondary';
  }

  voltar(): void { this.router.navigate(['/avaliacoes']); }

  voltarHistorico(): void {
    if (this.avaliacao?.paciente?.id_paciente) {
      this.router.navigate(['/pacientes', this.avaliacao.paciente.id_paciente, 'historico']);
    } else {
      this.router.navigate(['/avaliacoes']);
    }
  }

  novaAvaliacao(): void { this.router.navigate(['/avaliacoes/nova']); }
  voltarPacientes(): void { this.router.navigate(['/pacientes/listar']); }
  imprimir(): void { window.print(); }
}