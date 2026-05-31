import { gql } from '@apollo/client'

export const ALTERAR_SENHA = gql`
  mutation AlterarSenha($email: String!, $novaSenha: String!) {
    alterarSenha(email: $email, novaSenha: $novaSenha)
  }
`