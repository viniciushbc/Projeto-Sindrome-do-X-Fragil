import  { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { LoginRequest, LoginResponse } from '../models/login.model';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private readonly apiUrl = 'http://localhost:3000/auth/login';

    constructor(private http: HttpClient){}

    login(dados: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}`, dados).pipe(
            tap((response) => {
                if(response?.token) {
                    localStorage.setItem('token', response.token);

                    if(response.usuario) {
                        localStorage.setItem('usuario', JSON.stringify(response.usuario))
                    }
                }
            })
        )
    }


    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }

    getToken(): string | null {
        return localStorage.getItem('token')
    }

    autenticado(): boolean {
        return !!this.getToken();
    }


}