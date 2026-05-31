import { Field, ID, Int, ObjectType } from 'type-graphql'
import { UsuarioModel } from './usuario.model.js'
import { CategoriaModel } from './categoria.model.js'
import { GraphQLDecimal } from 'prisma-graphql-type-decimal'
import type { Decimal } from '@prisma/client/runtime/client'

@ObjectType()
export class TransacaoPaginadaModel {
  @Field(() => [TransacaoModel])
  transacoes!: TransacaoModel[]

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  totalPaginas!: number

  @Field(() => Int)
  paginaAtual!: number
}

@ObjectType()
export class TransacaoModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  descricao!: string

  @Field(() => GraphQLDecimal)
  valor!: Decimal

  @Field(() => String)
  tipo!: string

  @Field(() => Date)
  data!: Date

  @Field(() => Date)
  criadoEm!: Date

  @Field(() => Date)
  atualizadoEm!: Date

  @Field(() => String)
  categoriaId!: string

  @Field(() => CategoriaModel)
  categoria?: CategoriaModel

  @Field(() => String)
  usuarioId!: string

  @Field(() => UsuarioModel)
  usuario?: UsuarioModel
}