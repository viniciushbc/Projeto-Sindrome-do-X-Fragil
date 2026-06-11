import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NovaAvaliacaoInicial, PayloadAvaliacao, CriarAvaliacaoResponse } from '../models/avaliacao.model';
import { Sintoma } from '../models/sintoma.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private readonly storageKey = 'nova_avaliacao_inicial';
  private readonly apiUrl = environment.apiUrl;

  private resultadoSubject = new BehaviorSubject<CriarAvaliacaoResponse | null>(null);
  resultado$ = this.resultadoSubject.asObservable();

  private avaliacaoInicialSubject = new BehaviorSubject<NovaAvaliacaoInicial | null>(
    this.carregarDoStorage()
  );
  avaliacaoInicial$ = this.avaliacaoInicialSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  setResultado(dados: CriarAvaliacaoResponse): void {
    this.resultadoSubject.next(dados);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  definirAvaliacaoInicial(dados: NovaAvaliacaoInicial): void {
    this.avaliacaoInicialSubject.next(dados);
    sessionStorage.setItem(this.storageKey, JSON.stringify(dados));
  }

  obterAvaliacaoInicial(): NovaAvaliacaoInicial | null {
    return this.avaliacaoInicialSubject.value;
  }

  limparAvaliacaoInicial(): void {
    this.avaliacaoInicialSubject.next(null);
    sessionStorage.removeItem(this.storageKey);
  }

  listarAvaliacoes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/avaliacoes`, {
      headers: this.getHeaders()
    });
  }

  buscarSintomas(): Observable<Sintoma[]> {
    return this.http.get<Sintoma[]>(`${this.apiUrl}/sintomas`, {
      headers: this.getHeaders()
    });
  }

  criarAvaliacao(payload: PayloadAvaliacao): Observable<CriarAvaliacaoResponse> {
    return this.http.post<any>(`${this.apiUrl}/avaliacoes`, payload, {
      headers: this.getHeaders()
    }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  /** @deprecated Use criarAvaliacao() */
  enviarAvaliacao(payload: PayloadAvaliacao): Observable<CriarAvaliacaoResponse> {
    return this.criarAvaliacao(payload);
  }

  buscarPorPaciente(idPaciente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/avaliacoes/paciente/${idPaciente}`, {
      headers: this.getHeaders()
    });
  }

  buscarPorId(idAvaliacao: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/avaliacoes/${idAvaliacao}`, {
      headers: this.getHeaders()
    });
  }

  buscarRelatorios(filtros: any = {}): Observable<any[]> {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    const query = params.toString() ? '?' + params.toString() : '';
    return this.http.get<any[]>(`${this.apiUrl}/relatorios${query}`, {
      headers: this.getHeaders()
    });
  }

  private carregarDoStorage(): NovaAvaliacaoInicial | null {
    const dados = sessionStorage.getItem(this.storageKey);
    if (!dados) return null;
    try {
      return JSON.parse(dados) as NovaAvaliacaoInicial;
    } catch {
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }
}