import { gql } from "@apollo/client"

export const CRIAR_TRANSACAO= gql`
  mutation criarTransacao($usuarioId: String!, $categoriaId: String!, $data: CriarTransacaoInput!) {
    criarTransacao(usuarioId: $usuarioId, categoriaId: $categoriaId, data: $data) {
      id
      descricao
      valor
      tipo
      data
      criadoEm
      atualizadoEm
    }
  }
`

export const ATUALIZAR_TRANSACAO = gql`
  mutation atualizarTransacao($id: String!, $categoriaId: String! $data: AtualizarTransacaoInput!) {
    atualizarTransacao(id: $id, categoriaId: $categoriaId, data: $data) {
      id
      descricao
      valor
      tipo
      data
      criadoEm
      atualizadoEm
    }
  }
`

export const EXCLUIR_TRANSACAO = gql`
  mutation excluirTransacao($id: String!) {
    excluirTransacao(id: $id) {
      id
    }
  }
`