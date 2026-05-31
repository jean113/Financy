import {
  Arg,
  Ctx,
  Float,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { TransacaoModel, TransacaoPaginadaModel } from '../models/transacao.model.js'
import { TransacaoService } from '../services/transacao.service.js'
import { CriarTransacaoInput, AtualizarTransacaoInput } from '../dtos/input/transacao.input.js'
import { IsAuth } from '../middlewares/auth.middleware.js'
import type { Context } from 'vm'
import { FiltrosTransacaoInput } from '../dtos/input/filtrosTransacao.input.js'

@Resolver(() => TransacaoModel)
@UseMiddleware(IsAuth)
export class TransacaoResolver {
  private TransacaoService = new TransacaoService()

  @Mutation(() => TransacaoModel)
  async criarTransacao(
    @Arg('usuarioId', () => String) usuarioId: string,
    @Arg('categoriaId', () => String) categoriaId: string,
    @Arg('data', () => CriarTransacaoInput) data: CriarTransacaoInput,
  ): Promise<TransacaoModel> {
    return this.TransacaoService.criar(usuarioId, categoriaId, data)
  }

  @Mutation(() => TransacaoModel)
  async atualizarTransacao(
    @Arg('id', () => String) id: string,
    @Arg('categoriaId', () => String) categoriaId: string,
    @Arg('data', () => AtualizarTransacaoInput) data: AtualizarTransacaoInput,
  ): Promise<TransacaoModel> {
    return this.TransacaoService.atualizar(id, categoriaId, data)
  }

  @Query(() => TransacaoPaginadaModel)
  async listarTransacoes(
    @Ctx() ctx: Context,
    @Arg('filtros', () => FiltrosTransacaoInput, { nullable: true }) filtros?: FiltrosTransacaoInput,
    @Arg('pagina', () => Int, { nullable: true }) pagina?: number,
  ): Promise<TransacaoPaginadaModel> {
    return this.TransacaoService.listar(ctx.usuarioId, filtros, pagina ?? 1)
  }

  @Mutation(() => TransacaoModel)
  async excluirTransacao(@Arg('id', () => String) id: string): Promise<TransacaoModel> {
      return this.TransacaoService.excluir(id)
    }

  @Query(() => TransacaoModel)
  async getTransacao(@Arg('id', () => String) id: string): Promise<TransacaoModel> {
    return this.TransacaoService.recuperar(id)
  }

  @Query(() => Int)
  async totalTransacao(@Ctx() ctx: Context): Promise<number> {
      return this.TransacaoService.totalTransacao(ctx.usuarioId)
  }

  @Query(() => Float)
  async saldoTotal(@Ctx() ctx: Context): Promise<number> {
    return this.TransacaoService.saldoTotal(ctx.usuarioId);
  }

  @Query(() => Float)
  async receitaTotal(@Ctx() ctx: Context): Promise<number> {
    return this.TransacaoService.receitaTotal(ctx.usuarioId);
  }

  @Query(() => Float)
  async despesaTotal(@Ctx() ctx: Context): Promise<number> {
    return this.TransacaoService.despesaTotal(ctx.usuarioId);
  }
}
