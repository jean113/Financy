import { gql } from "@apollo/client"

export const REGISTRO = gql`
  mutation Registro($data: RegistroInput!) {
    registro(data: $data) {
      token
      refreshToken
      usuario {
        id
        nome
        email
        criadoEm
        atualizadoEm
      }
    }
  }
`
