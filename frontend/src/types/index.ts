export interface Usuario {
  id: string
  nome: string
  email: string
  criadoEm?: string
  atualizadoEm?: string
}

export interface RegistroInput {
  nome: string
  email: string
  senha: string
}


export interface LoginInput {
  email: string
  senha: string
}

export interface Categoria {
  id: string
  titulo: string
  descricao?: string
  icone?: number
  cor?: string
  usuarioId: string
   _count?: {
    Transacao: number
  }
  criadoEm: string
  atualizadoEm?: string
}

export interface Transacao {
  id: string
  descricao?: string
  valor: string
  tipo?: string
  data?: string
  usuarioId: string
  usuario?: Usuario
  categoriaId: string
  categoria?: Categoria
  criadoEm: string
  atualizadoEm?: string
}
