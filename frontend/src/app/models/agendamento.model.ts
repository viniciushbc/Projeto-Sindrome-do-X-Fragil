export interface Agendamento {
  id_agendamento: number;
  id_paciente?: number;
  id_usuario?: number;
  data_agendamento: string;
  horario: string;
  observacao?: string;
  status: 'AGENDADO' | 'REALIZADO' | 'CANCELADO';
  paciente_nome: string;
  paciente_sexo?: string;
  profissional_nome: string;
  data_criacao?: string;
}

export interface CriarAgendamentoRequest {
  id_paciente: number;
  data_agendamento: string;
  horario: string;
  observacao?: string;
}