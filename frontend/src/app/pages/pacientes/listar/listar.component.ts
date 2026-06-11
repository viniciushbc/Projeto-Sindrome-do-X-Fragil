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
  ],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class PacientesComponent implements OnInit {

  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  busca: string = '';
  loading: boolean = true;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
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