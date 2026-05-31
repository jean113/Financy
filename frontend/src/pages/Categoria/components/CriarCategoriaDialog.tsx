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
import { useMutation } from "@apollo/client/react"
import { ATUALIZAR_CATEGORIA, CRIAR_CATEGORIA } from "../../../lib/graphql/mutations/Categoria"
import { toast } from "sonner"
import { BaggageClaim, BookOpen, BriefcaseBusiness, CarFront, Dumbbell, Gift, HeartPulse, House, Mailbox, PawPrint, PiggyBank, ReceiptText, Salad, ShoppingCart, Ticket, Utensils } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import type { Categoria } from "@/types"
import { LISTAR_CATEGORIAS, CATEGORIA_MAIS_USADA, TOTAL_CATEGORIA } from "@/lib/graphql/queries/Categoria"
import { TOTAL_TRANSACAO } from "@/lib/graphql/queries/Transacao"
import { FormField } from "@/components/ui/formField"

interface CriarCategoriaDialogProps {
  open: boolean
  atualizar: boolean
  categoria?: Categoria
  onOpenChange: (oepn: boolean) => void
  onCreated?: () => void
}

const estadoInicial = {
  titulo: "",
  descricao: "",
  cor: "",
  icone: 0,
}

export function CriarCategoriaDialog({
  open,
  atualizar,
  categoria,
  onOpenChange,
  onCreated,
}: CriarCategoriaDialogProps) {
  const [categoriaCampos, setCategoriaCampos] = useState(estadoInicial)
  const usuario = useAuthStore((state) => state.usuario);

  const setConteudo = (campo: string, valor: string | number) => {
    setCategoriaCampos(prev => ({ ...prev, [campo]: valor }))
  }

  const [criarCategoria, { loading }] = useMutation(CRIAR_CATEGORIA, {
    onCompleted() {
      toast.success("Categoria criada com sucesso")
      onOpenChange(false)
      onCreated?.()
    },
    onError() {
      toast.error("Falha ao criar a categoria")
    },
      refetchQueries: [
      { query: LISTAR_CATEGORIAS },
      { query: CATEGORIA_MAIS_USADA },
      { query: TOTAL_CATEGORIA },
      { query: TOTAL_TRANSACAO}
    ]
  })

  const [atualizarCategoria] = useMutation(ATUALIZAR_CATEGORIA, {
    onCompleted() {
      toast.success("Categoria alterada com sucesso")
      onOpenChange(false)
      onCreated?.()
    },
    onError() {
      toast.error("Falha ao alterar a categoria")
    },
    refetchQueries: [
      { query: LISTAR_CATEGORIAS },
      { query: CATEGORIA_MAIS_USADA },
      { query: TOTAL_CATEGORIA },
      { query: TOTAL_TRANSACAO}
    ]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoriaCampos.icone) {
      toast.error("Selecione um ícone")
      return
    }
    if (!categoriaCampos.cor) {
      toast.error("Selecione uma cor")
      return
    }
    if (!categoriaCampos.titulo) {
      toast.error("Informe um título")
      return
    }

    if(!atualizar)
    {
      criarCategoria({
        variables: {
          usuarioId: usuario?.id,
          data: {
            titulo: categoriaCampos.titulo,
            descricao: categoriaCampos.descricao,
            icone: categoriaCampos.icone,
            cor: categoriaCampos.cor,
          },
        },
      })
    }
    else
    {
      atualizarCategoria({
        variables: {
          id: categoria?.id,
          data: {
            titulo: categoriaCampos.titulo,
            descricao: categoriaCampos.descricao,
            icone: categoriaCampos.icone,
            cor: categoriaCampos.cor,
          },
        },
      })
    }  
  }

  useEffect(() => {
    setTimeout(() => {
      if (categoria && atualizar) {
        setCategoriaCampos({
          titulo: categoria.titulo,
          descricao: categoria.descricao!,
          cor: categoria.cor!,
          icone: categoria.icone!,
        })
      } else {
        setCategoriaCampos(estadoInicial)
      }
    }, 0)
  }, [categoria, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-2">
          <DialogTitle>
            <Label className="text-xl font-semibold leading-tight text-gray-800">
              Nova categoria
            </Label>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="space-y-1">
            <FormField
              className="h-10"
              id="titulo"
              label="Título"
              placeholder="Ex.: Alimentação"
              value={categoriaCampos.titulo}
              onChange={(e) => setConteudo("titulo", e.target.value)}
              disabled={loading}
            />

          </div>
          <div className="space-y-1">
            <FormField
              className="h-10"
              id="description"
              label="Descrição"
              placeholder="Descrição da categoria"
              value={categoriaCampos.descricao}
              onChange={(e) => setConteudo("descricao",e.target.value)}
              disabled={loading}
              helper="Opcional"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="icone" className="text-sm font-normal">
              Ícone
            </Label>
            <div className="grid grid-cols-8 grid-rows-2 gap-2">
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 1
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",1)}
              >
                  <BriefcaseBusiness/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 2
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",2)}
                >
                  <CarFront/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 3
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",3)}
              >
                  <HeartPulse/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 4
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",4)}
              >
                  <PiggyBank/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 5
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",5)}
              >
                  <ShoppingCart/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 6
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",6)}
              >
                  <Ticket/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 7
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",7)}
              >
                  <Salad/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 8
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",8)}
              >
                  <Utensils/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 9
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",9)}
              >
                  <PawPrint/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 10
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",10)}
              >
                  <House/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 11
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",11)}
              >
                  <Gift/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 12
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",12)}
              >
                  <Dumbbell/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 13
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",13)}
              >
                  <BookOpen/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 14
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",14)}
              >
                  <BaggageClaim/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 15
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",15)}
              >
                  <Mailbox/>
              </Button>
              <Button type="button" className={`bg-white text-gray-800 border hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.icone === 16
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                }`}
                onClick={() => setConteudo("icone",16)}
              >
                  <ReceiptText/>
              </Button>
            </div>

          </div>
          <div className="space-y-1">
            <Label htmlFor="description" className="text-sm font-normal">
              Cor
            </Label>
            <div className="grid grid-cols-7 grid-rows-1 gap-2">
                <Button type="button" className={`flex items-center justify-items-center w-12 h-8 border border-gray-300 p-1 rounded-sm bg-white hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.cor === '#1F6F43'
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                  }`}
                  onClick={() => setConteudo("cor",'#1F6F43')}
                >
                    <div className="w-10 h-5 bg-brand-base rounded-[2px]"/>
                </Button>
                <Button type="button" className={`flex items-center justify-items-center w-12 h-8 border border-gray-300 p-1 rounded-sm bg-white hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.cor === '#2563EB'
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                  }`}
                  onClick={() => setConteudo("cor",'#2563EB')}
                >
                    <div className="w-10 h-5 bg-blue-base rounded-[2px]"/>
                </Button>
                <Button type="button" className={`flex items-center justify-items-center w-12 h-8 border border-gray-300 p-1 rounded-sm bg-white hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.cor === '#9333EA'
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                  }`}
                  onClick={() => setConteudo("cor",'#9333EA')}
                >
                    <div className="w-10 h-5 bg-purple-base rounded-[2px]"/>
                </Button>
                <Button type="button" className={`flex items-center justify-items-center w-12 h-8 border border-gray-300 p-1 rounded-sm bg-white hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.cor === '#DB2777'
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                  }`}
                  onClick={() => setConteudo("cor",'#DB2777')}
                >
                    <div className="w-10 h-5 bg-pink-base rounded-[2px]"/>
                </Button>
                <Button type="button" className={`flex items-center justify-items-center w-12 h-8 border border-gray-300 p-1 rounded-sm bg-white hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.cor === '#DC2626'
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                  }`}
                  onClick={() => setConteudo("cor",'#DC2626')}
                >
                    <div className="w-10 h-5 bg-red-base rounded-[2px]"/>
                </Button>
                <Button type="button" className={`flex items-center justify-items-center w-12 h-8 border border-gray-300 p-1 rounded-sm bg-white hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.cor === '#EA580C'
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                  }`}
                  onClick={() => setConteudo("cor",'#EA580C')}
                >
                    <div className="w-10 h-5 bg-orange-base rounded-[2px]"/>
                </Button>
                <Button type="button" className={`flex items-center justify-items-center w-12 h-8 border border-gray-300 p-1 rounded-sm bg-white hover:bg-gray-200 hover:cursor-pointer transition-all ${
                  categoriaCampos.cor === '#CA8A04'
                    ? "border-[#1F6F43] shadow-[0_0_0_2px_rgba(31,111,67,0.4)]"
                    : "border-gray-300"
                  }`}
                  onClick={() => setConteudo("cor",'#CA8A04')}
                >
                    <div className="w-10 h-5 bg-yellow-base rounded-[2px]"/>
                </Button>
            </div>
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
