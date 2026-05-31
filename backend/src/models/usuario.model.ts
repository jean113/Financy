import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class UsuarioModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  nome!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  senha?: string

  @Field(() => GraphQLISODateTime)
  criadoEm!: Date

  @Field(() => GraphQLISODateTime)
  atualizadoEm!: Date
}
