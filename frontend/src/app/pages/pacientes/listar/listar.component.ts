import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputIconModule } from 'primeng/inputicon';
import { HeaderComponent } from '../../../layout/header/header.component';

import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente.model';

import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToastModule,
    InputIconModule,
    TooltipModule, 
  ],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
  providers: [MessageService]
})
export class PacientesComponent implements OnInit {

  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  busca: string = '';
  loading: boolean = true;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarPacientes();
  }


  carregarPacientes(): void {
    this.loading = true;
    this.pacienteService.listarPacientes().subscribe({
      next: (dados) => {
        this.pacientes = dados;
        this.pacientesFiltrados = dados;
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar pacientes', erro);
        this.loading = false;
      }
    });
  }

  filtrarPacientes(): void {
    this.pacientesFiltrados = this.pacientes.filter(paciente =>
      paciente.nome.toLowerCase().includes(this.busca.toLowerCase())
    );
  }
  

  alterarStatus(p: Paciente): void {
  this.pacienteService.alterarStatus(p.id_paciente, !p.ativo).subscribe({
    next: () => {
      this.toast('success', `Paciente ${p.ativo ? 'desativado' : 'ativado'} com sucesso.`);
      this.carregarPacientes();
    },
    error: (e: HttpErrorResponse) => this.toast('error', e.error?.message || 'Erro ao alterar status.'),
  });
}

private toast(severity: string, detail: string): void {
  this.messageService.add({ severity, detail, life: 3000 });
}

  novoPaciente(): void {
    this.router.navigate(['/pacientes/editar']);
  }

  editarPaciente(paciente: Paciente): void {
    this.router.navigate(['/pacientes/editar', paciente.id_paciente]);
  }

  verDetalhes(paciente: Paciente): void {
    this.router.navigate(['/pacientes', paciente.id_paciente, 'historico']);
  }

  // Compatibilidade com versões anteriores do template
  voltarMenu(): void {
    this.router.navigate(['/menu']);
  }
  
}