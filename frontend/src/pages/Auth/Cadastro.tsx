import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "@/assets/logo.svg"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth"
import { toast } from "sonner"
import { LockIcon, LogIn, MailIcon, UserIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/ui/formField"

const schema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
})

type CadastroForm = z.infer<typeof schema>

export function Cadastro() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CadastroForm>({
    resolver: zodResolver(schema)
  })

  const signup = useAuthStore((state) => state.signup)
  const navigate = useNavigate()

  const onSubmit = async (formData: CadastroForm) => {
    try {
      const ok = await signup({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      })
      if (ok) {
        toast.success("Cadastro realizado com sucesso!")
        navigate('/')
      }
    } catch {
      toast("Não foi possível fazer o login!", {
        description: "Verifique se seu e-mail ou senha estão corretos.",
        classNames: {
          description: "!text-red-500 !font-bold"
        }
      })
    }
  }

  return (
    <div className="flex items-center min-h-[calc(100vh-4rem)] justify-center flex-col gap-6">
      <img src={logo} className="w-64 h-22" />
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
          <CardDescription>
            Informe seu nome, e-email e senha de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email"></Label>
              <div className="relative mt-2">
                <FormField
                  className="h-12 pl-10"
                  id="nome"
                  label="Nome completo"
                  placeholder="Seu nome"
                  icon={UserIcon}
                  error={errors.nome?.message}
                  {...register("nome")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative mt-2">
                <FormField
                  className="h-12 pl-10"
                  id="email"
                  label="E-mail"
                  type="email"
                  placeholder="mail@exemplo.com"
                  icon={MailIcon}
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col justify-start">
                <div className="mb-2">
                  <FormField
                    className="h-12 pl-10"
                    id="senha"
                    label="Senha"
                    type="password"
                    placeholder="Digite sua senha"
                    icon={LockIcon}
                    error={errors.email?.message}
                    {...register("senha")}
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-brand-base hover:bg-brand-dark hover:cursor-pointer" disabled={isSubmitting}>
              Cadastrar
            </Button>
            <div className="bg-gray-300 w-full h-[1px]"/>
            <CardTitle className="text-[14px] text-gray-600">
              Já tem uma conta?
            </CardTitle>
            <Button variant="outline" className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-200 hover:cursor-pointer" asChild>
              <Link to="/"> 
                <LogIn className="h-4 w-4" />
                Fazer login
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
