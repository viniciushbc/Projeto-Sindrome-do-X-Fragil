export interface Sintoma {
  id_sintoma: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface RespostaAvaliacaoRequest {
  id_sintoma: number;
  presente: boolean;
}

export interface CriarAvaliacaoRequest {
  id_paciente: number;
  respondente_nome?: string;
  respondente_parentesco?: string;
  respondente_documento?: string;
  observacoes?: string;
  respostas: RespostaAvaliacaoRequest[];
}