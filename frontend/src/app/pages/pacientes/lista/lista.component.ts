import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente.model';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ToastModule
  ],

templateUrl: './lista.component.html',
styleUrls: ['./lista.component.css']

})
export class PacientesComponent implements OnInit{

  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];

  busca: string = '';

  loading: boolean = true;

  constructor(private pacienteService: PacienteService) {}

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
    console.log('Novo paciente');
  }

  editarPaciente(paciente: Paciente): void {
    console.log('Editar', paciente);
  }

  verDetalhes(paciente: Paciente): void {
    console.log('Detalhes', paciente);
  }
}