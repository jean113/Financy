import { UsuarioModel } from '../models/usuario.model.js'
import { prisma } from '../../prisma/prisma.js'
import { LoginInput, RegistroInput } from '../dtos/input/auth.input.js'
import { comparePassword, hashPassword } from '../utils/hash.js'
import { signJwt } from '../utils/jwt.js'

export class AuthService {
  async login(data: LoginInput) {
    const existeUsuario = await prisma.usuario.findUnique({
      where: {
        email: data.email,
      },
    })
    if (!existeUsuario) throw new Error('Usuário não cadastrado!')
    const compare = await comparePassword(data.senha, existeUsuario.senha)
    if (!compare) throw new Error('Senha inválida!')
    return this.gerenerateTokens(existeUsuario)
  }

  async registro(data: RegistroInput) {
    const existeUsuario = await prisma.usuario.findUnique({
      where: {
        email: data.email,
      },
    })
    if (existeUsuario) throw new Error('E-mail já cadastrado!')

    const hash = await hashPassword(data.senha)

    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hash,
      },
    })
    return this.gerenerateTokens(usuario)
  }

  gerenerateTokens(usuario: UsuarioModel) {
    const token = signJwt({ id: usuario.id, email: usuario.email }, '1d')
    const refreshToken = signJwt({ id: usuario.id, email: usuario.email }, '1d')
    return { token, refreshToken, usuario }
  }
}
