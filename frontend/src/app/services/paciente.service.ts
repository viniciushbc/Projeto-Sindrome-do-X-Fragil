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

  listarPacientes(): Observable<Paciente[]> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Paciente[]>(this.apiUrl, { headers }).pipe(
      map((pacientes) => {
        return pacientes.filter((paciente) => paciente.ativo === 1);
      })
    );
  }
}