import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";  
import { HttpClient } from "@angular/common/http";  
import { NovaAvaliacaoInicial, PayloadAvaliacao } from "../models/avaliacao.model"; 

@Injectable({
    providedIn: 'root'
})
export class AvaliacaoService {
    private readonly storageKey = 'nova_avaliacao_inicial'
    private avaliacaoInicialSubject = new BehaviorSubject<NovaAvaliacaoInicial | null>(
        this.carregarDoStorage()
    );

    avaliacaoInicial$ = this.avaliacaoInicialSubject.asObservable();

     constructor(private http: HttpClient) {} 

    definirAvaliacaoInicial(dados: NovaAvaliacaoInicial): void {
        this.avaliacaoInicialSubject.next(dados);
        sessionStorage.setItem(this.storageKey, JSON.stringify(dados))
    }

    obterAvaliacaoInicial(): NovaAvaliacaoInicial | null {
        return this.avaliacaoInicialSubject.value;
    }

    limparAvaliacaoInicial(): void {
        this.avaliacaoInicialSubject.next(null);
        sessionStorage.removeItem(this.storageKey);
    }
      enviarAvaliacao(payload: PayloadAvaliacao): Observable<any> {
        return this.http.post(`http://localhost:3000/avaliacoes`, payload);
    }
  

    private carregarDoStorage(): NovaAvaliacaoInicial | null {
        const dados = sessionStorage.getItem(this.storageKey);
        if(!dados){
            return null
        }

        try {
            return JSON.parse(dados) as NovaAvaliacaoInicial;

        } catch {
            sessionStorage.removeItem(this.storageKey);
            return null;
        }
    }

}

