import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { HeaderComponent } from '../../layout/header/header.component';

import { AvaliacaoService } from '../../services/avaliacao.service';
import { PacienteService } from '../../services/paciente.service';
import { AuthService } from '../../services/auth.service';
import { RelatorioItem } from '../../models/avaliacao.model';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    ToastModule,
    CardModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    ProgressSpinnerModule,
    DividerModule,
  ],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css',
  providers: [MessageService],
})
export class RelatoriosComponent implements OnInit {

  registros: RelatorioItem[] = [];
  pacientes: Paciente[] = [];
  usuarios: any[] = [];

  carregando = false;
  erro = false;

  // Filtros
  dataInicio: Date | null = null;
  dataFim: Date | null = null;
  pacienteSelecionado: number | null = null;
  usuarioSelecionado: number | null = null;
  resultadoSelecionado: string = 'TODOS';

  opcoesResultado = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Encaminhar', value: 'ENCAMINHAR' },
    { label: 'Não encaminhar', value: 'NAO_ENCAMINHAR' },
  ];

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  constructor(
    private avaliacaoService: AvaliacaoService,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
    this.buscar();
  }

  private carregarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (p) => { this.pacientes = p; },
      error: () => {},
    });
  }

  buscar(): void {
    this.carregando = true;
    this.erro = false;

    const filtros: any = {};

    if (this.dataInicio) filtros['dataInicio'] = this.formatarDataParam(this.dataInicio);
    if (this.dataFim)    filtros['dataFim']    = this.formatarDataParam(this.dataFim);
    if (this.pacienteSelecionado) filtros['idPaciente'] = this.pacienteSelecionado;
    if (this.usuarioSelecionado)  filtros['idUsuario']  = this.usuarioSelecionado;
    if (this.resultadoSelecionado && this.resultadoSelecionado !== 'TODOS')
      filtros['resultado'] = this.resultadoSelecionado;

    this.avaliacaoService.buscarRelatorios(filtros).subscribe({
      next: (dados) => {
        this.registros = dados;
        this.carregando = false;
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os relatórios.',
        });
      },
    });
  }

  limparFiltros(): void {
    this.dataInicio = null;
    this.dataFim = null;
    this.pacienteSelecionado = null;
    this.usuarioSelecionado = null;
    this.resultadoSelecionado = 'TODOS';
    this.buscar();
  }

  private formatarDataParam(data: Date): string {
    const y = data.getFullYear();
    const m = String(data.getMonth() + 1).padStart(2, '0');
    const d = String(data.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

tipoAtivo: 'geral' | 'paciente' | 'periodo' | 'resumo' = 'geral';

tiposRelatorio = [
  { label: 'Geral', value: 'geral', icon: 'pi-list', desc: 'Relatório com filtros' },
  { label: 'Paciente', value: 'paciente', icon: 'pi-user', desc: 'Histórico individual' },
  { label: 'Período', value: 'periodo', icon: 'pi-calendar', desc: 'Relatório por datas' },
  { label: 'Resumo', value: 'resumo', icon: 'pi-chart-bar', desc: 'Painel geral' },
];

pacienteHistoricoId: number | null = null;
periodoInicio: Date | null = null;
periodoFim: Date | null = null;

dadosPaciente: any = null;
dadosPeriodo: any = null;
dadosResumo: any = null;

selecionarTipo(tipo: 'geral' | 'paciente' | 'periodo' | 'resumo'): void {
  this.tipoAtivo = tipo;

  if (tipo === 'geral') this.buscarGeral();
  if (tipo === 'resumo') this.buscarResumo();
}

buscarGeral(): void {
  this.buscar();
}

buscarPorPaciente(): void {
  if (!this.pacienteHistoricoId) return;

  this.carregando = true;

  this.avaliacaoService.buscarRelatorios({ idPaciente: this.pacienteHistoricoId }).subscribe({
    next: (dados) => {
      const paciente = this.pacientes.find(p => p.id_paciente === this.pacienteHistoricoId);

      this.dadosPaciente = {
        paciente,
        avaliacoes: dados,
        resumo: this.montarResumo(dados),
      };

      this.carregando = false;
    },
    error: () => {
      this.carregando = false;
    }
  });
}

buscarPorPeriodo(): void {
  this.carregando = true;

  const filtros: any = {};

  if (this.periodoInicio) filtros.dataInicio = this.formatarDataParam(this.periodoInicio);
  if (this.periodoFim) filtros.dataFim = this.formatarDataParam(this.periodoFim);

  this.avaliacaoService.buscarRelatorios(filtros).subscribe({
    next: (dados) => {
      this.dadosPeriodo = {
        avaliacoes: dados,
        resumo: this.montarResumo(dados),
        grafico_por_dia: [],
      };

      this.carregando = false;
    },
    error: () => {
      this.carregando = false;
    }
  });
}

buscarResumo(): void {
  this.carregando = true;

  this.avaliacaoService.buscarRelatorios().subscribe({
    next: (dados) => {
      this.dadosResumo = {
        totais: this.montarResumo(dados),
        por_mes: [],
        por_sexo: [],
        top5_pacientes: [],
      };

      this.carregando = false;
    },
    error: () => {
      this.carregando = false;
    }
  });
}

formatarDataCurta(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR');
}

private montarResumo(dados: any[]): any {
  const total = dados.length;
  const encaminhar = dados.filter(x => x.resultado === 'ENCAMINHAR').length;
  const naoEncaminhar = dados.filter(x => x.resultado === 'NAO_ENCAMINHAR').length;
  const mediaScore = total > 0
    ? dados.reduce((s, x) => s + Number(x.score || 0), 0) / total
    : 0;

  return {
    total_avaliacoes: total,
    total_encaminhar: encaminhar,
    total_nao_encaminhar: naoEncaminhar,
    taxa_encaminhamento: total > 0 ? Math.round((encaminhar / total) * 100) : 0,
    media_score: mediaScore,
  };
}

  formatarSexo(sexo: string): string {
    return sexo === 'M' ? 'Masculino' : sexo === 'F' ? 'Feminino' : sexo;
  }

  scorePercent(score: number): number {
    return Math.round(score * 100);
  }

  getSeverity(resultado: string): 'danger' | 'success' {
    return resultado === 'ENCAMINHAR' ? 'danger' : 'success';
  }

  getResultadoLabel(resultado: string): string {
    return resultado === 'ENCAMINHAR' ? 'Encaminhar' : 'Não encaminhar';
  }
}