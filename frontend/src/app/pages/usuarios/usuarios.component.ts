import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { HeaderComponent } from '../../layout/header/header.component';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario, CriarUsuarioRequest } from '../../models/usuario.model';
import { Router } from '@angular/router';

export interface ModuloAcesso {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    HeaderComponent, CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, TagModule, DialogModule, DropdownModule,
    ToastModule, ProgressSpinnerModule, CheckboxModule, TableModule, DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  busca = '';
  usuarios: Usuario[] = [];
  usuarioSelecionado: Usuario | null = null;
  carregando = false;

  dialogVisivel = false;
  dialogTitulo = '';
  isEdicao = false;
  salvando = false;
  form!: FormGroup;

  // Módulos disponíveis para permissão
  modulos: ModuloAcesso[] = [
    { key: 'pacientes',    label: 'Pacientes',    icon: 'pi-users' },
    { key: 'avaliacoes',   label: 'Avaliações',   icon: 'pi-clipboard' },
    { key: 'relatorios',   label: 'Relatórios',   icon: 'pi-chart-bar' },
    { key: 'agendamentos', label: 'Agendamentos', icon: 'pi-calendar' },
    { key: 'usuarios',     label: 'Usuários',     icon: 'pi-user-edit' },
    { key: 'logs',         label: 'Logs',         icon: 'pi-list' },
  ];

  permissoesSelecionadas: string[] = [];
  mostrarPermissoes = false;

  tiposUsuario = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Usuário Padrão', value: 'PADRAO' },
  ];

  get isAdmin(): boolean { return this.authService.isAdmin(); }

  get usuariosFiltrados(): Usuario[] {
    const b = this.busca.toLowerCase();
    return this.usuarios.filter(u =>
      u.nome.toLowerCase().includes(b) || u.email.toLowerCase().includes(b)
    );
  }

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.criarForm();
    this.carregarUsuarios();
  }
    voltarMenu(): void {
  this.router.navigate(['/menu']);
  }

  criarForm(): void {
    this.form = this.fb.group({
      nome:          ['', [Validators.required, Validators.minLength(3)]],
      email:         ['', [Validators.required, Validators.email]],
      senha:         [''],
      cpf:           [''],
      tipo_usuario:  ['PADRAO', Validators.required],
      crm:           [''],
      especialidade: [''],
      instituicao:   [''],
      cargo:         [''],
    });

    this.form.get('tipo_usuario')?.valueChanges.subscribe(tipo => {
      this.mostrarPermissoes = tipo === 'PADRAO';
      if (tipo === 'ADMIN') this.permissoesSelecionadas = [...this.modulos.map(m => m.key)];
    });
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.usuarioService.listar().subscribe({
      next: (dados) => { this.usuarios = dados; this.carregando = false; },
      error: () => { this.carregando = false; this.toast('error', 'Erro ao carregar usuários.'); },
    });
  }

  selecionarUsuario(u: Usuario): void { this.usuarioSelecionado = u; }

  abrirNovo(): void {
    this.isEdicao = false;
    this.dialogTitulo = 'Novo Usuário';
    this.form.reset({ tipo_usuario: 'PADRAO' });
    this.form.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('senha')?.updateValueAndValidity();
    this.permissoesSelecionadas = ['pacientes', 'avaliacoes'];
    this.mostrarPermissoes = true;
    this.dialogVisivel = true;
  }

  abrirEdicao(u: Usuario): void {
    this.isEdicao = true;
    this.dialogTitulo = 'Editar Usuário';
    this.usuarioSelecionado = u;
    this.form.patchValue({
      nome: u.nome, email: u.email, cpf: u.cpf || '',
      tipo_usuario: u.tipo_usuario, crm: u.crm || '',
      especialidade: u.especialidade || '', instituicao: u.instituicao || '', cargo: u.cargo || '',
    });
    this.form.get('senha')?.clearValidators();
    this.form.get('senha')?.updateValueAndValidity();
    this.permissoesSelecionadas = u.permissoes ? [...u.permissoes] : ['pacientes','avaliacoes'];
    this.mostrarPermissoes = u.tipo_usuario === 'PADRAO';
    this.dialogVisivel = true;
  }

  togglePermissao(key: string): void {
    const idx = this.permissoesSelecionadas.indexOf(key);
    if (idx >= 0) this.permissoesSelecionadas.splice(idx, 1);
    else this.permissoesSelecionadas.push(key);
  }

  temPermissao(key: string): boolean {
    return this.permissoesSelecionadas.includes(key);
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.salvando = true;
    const v = this.form.value;
    const permissoes = v.tipo_usuario === 'ADMIN'
      ? this.modulos.map(m => m.key)
      : [...this.permissoesSelecionadas];

    if (this.isEdicao && this.usuarioSelecionado) {
      const dados: any = {
        nome: v.nome, email: v.email, cpf: v.cpf || null,
        tipo_usuario: v.tipo_usuario, crm: v.crm || null,
        especialidade: v.especialidade || null,
        instituicao: v.instituicao || null,
        cargo: v.cargo || null,
        permissoes,
      };
      if (v.senha) dados.senha = v.senha;

      this.usuarioService.atualizar(this.usuarioSelecionado.id_usuario, dados).subscribe({
        next: () => {
          this.salvando = false; this.dialogVisivel = false;
          this.toast('success', 'Usuário atualizado com sucesso.');
          this.carregarUsuarios(); this.usuarioSelecionado = null;
        },
        error: (e: HttpErrorResponse) => {
          this.salvando = false;
          this.toast('error', e.error?.message || 'Erro ao atualizar usuário.');
        },
      });
    } else {
      const dados: CriarUsuarioRequest = {
        nome: v.nome, email: v.email, senha: v.senha,
        cpf: v.cpf || undefined, tipo_usuario: v.tipo_usuario,
        crm: v.crm || undefined, especialidade: v.especialidade || undefined,
        instituicao: v.instituicao || undefined, cargo: v.cargo || undefined,
        permissoes,
      };

      this.usuarioService.criar(dados).subscribe({
        next: () => {
          this.salvando = false; this.dialogVisivel = false;
          this.toast('success', 'Usuário criado com sucesso.');
          this.carregarUsuarios();
        },
        error: (e: HttpErrorResponse) => {
          this.salvando = false;
          this.toast('error', e.error?.message || 'Erro ao criar usuário.');
        },
      });
    }
  }

  alterarStatus(u: Usuario): void {
    this.usuarioService.alterarStatus(u.id_usuario, !u.ativo).subscribe({
      next: () => {
        this.toast('success', `Usuário ${u.ativo ? 'desativado' : 'ativado'} com sucesso.`);
        this.carregarUsuarios();
        if (this.usuarioSelecionado?.id_usuario === u.id_usuario) this.usuarioSelecionado = null;
      },
      error: (e: HttpErrorResponse) => this.toast('error', e.error?.message || 'Erro ao alterar status.'),
    });
  }

  campoInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c?.invalid && c?.touched);
  }

  private toast(severity: string, detail: string): void {
    this.messageService.add({ severity, summary: severity === 'success' ? 'Sucesso' : 'Erro', detail, life: 4000 });
  }
}