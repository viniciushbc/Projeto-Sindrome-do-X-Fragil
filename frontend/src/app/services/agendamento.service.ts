import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento, CriarAgendamentoRequest } from '../models/agendamento.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  listar(mes?: number, ano?: number): Observable<Agendamento[]> {
    let query = '';
    if (mes && ano) query = `?mes=${mes}&ano=${ano}`;
    return this.http.get<Agendamento[]>(`${this.apiUrl}/agendamentos${query}`, { headers: this.getHeaders() });
  }

  criar(dados: CriarAgendamentoRequest): Observable<Agendamento> {
    return this.http.post<Agendamento>(`${this.apiUrl}/agendamentos`, dados, { headers: this.getHeaders() });
  }

  atualizarStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/agendamentos/${id}`, { status }, { headers: this.getHeaders() });
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/agendamentos/${id}`, { headers: this.getHeaders() });
  }
}