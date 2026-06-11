import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Sintoma } from '../models/sintoma.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';

const SINTOMAS_FALLBACK: Sintoma[] = [
  { id_sintoma: 1,  nome: 'Deficiência intelectual',           descricao: 'Comprometimento cognitivo variável, de leve a grave.', ativo: true },
  { id_sintoma: 2,  nome: 'Face alongada ou orelhas de abano', descricao: 'Características fenotípicas faciais associadas à síndrome.', ativo: true },
  { id_sintoma: 3,  nome: 'Macroorquidismo',                   descricao: 'Volume testicular aumentado, frequente pós-puberdade.', ativo: true },
  { id_sintoma: 4,  nome: 'Hipermobilidade articular',         descricao: 'Amplitude de movimento articular acima do normal.', ativo: true },
  { id_sintoma: 5,  nome: 'Dificuldades de aprendizagem',      descricao: 'Dificuldade na aquisição de conteúdos acadêmicos.', ativo: true },
  { id_sintoma: 6,  nome: 'Déficit de atenção',                descricao: 'Dificuldade de manter atenção sustentada em tarefas.', ativo: true },
  { id_sintoma: 7,  nome: 'Movimentos repetitivos',            descricao: 'Estereotipias motoras como balançar o corpo ou mãos.', ativo: true },
  { id_sintoma: 8,  nome: 'Atraso na fala',                    descricao: 'Desenvolvimento da linguagem oral abaixo do esperado para a idade.', ativo: true },
  { id_sintoma: 9,  nome: 'Hiperatividade',                    descricao: 'Nível excessivo de atividade motora.', ativo: true },
  { id_sintoma: 10, nome: 'Evita contato visual',              descricao: 'Dificuldade ou recusa em manter olho no olho.', ativo: true },
  { id_sintoma: 11, nome: 'Evita contato físico',              descricao: 'Sensibilidade tátil aumentada ou aversão ao toque.', ativo: true },
  { id_sintoma: 12, nome: 'Agressividade',                     descricao: 'Comportamento agressivo verbal ou físico em situações de frustração.', ativo: true },
];

@Injectable({ providedIn: 'root' })
export class SintomasService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  listarSintomas(): Observable<Sintoma[]> {
    return this.http.get<Sintoma[]>(`${environment.apiUrl}/sintomas`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(() => {
        console.warn('[SintomasService] Endpoint indisponível — usando lista fallback.');
        return of(SINTOMAS_FALLBACK);
      }),
    );
  }
}