export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  cpf?: string;
  tipo_usuario: 'ADMIN' | 'PADRAO';
  crm?: string;
  especialidade?: string;
  instituicao?: string;
  cargo?: string;
  ativo: boolean;
  permissoes?: string[];
}

export interface CriarUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  tipo_usuario: 'ADMIN' | 'PADRAO';
  crm?: string;
  especialidade?: string;
  instituicao?: string;
  cargo?: string;
  permissoes?: string[];
}