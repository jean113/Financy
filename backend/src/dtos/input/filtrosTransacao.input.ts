import { Field, InputType } from "type-graphql"

@InputType()
export class FiltrosTransacaoInput {
  @Field(() => String, { nullable: true })
  descricao?: string

  @Field(() => String, { nullable: true })
  tipo?: string

  @Field(() => String, { nullable: true })
  categoriaId?: string

  @Field(() => String, { nullable: true })
  data?: string
}