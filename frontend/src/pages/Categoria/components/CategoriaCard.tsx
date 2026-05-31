import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Categoria } from "@/types"
import { recuperarIconeCategoria } from "@/lib/utils"
import { Edit, Trash, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createElement, useState } from "react"
import { useMutation } from "@apollo/client/react"
import { EXCLUIR_CATEGORIA } from "@/lib/graphql/mutations/Categoria"
import { toast } from "sonner"
import { CriarCategoriaDialog } from "./CriarCategoriaDialog"
import { LISTAR_CATEGORIA_COM_TOTAIS, TOTAL_CATEGORIA, CATEGORIA_MAIS_USADA } from "@/lib/graphql/queries/Categoria"

interface CategoriaCardProps {
  categoria: Categoria
}

export function CategoriaCard({ categoria }: CategoriaCardProps) {
  const [openDialog, setOpenDialog] = useState(false)

  const [excluirCategoria] = useMutation(EXCLUIR_CATEGORIA, {
    onCompleted() {
      toast.success("Categoria excluída com sucesso")
    },
    onError(error) {
      toast.error(error.message ?? "Falha ao excluir a categoria")
    },
    refetchQueries: [
      { query: LISTAR_CATEGORIA_COM_TOTAIS },
      { query: TOTAL_CATEGORIA },
      { query: CATEGORIA_MAIS_USADA },
    ]
  })

  const onExcluir = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()

    toast("Deseja excluir esta categoria?", {
      description: "Esta ação não pode ser desfeita.",
      classNames: {
        description: "!text-red-500 !font-bold"
      },
      action: {
        label: "Sim, excluir",
        onClick: () => excluirCategoria({ variables: { id } }),
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    })
  }

  return (
    <Card
      key={categoria.id}
      className="hover:shadow-lg transition-shadow"
    >
      <CardHeader>
        <div className="flex justify-between">
          <div className="w-8 h-8 flex items-center justify-center rounded-sm"
            style={{
              color: categoria.cor,
              backgroundColor: `${categoria.cor}1A`
            }}
          >
            {
              createElement(recuperarIconeCategoria(categoria.icone!), {
              className: "h-4 w-4",
              style: { color: categoria.cor }
            })}
          </div>
          <div className="flex">
            <Button type="button" className="hover:bg-gray-200 border border-gray-300 w-8 h-8 flex items-center justify-center bg-white mr-2 hover:cursor-pointer"
              onClick={(e) => onExcluir(e, categoria.id)}
            >
              <Trash className="text-danger h-4 w-4" />
            </Button>
            <Button type="button" className="hover:bg-gray-200 border border-gray-300 w-8 h-8 flex items-center justify-center bg-white hover:cursor-pointer"
              onClick={() => setOpenDialog(true)}
            >
              <Edit className="h-4 w-4 text-gray-900"/>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-left">

          <div className="text-[16px] font-semibold text-gray-800">
            {categoria.titulo}
          </div>
          <p className="text-sm text-gray-600">
            {categoria.descricao || ""}
          </p>
        </div>
        <div className="flex items-center justify-between pt-6">
          <span className="text-sm font-medium text-blue-base p-1 rounded-xl h-7"
             style={{
              color: categoria.cor,
              backgroundColor: `${categoria.cor}1A`
            }}
          >
            {categoria.titulo}
          </span>
          <span className="text-sm text-gray-600">{categoria._count?.Transacao} itens</span>
        </div>
      </CardContent>
      <CriarCategoriaDialog open={openDialog} categoria={categoria} atualizar={true} onOpenChange={setOpenDialog} onCreated={() => setOpenDialog(false)} />
    </Card>
  )
}
