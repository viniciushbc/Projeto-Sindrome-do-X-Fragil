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

    // funcao de fazer login
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

    // QUE SERÃO UTILIZADAS NO HEADER E NAS NAVEGAÇÕES DAS PÁGINAS 

    // REMOVE OS DADOS DE AUTENTICAÇÃO SALVOS NO LOCAL STORAGE DO NAVEGADOR
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario'); 
    }

    // Retorna o token salvo do usuário
    getToken(): string | null {
        return localStorage.getItem('token')
    }

    // Verifica se o usuario está autenticado ou nao
    autenticado(): boolean {
        return !!this.getToken();
    }

    // Retorna o objeto do usuario logado
    getUsuarioLogado(): any {
        const usuario = localStorage.getItem('usuario');

        if (usuario) {
            return JSON.parse(usuario);
        } else {
            return null;
        }

    }

    // Retorna o nome do usuario logado (Usaremos no header)
    getNomeUsuario(): string {
        const usuario = this.getUsuarioLogado();

        return usuario?.nome;

    }

    // Retorna o tipo do usuario logado (Usaremos no header)
    getTipoUsuario(): string {
        const usuario = this.getUsuarioLogado();

        return usuario?.tipo_usuario
    }

    // Retorna o tipo do usuario logado com ajuste de exibição (Usaremos no header)
    getTipoUsuarioLabel(): string {
        const tipoUsuario = this.getTipoUsuario();

        if (tipoUsuario === 'ADMIN') {
            return 'Administrador';
        }

        return 'Usuário Padrão';

    }

    // Checa se user é ADMIN 
    isAdmin(): boolean {
        return this.getTipoUsuario() === 'ADMIN';
    }

    // Le os dados do token JWT
    // esse metodo é private pq só o auth service precisa saber como o token é lido
    private getPayloadToken(token: string): any {
        try {

            const payloadBase64 = token.split('.')[1];

            if(!payloadBase64) {
                return null;
            }

            const payloadJson = atob(
                payloadBase64.replace(/-/g,'+').replace(/_/g,'/')
            )

            return JSON.parse(payloadJson);

        } catch {
            return null;
        }
    }




}