import { gql } from "@apollo/client"

export const CRIAR_CATEGORIA = gql`
  mutation criarCategoria($usuarioId: String!, $data: CriarCategoriaInput!) {
    criarCategoria(usuarioId: $usuarioId, data: $data) {
      id
      titulo
      descricao
      icone
      cor
      usuarioId
      criadoEm
      atualizadoEm
    }
  }
`

export const ATUALIZAR_CATEGORIA = gql`
  mutation atualizarCategoria($id: String!, $data: AtualizarCategoriaInput!) {
    atualizarCategoria(id: $id, data: $data) {
      titulo
      descricao
      icone
      cor
    }
  }
`

export const EXCLUIR_CATEGORIA = gql`
  mutation excluirCategoria($id: String!) {
    excluirCategoria(id: $id) {
      id
    }
  }
`