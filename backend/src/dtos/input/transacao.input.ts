import { TipoTransacao } from '@prisma/client'
import { Field, InputType, registerEnumType } from 'type-graphql'

registerEnumType(TipoTransacao, {
  name: 'TipoTransacao',
  description: 'Tipo da transação: despesa ou receita',
})

@InputType()
export class CriarTransacaoInput {
  @Field(() => String)
  descricao!: string

  @Field(() => Number)
  valor!: number

  @Field(() => String)
  tipo!: TipoTransacao

  @Field(() => String)
  data!: string
}

@InputType()
export class AtualizarTransacaoInput {
  @Field(() => String)
  descricao!: string

  @Field(() => Number)
  valor!: number

  @Field(() => String)
  tipo!: TipoTransacao

  @Field(() => String)
  data!: string

  @Field(() => String)
  atualizadoEm!: string
}

