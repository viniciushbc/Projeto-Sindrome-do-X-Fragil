import { Paciente } from "./paciente.model";

export interface NovaAvaliacaoInicial {
    id_paciente: number;
    paciente: Paciente;
    nome_respondente: string;
    relacao_respondente: string;
    respondente_documento?: string | null;
    observacoes?: string;
}