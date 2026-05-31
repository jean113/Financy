import { createParameterDecorator, type ResolverData } from 'type-graphql'
import type { GraphqlContext } from '../context/index.js'
import { UsuarioModel } from '../../models/usuario.model.js'
import { prisma } from '../../../prisma/prisma.js'

export const GqlUser = () => {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphqlContext>): Promise<UsuarioModel | null> => {
      if (!context || !context.usuarioId) return null

      try {
        const usuario = await prisma.usuario.findUnique({
          where: {
            id: context.usuarioId,
          },
        })
        if (!usuario) throw new Error('Usuário não encontrado')
        return usuario;
      } catch (error) {
        console.log('Error ao instanciar o gqluser')
        return null;
      }
    }
  )
}
