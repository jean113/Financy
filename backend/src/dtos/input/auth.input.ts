import { Field, InputType } from 'type-graphql'

@InputType()
export class RegistroInput {
  @Field(() => String)
  nome!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  senha!: string
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email!: string

  @Field(() => String)
  senha!: string
}
