import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from '../../../layout/header/header.component';

import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  form!: FormGroup;
  pacienteId: number | null = null;
  isEdicao = false;
  isVisualizacao = false;
  loading = false;

  sexoOpcoes = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino',  value: 'F' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');

    this.isVisualizacao = this.route.snapshot.routeConfig?.path?.includes('visualizar') ?? false;

    if (id) {
      this.pacienteId = +id;
      this.isEdicao = !this.isVisualizacao;
      this.carregarPaciente(this.pacienteId);
    }

    if (this.isVisualizacao) {
      this.form.disable();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      nome:           ['', Validators.required],
      cpf:            ['', Validators.required],
      data_nascimento: [null],
      idade:          [null],
      sexo:           [''],
      telefone:       ['', Validators.required],
      responsavel:    [''],
      observacao:     [''],
    });
  }

  carregarPaciente(id: number): void {
    this.pacienteService.buscarPaciente(id).subscribe({
      next: (paciente) => {
        const p = paciente as any;
        
        this.form.patchValue({
          nome:           p.nome,
          cpf:            p.cpf,
          data_nascimento: p.data_nascimento ? new Date(p.data_nascimento) : null,
          idade:          p.idade,
          sexo:           p.sexo,
          telefone:       p.telefone,
          responsavel:    p.responsavel,
          observacao:     p.observacoes,
        });
      },
      error: () => this.mostrarErro('Erro ao carregar paciente.')
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    const dados = {
      nome:            formValue.nome,
      cpf:             formValue.cpf,
      data_nascimento: formValue.data_nascimento ? (() => {
        const d = new Date(formValue.data_nascimento);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      })() : null,
      idade:           formValue.idade,
      sexo:            formValue.sexo,
      telefone:        formValue.telefone,
      responsavel:     formValue.responsavel,
      observacoes:     formValue.observacao,
    };

    const requisicao = this.isEdicao
      ? this.pacienteService.editarPaciente(this.pacienteId!, dados)
      : this.pacienteService.cadastrarPaciente(dados);

    requisicao.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.isEdicao ? 'Paciente atualizado!' : 'Paciente cadastrado!'
        });
        setTimeout(() => this.router.navigate(['/pacientes/listar']), 1500);
      },
      error: () => {
        this.mostrarErro('Erro ao salvar paciente.');
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/pacientes/listar']);
  }

  mostrarErro(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
  }

  campoInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c?.invalid && c?.touched);
  }
}