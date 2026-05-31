import { useEffect, useState } from "react"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { useMutation, useQuery } from "@apollo/client/react"
import { ATUALIZAR_TRANSACAO, CRIAR_TRANSACAO } from "../../../lib/graphql/mutations/Transacao"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CircleArrowDown, CircleArrowUp } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CATEGORIA_MAIS_USADA, LISTAR_CATEGORIAS, LISTAR_CATEGORIA_COM_TOTAIS } from "@/lib/graphql/queries/Categoria"
import type { Categoria, Transacao } from "@/types"
import { useAuthStore } from "@/store/auth"
import { LISTAR_TRANSACOES, DESPESA_TOTAL, SALDO_TOTAL, RECEITA_TOTAL, TOTAL_TRANSACAO } from "@/lib/graphql/queries/Transacao"
import { ptBR } from "date-fns/locale"
import { FormField } from "@/components/ui/formField"

interface CriarTransacaoDialogProps {
  open: boolean
  atualizar: boolean
  transacao?: Transacao
  onOpenChange: (oepn: boolean) => void
  onCreated?: () => void
}

const estadoInicial = {
  descricao: "",
  valor: "",
  tipo: "despesa",
  data: "",
  categoriaId: "",
}

export function CriarTransacaoDialog({
  open,
  atualizar,
  transacao,
  onOpenChange,
  onCreated,
}: CriarTransacaoDialogProps) {
  const [transacaoCampos, setTransacaoCampos] = useState(estadoInicial)
  const usuario = useAuthStore((state) => state.usuario);

  const { data: dataCategoria } = useQuery<{ listarCategorias: Categoria[] }>(LISTAR_CATEGORIAS, {
    fetchPolicy: 'network-only'
  })
  const categorias = dataCategoria?.listarCategorias ?? [];

  const setConteudo = (campo: string, valor: string | number) => {
    setTransacaoCampos(prev => ({ ...prev, [campo]: valor }))
  }

  const [criarTransacao, { loading }] = useMutation(CRIAR_TRANSACAO, {
    onCompleted() {
      toast.success("Transacao criada com sucesso")
      onOpenChange(false)
      onCreated?.()
    },
    onError() {
      toast.error("Falha ao criar a transacao")
    },
    refetchQueries: [
      { query: LISTAR_TRANSACOES },
      { query: SALDO_TOTAL },
      { query: RECEITA_TOTAL },
      { query: DESPESA_TOTAL },
      { query: LISTAR_CATEGORIA_COM_TOTAIS },
      { query: TOTAL_TRANSACAO },  
      { query: CATEGORIA_MAIS_USADA },
    ]
  })

  const [atualizarTransacao] = useMutation(ATUALIZAR_TRANSACAO, {
      onCompleted() {
        toast.success("Transação alterada com sucesso")
        onOpenChange(false)
        onCreated?.()
      },
      onError() {
        toast.error("Falha ao alterar a Transação")
      },
      refetchQueries: [
        { query: LISTAR_TRANSACOES },
        { query: SALDO_TOTAL },
        { query: RECEITA_TOTAL },
        { query: DESPESA_TOTAL },
        { query: LISTAR_CATEGORIA_COM_TOTAIS },
        { query: TOTAL_TRANSACAO },  
        { query: CATEGORIA_MAIS_USADA },
      ]
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!transacaoCampos.descricao) {
      toast.error("Informe uma descrição")
      return
    }
    if (!transacaoCampos.valor || isNaN(parseFloat(transacaoCampos.valor.replace(/[R$\s.]/g, '').replace(',', '.')))) {
      toast.error("Informe um valor válido")
      return
    }
    if (!transacaoCampos.data) {
      toast.error("Informe uma data")
      return
    }
    if (!transacaoCampos.categoriaId) {
      toast.error("Selecione uma categoria")
      return
    }

    if(!atualizar)
    {
      criarTransacao({
        variables: {
          usuarioId: usuario?.id,
          categoriaId: transacaoCampos.categoriaId,
          data: {
            descricao: transacaoCampos.descricao,
            valor: parseFloat(transacaoCampos.valor.replace(/[R$\s.]/g, '').replace(',', '.')),
            tipo: transacaoCampos.tipo,
            data: transacaoCampos.data ? new Date(transacaoCampos.data).toISOString() : "",
          },
        },
      })
    }
    else
    {
      atualizarTransacao({
        variables: {
          id: transacao?.id,
          usuarioId: usuario?.id,
          categoriaId: transacaoCampos.categoriaId,
          data: {
            descricao: transacaoCampos.descricao,
            valor: parseFloat(transacaoCampos.valor.replace(/[R$\s.]/g, '').replace(',', '.')),
            tipo: transacaoCampos.tipo,
            data: transacaoCampos.data ? new Date(transacaoCampos.data).toISOString() : "",
            atualizadoEm: new Date().toISOString(), 
          },
        },
      })
    } 
  }

  const formatarValor = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '')
    const numero = parseFloat(apenasNumeros) / 100
    if (isNaN(numero)) return ''
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  useEffect(() => {
    setTimeout(() => {
      if (transacao && atualizar) {
        setTransacaoCampos({
          descricao: transacao.descricao ?? "",
          valor: String(transacao.valor ?? ""),
          tipo: transacao.tipo ?? "despesa",
          data: transacao.data ? new Date(transacao.data).toISOString() : "",
          categoriaId: transacao.categoriaId ?? transacao.categoria?.id ?? "",
        })
      } else {
        setTransacaoCampos(estadoInicial)
      }
    }, 0)
  }, [transacao, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold leading-tight">
            <Label className="text-xl font-semibold leading-tight text-gray-800">
              Nova transação
            </Label>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Registre sua despesa ou receita
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setConteudo("tipo", "despesa")}
            className={`w-44 h-14 flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-all ${
              transacaoCampos.tipo === "despesa"
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <CircleArrowDown className="text-red-base" />
            <span className="text-sm font-medium text-black">Despesa</span>
          </Button>

          <Button
            type="button"
            onClick={() => setConteudo("tipo", "receita")}
            className={`w-44 h-14 lex items-center gap-2 px-4 py-2 rounded-md border-2 transition-all  ${
              transacaoCampos.tipo === "receita"
                ? "border-brand-base bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <CircleArrowUp className="text-brand-base" />
            <span className="text-sm font-medium text-black">Receita</span>
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <FormField
              className="resize-none h-10"
              id="descricao"
              label="Descrição"
              placeholder="Adicione uma descricao para a transação"
              value={transacaoCampos.descricao}
              onChange={(e) => setConteudo("descricao", e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex justify-between">
              <div className="space-y-1 mr-2">
                <Label htmlFor="data" className="text-sm font-normal">
                  Data
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!transacaoCampos.data}
                      className="w-full h-10 justify-start text-left font-normal data-[empty=true]:text-muted-foreground border-gray-200"
                    >
                      <CalendarIcon />
                      {transacaoCampos.data ? format(transacaoCampos.data, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" locale={ptBR} selected={transacaoCampos.data ? new Date(transacaoCampos.data) : undefined}  onSelect={(date) => setConteudo("data", date!.toISOString())} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <FormField
                  className="resize-none h-10"
                  id="valor"
                  label="Valor"
                  placeholder="Digite uma valor"
                  value={transacaoCampos.valor}
                  onChange={(e) => setConteudo("valor", formatarValor(e.target.value))}
                  disabled={loading}
                />
              </div>
          </div>
          <div>
            <Label className="mb-2 font-medium text-[14px]">Categoria</Label>
            <Select value={transacaoCampos.categoriaId} onValueChange={(value) => setConteudo("categoriaId", value)}>
              <SelectTrigger className="w-full !h-10">
                <SelectValue placeholder="Selecione uma categoria"/>
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Button className="w-full h-12 bg-brand-base hover:bg-brand-dark hover:cursor-pointer" type="submit" disabled={loading}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
