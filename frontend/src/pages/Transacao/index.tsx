import { Page } from "../../components/Page"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { CalendarIcon, CircleArrowDown, CircleArrowUp, Edit, Plus, Search, Trash } from "lucide-react"
import { CriarTransacaoDialog } from "./components/CriarTransacaoDialog"
import { createElement, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import type { Categoria, Transacao } from "../../types/index"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatarData, recuperarIconeCategoria } from "@/lib/utils"
import { toast } from "sonner"
import { EXCLUIR_TRANSACAO } from "@/lib/graphql/mutations/Transacao"
import { LISTAR_TRANSACOES, SALDO_TOTAL, RECEITA_TOTAL, DESPESA_TOTAL, TOTAL_TRANSACAO } from "../../lib/graphql/queries/Transacao"
import { CATEGORIA_MAIS_USADA, LISTAR_CATEGORIAS, LISTAR_CATEGORIA_COM_TOTAIS } from "@/lib/graphql/queries/Categoria"
import { ptBR } from "date-fns/locale"

export function TransacoesPagina() {
  const [openDialog, setOpenDialog] = useState(false)
  const [atualizar, setAtualizarDialog] = useState(false)

  const [filtros, setFiltros] = useState({
    descricao: '',
    tipo: 'todos',
    categoriaId: 'todos',
    data: '',
  })


  const [pagina, setPagina] = useState(1)

  const { data, loading, refetch } = useQuery<{ 
    listarTransacoes: { 
      transacoes: Transacao[], 
      totalPaginas: number, 
      paginaAtual: number,
      total: number 
    } 
  }>(LISTAR_TRANSACOES, {
    variables: { filtros, pagina }
  })

  const transacoes = data?.listarTransacoes.transacoes ?? []
  const totalPaginas = data?.listarTransacoes.totalPaginas ?? 1

  const setFiltro = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
    setPagina(1)
  }

  const [transacaoSelecionada, setTransacaoSelecionada] = useState<Transacao | undefined>(undefined)

  const { data: dataCategorias } = useQuery<{ listarCategorias: Categoria[] }>(LISTAR_CATEGORIAS)
  const categorias = dataCategorias?.listarCategorias ?? []

  const [date, setDate] = React.useState<Date>()

  const [excluirTransacao] = useMutation(EXCLUIR_TRANSACAO, {
    onCompleted() {
      toast.success("Transação excluída com sucesso")
    },
    onError() {
      toast.error("Falha ao excluir a transação")
    },
    refetchQueries: [
      { query: LISTAR_TRANSACOES, variables: { filtros, pagina } },
      { query: SALDO_TOTAL },
      { query: RECEITA_TOTAL },
      { query: DESPESA_TOTAL },
      { query: LISTAR_CATEGORIA_COM_TOTAIS },
      { query: TOTAL_TRANSACAO },  
      { query: CATEGORIA_MAIS_USADA },
    ]
  })

  const onExcluir = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()

    toast("Deseja excluir esta transação?", {
      description: "Esta ação não pode ser desfeita.",
      classNames: {
        description: "!text-red-500 !font-bold"
      },
      action: {
        label: "Sim, excluir",
        onClick: () => excluirTransacao({ variables: { id } }),
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    })
  }

function devoAtualizar(dialog: boolean, atualizar: boolean, transacao?: Transacao) {
  setOpenDialog(dialog)
  setAtualizarDialog(atualizar)
  setTransacaoSelecionada(transacao)
}

  return (
    <Page>
      <div className="space-y-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-3xl font-bold">Transações</Label>
            <Label className="text-[16px] text-gray-600">Organize suas transações por categorias</Label>
          </div>
          <Button className="bg-brand-base hover:bg-brand-dark hover:cursor-pointer" onClick={() => devoAtualizar(true, false)}>
            <Plus className="mr-2 h-4 w-4"/>
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="w-full bg-gray-50 rounded-sm mb-6 px-4 py-4 flex flex-wrap items-center gap-4 border-gray-200">
        <div>
          <Label className="mb-2 font-medium text-[14px]">Buscar</Label>
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" 
              size={18} 
            />
            <Input
              id="search"
              placeholder="Buscar por descrição"
              className="pl-10 h-10 w-95"
              value={filtros.descricao}
              onChange={(e) => setFiltro('descricao', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label className="mb-2 font-medium text-[14px]">Tipo</Label>
          <Select value={filtros.tipo} onValueChange={(value) => setFiltro('tipo', value)}>
            <SelectTrigger className="pl-10 !h-10 w-95">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
                <SelectItem value="receita">Receita</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 font-medium text-[14px]">Categoria</Label>
          <Select value={filtros.categoriaId} onValueChange={(value) => setFiltro('categoriaId', value)}>
            <SelectTrigger className="pl-10 !h-10 w-95">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos</SelectItem>
                  { categorias.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.titulo}</SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <Label className="mb-2 font-medium text-[14px]">Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!date}
                  className="w-90 !h-10 justify-start text-left font-normal data-[empty=true]:text-muted-foreground border-gray-200"
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" locale={ptBR} onSelect={(date) => {
                  setDate(date)
                  setFiltro('data', date!.toISOString())
                }} />
                {date && (
                  <div className="p-2 border-t border-gray-200">
                    <Button variant="outline" className="w-full h-8 text-xs" onClick={() => {
                      setDate(undefined)
                      setFiltro('data', '')
                    }}>
                      Limpar data
                    </Button>
                  </div>
              )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-50 rounded-sm">

        <div className="grid grid-cols-6 gap-4 px-4 py-2 border-b border-b-gray-200">
          <span className="text-[12px] font-medium text-gray-500">Descrição</span>
          <span className="text-[12px] font-medium text-gray-500">Data</span>
          <span className="text-[12px] font-medium text-gray-500">Categoria</span>
          <span className="text-[12px] font-medium text-gray-500">Tipo</span>
          <span className="text-[12px] font-medium text-gray-500">Valor</span>
          <span className="text-[12px] font-medium text-gray-500">Ações</span>
        </div>

        {!loading && transacoes.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <span className="text-gray-500 text-sm">Nenhuma transação encontrada</span>
          </div>
        )}

        {!loading && transacoes.map((transacao) => (
          <div key={transacao.id} className="grid grid-cols-6 gap-4 px-4 py-2 items-center border-b border-b-gray-200">
          
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-md mr-2"
                style={{ backgroundColor: `${transacao.categoria?.cor}1a` }}>
                {createElement(recuperarIconeCategoria(transacao.categoria!.icone!), {
                  className: "h-4 w-4",
                  style: { color: transacao.categoria?.cor }
                })}
              </div>
              <span className="font-medium text-[14px] text-gray-900">{transacao.descricao}</span>
            </div>

            <div className="text-sm text-gray-600">{formatarData(transacao.data!)}</div>

            <div>
              <Badge style={{ backgroundColor: `${transacao.categoria?.cor}1a` }}>
                <Label style={{ color: `${transacao.categoria?.cor}` }}>{transacao.categoria?.titulo}</Label>
              </Badge>
            </div>

            <div className="flex items-center justify-center">
              {transacao.tipo === 'despesa' ? (
                <CircleArrowDown className="text-red-base mr-2" />
              ) : (
                <CircleArrowUp className="text-brand-base mr-2" />
              )}
              <Label className={`font-medium text-sm ${transacao.tipo === 'despesa' ? 'text-red-base' : 'text-brand-base'}`}>
                {transacao.tipo === 'despesa' ? 'Saída' : 'Entrada'}
              </Label>
            </div>

            <div className="font-semibold text-sm">
              {transacao.tipo === 'despesa' ? '- ' : '+ '}
              R$ {Number(transacao.valor).toFixed(2).replace('.', ',')}
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button className="hover:bg-gray-200 hover:cursor-pointer border border-gray-300 w-8 h-8 flex items-center justify-center bg-white"
                onClick={(e) => onExcluir(e, transacao.id)}>
                <Trash className="text-danger h-4 w-4" />
              </Button>
              <Button className="hover:bg-gray-200 hover:cursor-pointer border border-gray-300 w-8 h-8 flex items-center justify-center bg-white"
                onClick={() => devoAtualizar(true, true, transacao)}>
                <Edit className="h-4 w-4 text-gray-900" />
              </Button>
            </div>

          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-0.5 rounded-sm p-2 bg-gray-50">
        <span className="text-xs text-gray-500">
        {data?.listarTransacoes.total === 0
          ? "Nenhum resultado"
          : `${((pagina - 1) * 10) + 1} a ${Math.min(pagina * 10, data?.listarTransacoes.total ?? 0)} | ${data?.listarTransacoes.total ?? 0} resultados`
        }
      </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPagina(p => p - 1)}
            disabled={pagina === 1}
            className="border-gray-300 hover:bg-gray-200"
          >
            {'<'}
          </Button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
            <Button
              key={p}
              variant={p === pagina ? 'default' : 'outline'}
              className={p === pagina ? 'bg-brand-base' : 'border-gray-300 hover:bg-gray-200'}
              onClick={() => setPagina(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setPagina(p => p + 1)}
            disabled={pagina === totalPaginas}
            className="border-gray-300 hover:bg-gray-200"
          >
            {'>'}
          </Button>
        </div>
      </div>
      <CriarTransacaoDialog open={openDialog} transacao={transacaoSelecionada} atualizar={atualizar} onOpenChange={setOpenDialog} onCreated={() => refetch()} />
    </Page>
  )
}
