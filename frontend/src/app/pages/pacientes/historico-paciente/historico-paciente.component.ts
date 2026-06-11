import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { HeaderComponent } from '../../../layout/header/header.component';
import { AvaliacaoService } from '../../../services/avaliacao.service';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente.model';

@Component({
  selector: 'app-historico-paciente',
  standalone: true,
  imports: [
    CommonModule, HeaderComponent, CardModule, TableModule, TagModule,
    ButtonModule, ToolbarModule, ToastModule, ProgressSpinnerModule, DividerModule
  ],
  templateUrl: './historico-paciente.component.html',
  styleUrl: './historico-paciente.component.css',
  providers: [MessageService]
})
export class HistoricoPacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  avaliacoes: any[] = [];
  carregando = false;
  erro = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private avaliacaoService: AvaliacaoService,
    private pacienteService: PacienteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.router.navigate(['/pacientes/listar']); return; }
    this.carregarDados(id);
  }

  carregarDados(id: number): void {
    this.carregando = true;
    this.pacienteService.buscarPorId(id).subscribe({
      next: (p: Paciente) => {
        this.paciente = p;
        this.avaliacaoService.buscarPorPaciente(id).subscribe({
          next: (avs: any[]) => { this.avaliacoes = avs; this.carregando = false; },
          error: (_e: any) => { this.erro = 'Não foi possível carregar o histórico de avaliações.'; this.carregando = false; }
        });
      },
      error: (_e: any) => { this.erro = 'Paciente não encontrado.'; this.carregando = false; }
    });
  }

  getTagSeverity(resultado: string): 'danger' | 'success' {
    return resultado === 'ENCAMINHAR' ? 'danger' : 'success';
  }

  getTagLabel(resultado: string): string {
    return resultado === 'ENCAMINHAR' ? 'Encaminhar' : 'Não Encaminhar';
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/avaliacoes', id]);
  }

  voltar(): void { this.router.navigate(['/pacientes/listar']); }
  novaAvaliacao(): void { this.router.navigate(['/avaliacoes/nova']); }
}