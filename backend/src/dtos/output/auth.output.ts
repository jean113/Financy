import { Field, ObjectType } from 'type-graphql'
import { UsuarioModel } from '../../models/usuario.model.js'

@ObjectType()
export class RegistroOutput {
  @Field(() => String)
  token!: string

  @Field(() => String)
  refreshToken!: string

  @Field(() => UsuarioModel)
  usuario!: UsuarioModel
}

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  token!: string

  @Field(() => String)
  refreshToken!: string

  @Field(() => UsuarioModel)
  usuario!: UsuarioModel
}
