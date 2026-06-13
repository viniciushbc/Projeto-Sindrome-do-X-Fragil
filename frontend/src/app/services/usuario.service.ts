import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { Usuario, CriarUsuarioRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  criar(dados: CriarUsuarioRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, dados, { headers: this.getHeaders() });
  }

  atualizar(id: number, dados: Partial<CriarUsuarioRequest>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dados, { headers: this.getHeaders() });
  }

  alterarStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { ativo }, { headers: this.getHeaders() });
  }
}