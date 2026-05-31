import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { apolloClient } from "@/lib/graphql/apollo"
import { ALTERAR_SENHA } from "@/lib/graphql/mutations/AlterarSenha"
import { VERIFICAR_EMAIL } from "@/lib/graphql/queries/VerificarSenha"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/ui/formField"

const schemaEmail = z.object({
  email: z.string().email("E-mail inválido"),
})

const schemaSenha = z.object({
  novaSenha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
})

type EmailForm = z.infer<typeof schemaEmail>
type SenhaForm = z.infer<typeof schemaSenha>

export function RecuperarSenha() {
  const [etapa, setEtapa] = useState<"email" | "senha">("email")
  const [emailConfirmado, setEmailConfirmado] = useState("")
  const navigate = useNavigate()

  const formEmail = useForm<EmailForm>({
    resolver: zodResolver(schemaEmail)
  })

  const formSenha = useForm<SenhaForm>({
    resolver: zodResolver(schemaSenha)
  })

  const onSubmitEmail = async (data: EmailForm) => {
    try {
      const { data: resultado } = await apolloClient.query<{ verificarEmail: boolean }>({
        query: VERIFICAR_EMAIL,
        variables: { email: data.email }
      })
      if (resultado?.verificarEmail) {
        setEmailConfirmado(data.email)
        formSenha.reset()
        setEtapa("senha")
      } else {
        toast.error("E-mail não encontrado")
      }
    } catch {
      toast.error("Erro ao verificar e-mail")
    }
  }

  const onSubmitSenha = async (data: SenhaForm) => {
    try {
      await apolloClient.mutate({
        mutation: ALTERAR_SENHA,
        variables: { email: emailConfirmado, novaSenha: data.novaSenha }
      })
      toast.success("Senha alterada com sucesso!")
      navigate('/')
    } catch {
      toast.error("Erro ao alterar a senha")
    }
  }

  useEffect(() => {
    if (etapa === "senha") {
      formSenha.setValue("novaSenha", "")
    }
  }, [etapa])

  if (etapa === "senha") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Nova senha</CardTitle>
            <CardDescription>Digite sua nova senha</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formSenha.handleSubmit(onSubmitSenha)} autoComplete="off" className="space-y-4">
              <div>
            
              <FormField
                className="h-12 mt-2"
                id="novaSenha"
                label="Nova senha"
                type="password"
                placeholder="Digite sua nova senha"
                autoComplete="new-password"
                error={formSenha.formState.errors.novaSenha?.message}
                {...formSenha.register("novaSenha")}
              />

              </div>
              <Button type="submit" className="w-full h-12 bg-brand-base hover:bg-brand-dark hover:cursor-pointer" disabled={formSenha.formState.isSubmitting}>
                Salvar nova senha
              </Button>
              <Button variant="outline" className="w-full h-12 border-gray-300 hover:bg-gray-200 hover:cursor-pointer" asChild>
                <Link to="/">Voltar ao login</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
          <CardDescription>Digite seu e-mail cadastrado</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formEmail.handleSubmit(onSubmitEmail)} className="space-y-4">
            <div>
              <FormField
                className="h-12 mt-2"
                id="email"
                label="E-mail"
                type="email"
                placeholder="Digite seu email"
                error={formEmail.formState.errors.email?.message}
                {...formEmail.register("email")}
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-brand-base hover:bg-brand-dark hover:cursor-pointer" disabled={formEmail.formState.isSubmitting}>
              Continuar
            </Button>
            <Button variant="outline" className="border-gray-300 w-full h-12 hover:bg-gray-200 hover:cursor-pointer" asChild>
              <Link to="/">Voltar</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
