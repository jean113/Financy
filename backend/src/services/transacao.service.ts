import { prisma } from '../../prisma/prisma.js'
import type { FiltrosTransacaoInput } from '../dtos/input/filtrosTransacao.input.js'
import { CriarTransacaoInput, AtualizarTransacaoInput } from '../dtos/input/transacao.input.js'

export class TransacaoService {
  async criar(usuarioId: string, categoriaId: string, data: CriarTransacaoInput) {
    const buscarUsuarioId = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
    })
    const buscarCategoriaId = await prisma.categoria.findUnique({
      where: {
        id: categoriaId,
      },
    })
    if (!buscarUsuarioId) throw new Error('Usuário não encontrado.')
    if (!buscarCategoriaId) throw new Error('Categoria não encontrada.')
    return prisma.transacao.create({
      data: {
        usuarioId,
        categoriaId,
        descricao: data.descricao,
        valor: data.valor,
        tipo: data.tipo,
        data: data.data,
      },
    })
  }

  async atualizar(id: string, categoriaId: string, data: AtualizarTransacaoInput) {
      const Transacao = await prisma.transacao.findUnique({
        where: { id },
      })
      if (!Transacao) throw new Error('Transacao não existe')
  
      return prisma.transacao.update({
        where: { id },
        data: {
          descricao: data.descricao ?? undefined,
          valor: data.valor ?? undefined,
          tipo: data.tipo ?? undefined,
          data: data.data ?? undefined,
          categoriaId: categoriaId ?? undefined,
        },
      })
    }

  async recuperar(id: string) {
    const transacao = await prisma.transacao.findUnique({
      where: {
        id,
      },
    })

    if (!transacao) throw new Error('Transação não encontrada')

    return transacao
  }

  async listar(usuarioId: string, filtros?: FiltrosTransacaoInput, pagina: number = 1, itensPorPagina: number = 10) {
    const pular = (pagina - 1) * itensPorPagina

    const [transacoes, total] = await prisma.$transaction([
      prisma.transacao.findMany({
        where: {
          usuarioId,
          ...(filtros?.descricao && { descricao: { contains: filtros.descricao } }),
          ...(filtros?.tipo && filtros.tipo !== 'todos' && { tipo: filtros.tipo as TipoTransacao }),
          ...(filtros?.categoriaId && filtros.categoriaId !== 'todos' && { categoriaId: filtros.categoriaId }),
          ...(filtros?.data && { data: { lte: new Date(filtros.data) } }),
        },
        include: { categoria: true, usuario: true },
        skip: pular,
        take: itensPorPagina,
      }),
      prisma.transacao.count({
        where: {
          usuarioId,
          ...(filtros?.descricao && { descricao: { contains: filtros.descricao } }),
          ...(filtros?.tipo && filtros.tipo !== 'todos' && { tipo: filtros.tipo as TipoTransacao }),
          ...(filtros?.categoriaId && filtros.categoriaId !== 'todos' && { categoriaId: filtros.categoriaId }),
          ...(filtros?.data && { data: { lte: new Date(filtros.data) } }),
        },
      })
    ])

    return {
      transacoes,
      total,
      totalPaginas: Math.ceil(total / itensPorPagina),
      paginaAtual: pagina,
    }
  }

  async excluir(id: string) {
    const buscarTransacao = await prisma.transacao.findUnique({
      where: {
        id,
      },
    })
    if (!buscarTransacao) throw new Error('Transacao não encontrada')
    return prisma.transacao.delete({
      where: {
        id,
      },
    })
  }

  async totalTransacao(usuarioId: string) {
    return prisma.transacao.count({
      where: {
        usuarioId,
      },
    });
  }

  async saldoTotal(usuarioId: string): Promise<number> {
    const transacoes = await prisma.transacao.findMany({
      where: { usuarioId },
      select: { valor: true, tipo: true }
    });

    return transacoes.reduce((acc, t) => {
      return t.tipo === 'receita' 
        ? acc + Number(t.valor) 
        : acc - Number(t.valor);
    }, 0);
  }

  async receitaTotal(usuarioId: string): Promise<number> {
    const resultado = await prisma.transacao.aggregate({
      where: { usuarioId, tipo: 'receita' },
      _sum: { valor: true }
    });

    return Number(resultado._sum.valor) || 0;
  }

  async despesaTotal(usuarioId: string): Promise<number> {
    const resultado = await prisma.transacao.aggregate({
      where: { usuarioId, tipo: 'despesa' },
      _sum: { valor: true }
    });

    return Number(resultado._sum.valor) || 0;
  }
}
