export interface LoginRequest {
    login: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    usuario?: {
        id_usuario?: number;
        nome?: string;
        email?: string;
        tipo_usuario?: string;
    }
}