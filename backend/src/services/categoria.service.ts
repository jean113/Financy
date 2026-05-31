import { prisma } from '../../prisma/prisma.js'
import { CriarCategoriaInput, AtualizarCategoriaInput } from '../dtos/input/categoria.input.js'

export class CategoriaService {
  async criar(usuarioId: string, data: CriarCategoriaInput) {
    const buscarUsuarioId = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
    })
    if (!buscarUsuarioId) throw new Error('Usuário não encontrado.')
    return prisma.categoria.create({
      data: {
        usuarioId,
        titulo: data.titulo,
        descricao: data.descricao,
        icone: data.icone,
        cor: data.cor,
      },
    })
  }

  async atualizar(id: string, data: AtualizarCategoriaInput) {
      const categoria = await prisma.categoria.findUnique({
        where: { id },
      })
      if (!categoria) throw new Error('Categoria não existe')
  
      return prisma.categoria.update({
        where: { id },
        data: {
          titulo: data.titulo ?? undefined,
          descricao: data.descricao ?? undefined,
          icone: data.icone ?? undefined,
          cor: data.cor ?? undefined,
        },
      })
    }

  async recuperar(id: string) {
    const categoria = await prisma.categoria.findUnique({
      where: {
        id,
      },
    })

    if (!categoria) throw new Error('Categoria não encontrada')

    return categoria
  }

  async listar(usuarioId: string) {
    return prisma.categoria.findMany({
      where: {
        usuarioId,
      },
      include: { usuario: true }
    })
  }

  async excluir(id: string) {
    const buscarCategoria = await prisma.categoria.findUnique({
      where: {
        id,
      },
    })

    if (!buscarCategoria) throw new Error('Categoria não encontrada')

    const transacoes = await prisma.transacao.count({
      where: { categoriaId: id }
    })

    if (transacoes > 0) {
      throw new Error('Categoria possui transações vinculadas e não pode ser excluída')
    }

    return prisma.categoria.delete({
      where: {
        id,
      },
    })
  }

  async totalCategoria(usuarioId: string) {
    return prisma.categoria.count({
      where: {
        usuarioId,
      },
    });
  }

  async categoriaMaisUsada(usuarioId: string) {
    const resultado = await prisma.categoria.findFirst({
      where: { usuarioId },
      orderBy: {
        Transacao: { _count: 'desc' }
      },
      include: {
        _count: { select: { Transacao: true } }
      }
    });
    return resultado;
  }

  async listarCategoriaComTotais(usuarioId: string) {
    return prisma.categoria.findMany({
      where: { usuarioId },
      include: {
        _count: { select: { Transacao: true } },
        Transacao: {
          select: { valor: true }
        }
      }
    });
  }
}
