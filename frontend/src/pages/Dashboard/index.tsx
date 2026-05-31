import { Page } from "../../components/Page"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { CircleArrowDown, CircleArrowUp, Plus, Wallet } from "lucide-react"
import { CriarTransacaoDialog } from "../Transacao/components/CriarTransacaoDialog"
import { createElement, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { DESPESA_TOTAL, LISTAR_TRANSACOES, RECEITA_TOTAL, SALDO_TOTAL } from "../../lib/graphql/queries/Transacao"
import { formatarData, recuperarIconeCategoria } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { LISTAR_CATEGORIA_COM_TOTAIS } from "@/lib/graphql/queries/Categoria"
import { useNavigate } from "react-router-dom"
import type { Categoria, Transacao } from "@/types"

export function Dashboard() {
  const [openDialog, setOpenDialog] = useState(false)
  const { data, loading, refetch } = useQuery<{
  listarTransacoes: {
      transacoes: Transacao[]
      totalPaginas: number
      paginaAtual: number
      total: number
    }
  }>(LISTAR_TRANSACOES, {
    variables: { filtros: {}, pagina: 1 }
  })

  const transacoes = data?.listarTransacoes.transacoes ?? []

  const { data: dataListarCategoriaTotais, loading: loadingListarCategoriaTotais } = useQuery<{
    listarCategoriaComTotais: (Categoria & {
      Transacao: { valor: number }[]
    })[]
  }>(LISTAR_CATEGORIA_COM_TOTAIS);

  const { data: dataSaldoTotal } = useQuery<{ saldoTotal: number }>(SALDO_TOTAL);

  const { data: dataReceitaTotal } = useQuery<{ receitaTotal: number }>(RECEITA_TOTAL);

  const { data: dataDespesaTotal } = useQuery<{ despesaTotal: number }>(DESPESA_TOTAL);

  const navigate = useNavigate();


  return (
    <Page>

      <div className="grid gap-3 grid-cols-3 my-4">
        <div className="flex flex-col items-start rounded-xl bg-white p-5">
          <div className="flex mb-2">
            <Wallet className="mr-2 h-4 w-4 text-purple-base" />
            <Label className="text-[12px] font-medium text-gray-600">SALDO TOTAL</Label>
          </div>
          <div>
            <Label className="text-[32px] font-bold text-gray-800 mb-2">R$ {dataSaldoTotal?.saldoTotal.toFixed(2).replace('.', ',')}</Label>
          </div>
        </div>
        <div className="flex flex-col items-start  rounded-xl bg-white p-5">
          <div className="flex mb-2">
            <CircleArrowUp className="text-brand-base mr-2 h-4 w-4" />
            <Label className="text-[12px] font-medium text-gray-600">RECEITAS DO MÊS </Label>
          </div>
          <div>
            <Label className="text-[32px] font-bold text-gray-800 mb-2">R$ {dataReceitaTotal?.receitaTotal.toFixed(2).replace('.', ',')}</Label>
          </div>
        </div>
        <div className="flex flex-col items-start  rounded-xl bg-white p-5">
          <div className="flex mb-2">
            <CircleArrowDown className="text-red-base  mr-2 h-4 w-4" />
            <Label className="text-[12px] font-medium text-gray-600">DESPESAS DO MÊS</Label>
          </div>
          <div>
            <Label className="text-[32px] font-bold text-gray-800 mb-2">R$ {dataDespesaTotal?.despesaTotal.toFixed(2).replace('.', ',')}</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between">

        <div className="w-[66%]">
          <div className="w-full bg-gray-50 rounded-t-sm">
            <div className="flex justify-between items-center border-b border-b-gray-200">
              <span className="text-[12px] font-medium text-gray-500 text-left p-4">TRANSAÇÕES RECENTES</span>
              <Button className="bg-gray-50" onClick={() => navigate('/transacao')}>
                <Label className="text-[14px] font-medium text-brand-base p-4 hover:underline">{'Ver todas >'}</Label>
              </Button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {!loading && transacoes.length === 0 && (
                <div className="flex items-center justify-center py-10">
                  <span className="text-gray-500 text-sm">Nenhuma transação encontrada</span>
                </div>
              )}

              {!loading && transacoes.map((transacao) => (
                <div key={transacao.id} className="grid grid-cols-3 gap-4 px-4 items-center border-b border-b-gray-200">

                  <div className="flex items-center py-4">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-md mr-2"
                      style={{ backgroundColor: `${transacao.categoria?.cor}1a` }}
                    >
                      {createElement(recuperarIconeCategoria(transacao.categoria!.icone!), {
                        className: "h-4 w-4",
                        style: { color: transacao.categoria?.cor }
                      })}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-[14px] text-gray-900">{transacao.descricao}</span>
                      <span className="text-sm text-gray-600">{formatarData(transacao.criadoEm)}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <Badge style={{ backgroundColor: `${transacao.categoria?.cor}1a` }}>
                      <Label style={{ color: `${transacao.categoria?.cor}` }}>{transacao.categoria?.titulo}</Label>
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="font-semibold text-sm mr-2">
                      {transacao.tipo === 'despesa' ? '- ' : '+ '}
                      R$ {Number(transacao.valor).toFixed(2).replace('.', ',')}
                    </span>
                    {transacao.tipo === 'despesa' ? (
                      <CircleArrowDown size={14} className="text-red-base" />
                    ) : (
                      <CircleArrowUp size={14} className="text-brand-base" />
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center w-full bg-gray-50 rounded-b-sm mt-0.5  h-[60px]">
              <div>
                <Button className="bg-gray-50" onClick={() => setOpenDialog(true)}>
                  <Plus size={20} className="text-brand-base mr-2"/>
                  <span className="text-[14px] font-medium text-brand-base">Nova Transação</span>
                </Button>
              </div>
          </div>
        </div>

        <div className="w-[33%] bg-gray-50 rounded-sm">
          <div className="flex justify-between items-center border-b border-b-gray-200">
            <span className="text-[12px] font-medium text-gray-500 text-left p-4">CATEGORIAS</span>
            <Button className="bg-gray-50" onClick={() => navigate('/categoria')}>
              <Label className="text-[14px] font-medium text-brand-base p-4 hover:underline">{'Gerenciar >'}</Label>
            </Button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {!loadingListarCategoriaTotais && dataListarCategoriaTotais?.listarCategoriaComTotais.length === 0 && (
              <div className="flex items-center justify-center py-10">
                <span className="text-gray-500 text-sm">Nenhuma categoria encontrada</span>
              </div>
            )}

            {!loadingListarCategoriaTotais && dataListarCategoriaTotais?.listarCategoriaComTotais.map((categoria) => {
              const totalValor = categoria.Transacao?.reduce((acc: number, t: { valor: number }) => acc + Number(t.valor), 0) || 0;

              return (
                <div key={categoria.id} className="grid grid-cols-3 gap-4 px-4 items-center">
                  <div className="text-sm">
                    <Badge style={{ backgroundColor: `${categoria?.cor}1a` }}>
                      <Label style={{ color: `${categoria?.cor}` }}>{categoria?.titulo}</Label>
                    </Badge>
                  </div>

                  <div className="flex justify-end py-4">
                    <span className="text-sm text-gray-600">{categoria._count?.Transacao} itens</span>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="font-semibold text-sm">
                      R$ {totalValor.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CriarTransacaoDialog open={openDialog} transacao={undefined} atualizar={false} onOpenChange={setOpenDialog} onCreated={() => refetch()}/>
    </Page>
  )
}
