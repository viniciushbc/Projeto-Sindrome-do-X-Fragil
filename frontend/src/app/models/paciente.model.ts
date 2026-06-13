export interface Paciente {
  id_paciente: number;
  nome: string;
  cpf?: string | null;
  sexo: string;
  data_nascimento?: string | null;
  dataNascimento?: string | null;
  idade?: number | null;
  telefone?: string | null;
  responsavel?: string | null;
  observacoes?: string | null;
  observacao?: string | null;
  ativo: number | boolean;
}