import { Paciente } from "./paciente.model";

export interface NovaAvaliacaoInicial {
    id_paciente: number;
    paciente: Paciente;
    nome_respondente: string;
    relacao_respondente: string;
    respondente_documento?: string | null;
    observacoes?: string;
}

export interface RespostaSintoma {
  id_sintoma: number;
  presente: boolean;
}

export interface PayloadAvaliacao {
  id_paciente: number;
  respondente_nome: string;
  respondente_parentesco: string;
  respondente_documento?: string | null;
  observacoes?: string | null;
  respostas: RespostaSintoma[];
}
