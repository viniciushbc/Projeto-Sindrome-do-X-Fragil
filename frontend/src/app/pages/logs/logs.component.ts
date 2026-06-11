import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { HeaderComponent } from '../../layout/header/header.component';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HeaderComponent, TableModule, CardModule,
    ButtonModule, CalendarModule, DropdownModule, ToastModule, ProgressSpinnerModule, TagModule
  ],
  providers: [MessageService],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  carregando = false;

  filtroEntidade = '';
  filtroAcao = '';
  filtroDataInicio: Date | null = null;
  filtroDataFim: Date | null = null;

  entidades = [
    { label: 'Todas', value: '' },
    { label: 'Avaliação', value: 'AVALIACAO' },
    { label: 'Paciente', value: 'PACIENTE' },
    { label: 'Usuário', value: 'USUARIO' },
  ];

  acoes = [
    { label: 'Todas', value: '' },
    { label: 'Criação', value: 'CRIACAO' },
    { label: 'Edição', value: 'EDICAO' },
    { label: 'Exclusão', value: 'EXCLUSAO' },
  ];

  constructor(private http: HttpClient, private authService: AuthService, private messageService: MessageService) {}

  ngOnInit(): void { this.buscar(); }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  private fmt(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  buscar(): void {
    this.carregando = true;
    const params: any = {};
    if (this.filtroEntidade) params['entidade'] = this.filtroEntidade;
    if (this.filtroAcao)     params['acao'] = this.filtroAcao;
    if (this.filtroDataInicio) params['dataInicio'] = this.fmt(this.filtroDataInicio);
    if (this.filtroDataFim)    params['dataFim'] = this.fmt(this.filtroDataFim);

    const query = Object.keys(params).length
      ? '?' + new URLSearchParams(params).toString() : '';

    this.http.get<any[]>(`${environment.apiUrl}/logs${query}`, { headers: this.getHeaders() }).subscribe({
      next: (d) => { this.logs = d; this.carregando = false; },
      error: () => {
        this.carregando = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os logs.' });
      }
    });
  }

  limpar(): void {
    this.filtroEntidade = ''; this.filtroAcao = '';
    this.filtroDataInicio = null; this.filtroDataFim = null;
    this.buscar();
  }

  getAcaoSeverity(acao: string): 'success' | 'info' | 'warning' | 'danger' {
    if (acao === 'CRIACAO') return 'success';
    if (acao === 'EDICAO')  return 'info';
    if (acao === 'EXCLUSAO') return 'danger';
    return 'warning';
  }

  formatarData(d: string): string {
    return new Date(d).toLocaleString('pt-BR');
  }
}