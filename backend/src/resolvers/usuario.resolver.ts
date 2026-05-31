import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { UsuarioModel } from '../models/usuario.model.js'
import { UsuarioService } from '../services/usuario.service.js'
import { IsAuth } from '../middlewares/auth.middleware.js'

@Resolver(() => UsuarioModel)
export class UsuarioResolver {
  private UsuarioService = new UsuarioService()

  @Query(() => UsuarioModel)
  @UseMiddleware(IsAuth)
  async recuperar(@Arg('id', () => String) id: string): Promise<UsuarioModel> {
    return this.UsuarioService.recuperar(id)
  }

 @Mutation(() => Boolean)
  async alterarSenha(
    @Arg('email', () => String) email: string,
    @Arg('novaSenha', () => String) novaSenha: string
  ): Promise<boolean> {
    return this.UsuarioService.alterarSenha(email, novaSenha)
  }

  @Query(() => Boolean)
  async verificarEmail(
    @Arg('email', () => String) email: string
  ): Promise<boolean> {
    return this.UsuarioService.verificarEmail(email)
  }
}
