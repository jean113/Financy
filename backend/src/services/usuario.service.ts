import { prisma } from '../../prisma/prisma.js'
import { hashPassword } from '../utils/hash.js'

export class UsuarioService {
  async recuperar(id: string) {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id,
      },
    })

    if (!usuario) throw new Error('Usuário não encontrado')

    return usuario
  }

  async alterarSenha(email: string, novaSenha: string) {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) throw new Error('Usuário não encontrado')

    const hash = await hashPassword(novaSenha)

    await prisma.usuario.update({
      where: { email },
      data: { senha: hash }
    })
    return true
  }

  async verificarEmail(email: string) {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    return !!usuario
  }
}
