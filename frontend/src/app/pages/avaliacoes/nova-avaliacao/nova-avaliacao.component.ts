import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Paciente } from '../../../models/paciente.model';
import { NovaAvaliacaoInicial } from '../../../models/avaliacao.model';
import { PacienteService } from '../../../services/paciente.service';
import { AvaliacaoService } from '../../../services/avaliacao.service';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../../layout/header/header.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-nova-avaliacao',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    InputTextModule,
    InputTextareaModule,
  ],
  templateUrl: './nova-avaliacao.component.html',
  styleUrl: './nova-avaliacao.component.css',
  providers: [MessageService]
})
export class NovaAvaliacaoComponent implements OnInit {
  form!: FormGroup;

  pacientes: Paciente[] = [];
  pacienteSelecionado: Paciente | null = null;

  carregandoPacientes = false;
  erroCarregamento = false;

  relacoesRespondente = [
    {label: 'Paciente', value: 'PACIENTE'},
    { label: 'Mãe', value: 'MAE' },
    { label: 'Pai', value: 'PAI' },
    { label: 'Responsável legal', value: 'RESPONSAVEL_LEGAL' },
    { label: 'Familiar', value: 'FAMILIAR' },
    { label: 'Profissional de saúde', value: 'PROFISSIONAL_SAUDE' },
    { label: 'Outro', value: 'OUTRO' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private pacienteService: PacienteService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarPacientes();
  }

  private criarFormulario(): void {
    this.form = this.fb.group({
      paciente: [null, Validators.required],
      nomeRespondente: ['', [Validators.required, Validators.minLength(3)]],
      relacaoRespondente: [null, Validators.required],
      documentoRespondente: [''],
      observacoesIniciais: [''],
    });
  }

  private carregarPacientes(): void {
    this.carregandoPacientes = true;
    this.erroCarregamento = false;

    this.pacienteService.listarPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.carregandoPacientes = false;
      },
      error: () => {
        this.erroCarregamento = true;
        this.carregandoPacientes = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar a lista de pacientes.',
        });
      },
    });
  }

  aoSelecionarPaciente(paciente: Paciente): void {
    this.pacienteSelecionado = paciente;
  }

  voltarParaListagem(): void {
    this.router.navigate(['/avaliacoes']);
  }

  continuarParaChecklist(): void {
    if (!this.pacienteSelecionado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione um paciente para iniciar a avaliação.',
      });
      return;
    }

    if (!this.pacienteSelecionado.sexo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'O paciente selecionado não possui sexo informado. Edite o cadastro antes de continuar.',
      });
      return;
    }

    const idPaciente = this.obterIdPaciente(this.pacienteSelecionado);

    if (!idPaciente || !this.pacienteSelecionado.nome) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Os dados principais do paciente não foram carregados corretamente.',
      });
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos obrigatórios antes de continuar.',
      });
      return;
    }

    const dados: NovaAvaliacaoInicial = {
      id_paciente: idPaciente,
      paciente: this.pacienteSelecionado,
      nome_respondente: this.form.value.nomeRespondente,
      relacao_respondente: this.form.value.relacaoRespondente,
      respondente_documento: this.form.value.documentoRespondente || null,
      observacoes: this.form.value.observacoesIniciais || null,
    };

    this.avaliacaoService.definirAvaliacaoInicial(dados);

    this.router.navigate(['/avaliacoes/checklist']);
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private obterIdPaciente(paciente: Paciente): number {
    return paciente.id_paciente ?? paciente.id_paciente ?? 0;
  }

  formatarSexo(sexo?: string | null): string {
    if (!sexo) {
      return 'Não informado';
    }

    if (sexo === 'M') {
      return 'Masculino';
    }

    if (sexo === 'F') {
      return 'Feminino';
    }

    return sexo;
  }

  

  obterIdadeOuNascimento(paciente: Paciente): string {
    if (paciente.idade !== null && paciente.idade !== undefined) {
      return `${paciente.idade} anos`;
    }

    if (paciente.dataNascimento) {
      return paciente.dataNascimento;
    }

    return 'Não informado';
  }
}