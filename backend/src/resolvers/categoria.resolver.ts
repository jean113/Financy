import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CategoriaModel } from '../models/categoria.model.js'
import { CriarCategoriaInput, AtualizarCategoriaInput } from '../dtos/input/categoria.input.js'
import { CategoriaService } from '../services/categoria.service.js'
import { IsAuth } from '../middlewares/auth.middleware.js'
import type { GraphqlContext } from '../graphql/context/index.js'

@Resolver(() => CategoriaModel)
@UseMiddleware(IsAuth)
export class CategoriaResolver {
  private CategoriaService = new CategoriaService()

  @Mutation(() => CategoriaModel)
  async criarCategoria(
    @Arg('usuarioId', () => String) usuarioId: string,
    @Arg('data', () => CriarCategoriaInput) data: CriarCategoriaInput,
  ): Promise<CategoriaModel> {
    return this.CategoriaService.criar(usuarioId, data)
  }

  @Mutation(() => CategoriaModel)
  async atualizarCategoria(
    @Arg('id', () => String) id: string,
    @Arg('data', () => AtualizarCategoriaInput) data: AtualizarCategoriaInput,
  ): Promise<CategoriaModel> {
    return this.CategoriaService.atualizar(id, data)
  }

  @Query(() => [CategoriaModel])
  async listarCategorias(@Ctx() ctx: GraphqlContext): Promise<CategoriaModel[]> {
    return this.CategoriaService.listar(ctx.usuarioId!)
  }

  @Mutation(() => CategoriaModel)
  async excluirCategoria(
    @Arg('id', () => String) id: string
  ): Promise<CategoriaModel> {
    return this.CategoriaService.excluir(id)
  }

  @Query(() => CategoriaModel)
  async recuperarCategoria(@Arg('id', () => String) id: string): Promise<CategoriaModel> {
    return this.CategoriaService.recuperar(id)
  }

  @Query(() => Int)
  async totalCategoria(@Ctx() ctx: GraphqlContext): Promise<number> {
    return this.CategoriaService.totalCategoria(ctx.usuarioId!)
  }

  @Query(() => CategoriaModel, { nullable: true })
  async categoriaMaisUsada(@Ctx() ctx: GraphqlContext): Promise<CategoriaModel | null> {
    return this.CategoriaService.categoriaMaisUsada(ctx.usuarioId!);
  }

  @Query(() => [CategoriaModel])
  async listarCategoriaComTotais(@Ctx() ctx: GraphqlContext) {
    return this.CategoriaService.listarCategoriaComTotais(ctx.usuarioId!);
  }
}
