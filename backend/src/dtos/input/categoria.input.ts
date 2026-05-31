import { Field, InputType } from 'type-graphql'

@InputType()
export class CriarCategoriaInput {
  @Field(() => String)
  titulo!: string

  @Field(() => String)
  descricao!: string

  @Field(() => Number)
  icone!: number

  @Field(() => String)
  cor!: string
}

@InputType()
export class AtualizarCategoriaInput {
  @Field(() => String)
  titulo!: string

  @Field(() => String)
  descricao!: string

  @Field(() => Number)
  icone!: number

  @Field(() => String)
  cor!: string
}
