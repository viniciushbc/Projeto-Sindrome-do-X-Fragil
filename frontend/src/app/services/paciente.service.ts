import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly apiUrl = `${environment.apiUrl}/pacientes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  listarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map((pacientes) => pacientes.filter((p) => p.ativo === 1 || p.ativo === true))
    );
  }

  buscarPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Paciente> {
    return this.buscarPaciente(id);
  }

  cadastrarPaciente(dados: Partial<Paciente>): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, dados, { headers: this.getHeaders() });
  }

  editarPaciente(id: number, dados: Partial<Paciente>): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, dados, { headers: this.getHeaders() });
  }

  desativarPaciente(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { ativo: false }, { headers: this.getHeaders() });
  }
}