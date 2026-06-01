export interface Paciente {
  id_paciente: number;
  nome: string;
  cpf: number;
  sexo: string;
  dataNascimento: string;
  idade:number;
  telefone: string;
  responsavel: string;
  observacao?: string | null;
  ativo: number;
}
