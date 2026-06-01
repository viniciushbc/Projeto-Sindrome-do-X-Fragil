import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { NovaAvaliacaoInicial } from "../models/avaliacao.model";

@Injectable({
    providedIn: 'root'
})
export class AvaliacaoService {
    private readonly storageKey = 'nova_avaliacao_inicial'
    private avaliacaoInicialSubject = new BehaviorSubject<NovaAvaliacaoInicial | null>(
        this.carregarDoStorage()
    );

    avaliacaoInicial$ = this.avaliacaoInicialSubject.asObservable();


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