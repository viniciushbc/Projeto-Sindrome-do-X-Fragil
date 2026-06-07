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

import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
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
    if (id) {
      this.pacienteId = +id;
      this.isEdicao = true;
      this.carregarPaciente(this.pacienteId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      nome:         ['', Validators.required],
      cpf:          ['', Validators.required],
      dataNascimento: [null],
      idade:        [null],
      sexo:         [''],
      telefone:     ['', Validators.required],
      responsavel:  [''],
      observacao:  [''],
    });
  }

  carregarPaciente(id: number): void {
    this.pacienteService.buscarPaciente(id).subscribe({
      next: (paciente) => this.form.patchValue(paciente),
      error: () => this.mostrarErro('Erro ao carregar paciente.')
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const dados = this.form.value;

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