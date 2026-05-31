import { gql } from '@apollo/client'

export const VERIFICAR_EMAIL = gql`
  query VerificarEmail($email: String!) {
    verificarEmail(email: $email)
  }
`