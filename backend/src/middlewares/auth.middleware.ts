import { type MiddlewareFn } from 'type-graphql'
import { type GraphqlContext } from '../graphql/context/index.js'

export const IsAuth: MiddlewareFn<GraphqlContext> = async (
  { context },
  next
) => {
  if (!context.usuarioId) throw new Error('Usuário não autenticado!')
  return next()
}
