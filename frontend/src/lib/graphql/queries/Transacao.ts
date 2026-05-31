import { gql } from "@apollo/client"

export const LISTAR_TRANSACOES = gql`
  query ListarTransacoes($filtros: FiltrosTransacaoInput, $pagina: Int) {
    listarTransacoes(filtros: $filtros, pagina: $pagina) {
      transacoes {
        id
        descricao
        valor
        tipo
        data
        categoriaId
        categoria {
          id
          titulo
          icone
          cor
        }
        usuarioId
        criadoEm
        atualizadoEm
      }
      total
      totalPaginas
      paginaAtual
    }
  }
`

export const RECUPERAR_TRANSACAO = gql`
  query recuperarTransacao($transacaoId: String!){
    recuperarTransacao(id: $transacaoId){
          id
          descricao
          valor
          tipo
          data
          usuarioId
          usuario {
            id
            nome
            email
          }
          categoriaId
          categoria {
            id
            titulo
          }
          criadoEm
          atualizadoEm
      }
  }
`

export const TOTAL_TRANSACAO = gql`
  query totalTransacao {
    totalTransacao
  }
`

export const SALDO_TOTAL = gql`
  query saldoTotal {
    saldoTotal
  }
`
export const RECEITA_TOTAL = gql`
  query receitaTotal {
    receitaTotal
  }
`
export const DESPESA_TOTAL = gql`
  query despesaTotal {
    despesaTotal
  }
`
