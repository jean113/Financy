import { Page } from "../../components/Page"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Plus, Tag, ArrowUpDown, Utensils } from "lucide-react"
import { CriarCategoriaDialog } from "./components/CriarCategoriaDialog"
import { createElement, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { CATEGORIA_MAIS_USADA, LISTAR_CATEGORIA_COM_TOTAIS, LISTAR_CATEGORIAS, TOTAL_CATEGORIA } from "../../lib/graphql/queries/Categoria"
import type { Categoria } from "../../types/index"
import { CategoriaCard } from "./components/CategoriaCard"
import { recuperarIconeCategoria } from "@/lib/utils"
import { TOTAL_TRANSACAO } from "@/lib/graphql/queries/Transacao"

export function CategoriasPagina() {
  const [openDialog, setOpenDialog] = useState(false)
  const { data, loading, refetch } = useQuery<{ listarCategorias: Categoria[] }>(LISTAR_CATEGORIA_COM_TOTAIS)

  const { data: dataTotalCategoria } = useQuery(TOTAL_CATEGORIA);

  const { data: dataCategoriaMaisUsada } = useQuery(CATEGORIA_MAIS_USADA);

  const { data: dataTotalTransacao } = useQuery(TOTAL_TRANSACAO);

  const categorias = data?.listarCategoriaComTotais ?? []

  return (
    <Page>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-col items-center justify-between">
            <Label className="text-3xl font-bold">Categorias</Label>
            <Label className="text-[16px] text-gray-600">Organize suas transações por categorias</Label>
          </div>
          <Button className="bg-brand-base hover:bg-brand-dark hover:cursor-pointer" onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        </div>
      </div>
      <div className="grid gap-3 grid-cols-3 pt-6">
          <div className="flex flex-col items-start  rounded-xl bg-white p-5">
            <div className="flex mb-2">
              <Tag className="mr-2 h-4 w-4" />
              <Label className="text-[32px] font-bold text-gray-800 mb-2">{dataTotalCategoria?.totalCategoria}</Label>
            </div>
            <div>
              <Label className="text-[12px] font-medium text-gray-600 ml-6">TOTAL DE CATEGORIAS</Label>
            </div>
          </div>
          <div className="flex flex-col items-start  rounded-xl bg-white p-5">
            <div className="flex mb-2">
              <ArrowUpDown className="text-purple-base mr-2 h-4 w-4" />
              <Label className="text-[32px] font-bold text-gray-800 mb-2">{dataTotalTransacao?.totalTransacao}</Label>
            </div>
            <div>
              <Label className="text-[12px] font-medium text-gray-600 ml-6">TOTAL DE TRANSAÇÕES</Label>
            </div>
          </div>
          <div className="flex flex-col items-start  rounded-xl bg-white p-5">
            <div className="flex mb-2">
               {dataCategoriaMaisUsada?.categoriaMaisUsada && (
                <>
                  {createElement(recuperarIconeCategoria(dataCategoriaMaisUsada.categoriaMaisUsada.icone), {
                    className: "h-4 w-4 mr-2",
                    style: { color: dataCategoriaMaisUsada.categoriaMaisUsada.cor }
                  })}
                  <Label className="text-[32px] font-bold text-gray-800 mb-2">
                    {dataCategoriaMaisUsada.categoriaMaisUsada.titulo}
                  </Label>
                </>
              )}
            </div>
            <div>
              <Label className="text-[12px] font-medium text-gray-600 ml-6">CATEGORIA MAIS UTILIZADA</Label>
            </div>
          </div>
      </div>
  
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-6">
         {!loading && categorias.length === 0 && (
          <div className="col-span-4 flex items-center justify-center py-10">
            <span className="text-gray-500 text-sm">Nenhuma categoria encontrada</span>
          </div>
        )}

        {!loading && categorias.map((categoria) => (
          <CategoriaCard
            key={categoria.id}
            categoria={categoria}
          />
        ))}
      </div>
      <CriarCategoriaDialog open={openDialog} atualizar={false} onOpenChange={setOpenDialog} onCreated={() => refetch()} />
    </Page>
  )
}
