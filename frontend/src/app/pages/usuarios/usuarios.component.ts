import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';
import { HeaderComponent } from '../../layout/header/header.component';

interface Usuario {
  nome: string;
  email: string;
  cargo: string;
  status: 'Ativo' | 'Inativo';
}

interface PermissaoModulo {
  nome: string;
  total: number;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    AccordionModule,
    HeaderComponent,
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  busca = '';
  usuarioSelecionado: Usuario | null = null;

  usuarios: Usuario[] = [
    { nome: 'Dr. João Silva', email: 'joao.silva@sigma.com', cargo: 'Administrador', status: 'Ativo' },
    { nome: 'Dra. Maria Santos', email: 'maria.santos@sigma.com', cargo: 'Médica', status: 'Ativo' },
    { nome: 'Carlos Oliveira', email: 'carlos.oliveira@sigma.com', cargo: 'Recepcionista', status: 'Ativo' },
    { nome: 'Ana Paula Costa', email: 'ana.costa@sigma.com', cargo: 'Enfermeira', status: 'Inativo' },
  ];

  modulos: PermissaoModulo[] = [
    { nome: 'Pacientes', total: 4 },
    { nome: 'Usuários', total: 4 },
    { nome: 'Relatórios', total: 4 },
    { nome: 'Exames', total: 4 },
    { nome: 'Agendamentos', total: 4 },
    { nome: 'Instituições', total: 4 },
    { nome: 'Dashboard', total: 4 },
    { nome: 'Configurações', total: 4 },
  ];

  get usuariosFiltrados() {
    return this.usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(this.busca.toLowerCase()) ||
        u.email.toLowerCase().includes(this.busca.toLowerCase())
    );
  }

  selecionarUsuario(u: Usuario) {
    this.usuarioSelecionado = u;
  }
}