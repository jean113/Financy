import { Field, ID, Int, ObjectType } from 'type-graphql'
import { UsuarioModel } from './usuario.model.js'

@ObjectType()
export class CategoriaCountModel {
  @Field(() => Int)
  Transacao!: number
}

@ObjectType()
export class CategoriaTransacaoModel {
  @Field(() => Number)
  valor!: number
}

@ObjectType()
export class CategoriaModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  titulo!: string

  @Field(() => String)
  descricao!: string

  @Field(() => Number)
  icone!: number

  @Field(() => String)
  cor!: string

  @Field(() => Date)
  criadoEm!: Date

  @Field(() => Date)
  atualizadoEm!: Date

  @Field(() => String)
  usuarioId!: string

  @Field(() => UsuarioModel, { nullable: true })
  usuario?: UsuarioModel

  @Field(() => CategoriaCountModel, { nullable: true })
  _count?: CategoriaCountModel

  @Field(() => [CategoriaTransacaoModel], { nullable: true })
  Transacao?: CategoriaTransacaoModel[]
}
