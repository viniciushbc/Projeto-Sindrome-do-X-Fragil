import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Agendamento, CriarAgendamentoRequest } from '../../models/agendamento.model';
import { AgendamentoService } from '../../services/agendamento.service';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';

interface DiaCalendario {
  data: Date;
  diaAtual: boolean;
  mesAtual: boolean;
  agendamentos: Agendamento[];
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    CardModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    TagModule,
    DividerModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
  providers: [MessageService],
})
export class CalendarioComponent implements OnInit {

  agendamentos: Agendamento[] = [];
  pacientes: Paciente[] = [];
  diasCalendario: DiaCalendario[][] = [];

  mesAtual: Date = new Date();
  carregando = false;
  salvando = false;

  modalAberto = false;
  dataSelecionada: Date | null = null;
  novoAgendamento = {
    id_paciente: null as number | null,
    horario: null as Date | null,
    observacao: '',
  };

  modalDetalhes = false;
  agendamentoDetalhes: Agendamento | null = null;

  nomesMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  nomesDias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  constructor(
    private agendamentoService: AgendamentoService,
    private pacienteService: PacienteService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
    this.carregarAgendamentos();
  }

  private carregarPacientes(): void {
    this.pacienteService.listarPacientes().subscribe({
      next: (p) => { this.pacientes = p; },
      error: () => {},
    });
  }

  carregarAgendamentos(): void {
    this.carregando = true;
    const mes = this.mesAtual.getMonth() + 1;
    const ano = this.mesAtual.getFullYear();

    this.agendamentoService.listar(mes, ano).subscribe({
      next: (dados) => {
        this.agendamentos = dados;
        this.gerarCalendario();
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os agendamentos.' });
      },
    });
  }

  private gerarCalendario(): void {
    const ano = this.mesAtual.getFullYear();
    const mes = this.mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const hoje = new Date();

    // Preencher dias anteriores para completar a primeira semana
    const dias: DiaCalendario[] = [];
    for (let i = primeiroDia.getDay(); i > 0; i--) {
      const data = new Date(ano, mes, 1 - i);
      dias.push({ data, diaAtual: false, mesAtual: false, agendamentos: this.agendamentosDoDia(data) });
    }

    // Dias do mês
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const data = new Date(ano, mes, d);
      const diaAtual = data.toDateString() === hoje.toDateString();
      dias.push({ data, diaAtual, mesAtual: true, agendamentos: this.agendamentosDoDia(data) });
    }

    // Completar última semana
    const restante = 7 - (dias.length % 7);
    if (restante < 7) {
      for (let i = 1; i <= restante; i++) {
        const data = new Date(ano, mes + 1, i);
        dias.push({ data, diaAtual: false, mesAtual: false, agendamentos: this.agendamentosDoDia(data) });
      }
    }

    // Dividir em semanas
    this.diasCalendario = [];
    for (let i = 0; i < dias.length; i += 7) {
      this.diasCalendario.push(dias.slice(i, i + 7));
    }
  }

  private agendamentosDoDia(data: Date): Agendamento[] {
    const dataStr = this.formatarDataISO(data);
    return this.agendamentos.filter(a => a.data_agendamento.substring(0, 10) === dataStr);
  }

  private formatarDataISO(data: Date): string {
    const y = data.getFullYear();
    const m = String(data.getMonth() + 1).padStart(2, '0');
    const d = String(data.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  mesAnterior(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() - 1, 1);
    this.carregarAgendamentos();
  }

  proximoMes(): void {
    this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + 1, 1);
    this.carregarAgendamentos();
  }

  abrirModal(dia: DiaCalendario): void {
    if (!dia.mesAtual) return;
    this.dataSelecionada = dia.data;
    this.novoAgendamento = { id_paciente: null, horario: null, observacao: '' };
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.dataSelecionada = null;
  }

  verDetalhes(agendamento: Agendamento, event: Event): void {
    event.stopPropagation();
    this.agendamentoDetalhes = agendamento;
    this.modalDetalhes = true;
  }

  salvarAgendamento(): void {
    if (!this.novoAgendamento.id_paciente || !this.novoAgendamento.horario || !this.dataSelecionada) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha paciente e horário.' });
      return;
    }

    const horario = this.novoAgendamento.horario;
    const hh = String(horario.getHours()).padStart(2, '0');
    const mm = String(horario.getMinutes()).padStart(2, '0');

    const payload: CriarAgendamentoRequest = {
      id_paciente: this.novoAgendamento.id_paciente,
      data_agendamento: this.formatarDataISO(this.dataSelecionada),
      horario: `${hh}:${mm}`,
      observacao: this.novoAgendamento.observacao || undefined,
    };

    this.salvando = true;
    this.agendamentoService.criar(payload).subscribe({
      next: () => {
        this.salvando = false;
        this.fecharModal();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Agendamento criado!' });
        this.carregarAgendamentos();
      },
      error: () => {
        this.salvando = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível criar o agendamento.' });
      },
    });
  }

  excluirAgendamento(id: number): void {
    this.agendamentoService.excluir(id).subscribe({
      next: () => {
        this.modalDetalhes = false;
        this.messageService.add({ severity: 'success', summary: 'Removido', detail: 'Agendamento excluído.' });
        this.carregarAgendamentos();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir.' });
      },
    });
  }

  get tituloMes(): string {
    return `${this.nomesMeses[this.mesAtual.getMonth()]} ${this.mesAtual.getFullYear()}`;
  }

  getSeveridadeStatus(status: string): 'success' | 'warning' | 'danger' | 'info' {
    if (status === 'AGENDADO') return 'info';
    if (status === 'REALIZADO') return 'success';
    return 'danger';
  }

  getLabelStatus(status: string): string {
    if (status === 'AGENDADO') return 'Agendado';
    if (status === 'REALIZADO') return 'Realizado';
    return 'Cancelado';
  }

  formatarHorario(horario: string): string {
    return horario ? horario.substring(0, 5) : '';
  }
}