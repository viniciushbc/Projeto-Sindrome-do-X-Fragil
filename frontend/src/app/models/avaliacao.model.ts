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

export interface CriarAvaliacaoResponse {
  id_avaliacao: number;
  id_paciente: number;
  score: number;
  limiar_utilizado: number;
  resultado: 'ENCAMINHAR' | 'NAO_ENCAMINHAR';
  recomendacao: string;
}

export interface AvaliacaoResumo {
  id_avaliacao: number;
  data_avaliacao: string;
  score: number;
  resultado: 'ENCAMINHAR' | 'NAO_ENCAMINHAR';
  respondente_nome: string;
  respondente_parentesco: string;
  paciente_nome: string;
  paciente_sexo: string;
}