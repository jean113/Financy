import { gql } from "@apollo/client"


export const LISTAR_CATEGORIAS = gql`
    query listarCategorias {
      listarCategorias {
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

export const RECUPERAR_CATEGORIA = gql`
  query recuperarCategoria($categoriaId: String!){
    recuperarCategoria(id: $categoriaId){
          id
          titulo
          descricao
          icone
          cor
          usuarioId
          usuario {
            id
            nome
            email
          }
          criadoEm
          atualizadoEm
      }
  }
`

export const TOTAL_CATEGORIA = gql`
  query totalCategoria {
    totalCategoria
  }
`

export const CATEGORIA_MAIS_USADA = gql`
  query categoriaMaisUsada {
    categoriaMaisUsada {
      titulo
      icone
      cor
    }
  }
`

export const LISTAR_CATEGORIA_COM_TOTAIS = gql`
  query listarCategoriaComTotais {
    listarCategoriaComTotais {
      id
      titulo
      descricao
      cor
      icone
      _count {
        Transacao
      }
      Transacao {
        valor
      }
    }
  }
`
