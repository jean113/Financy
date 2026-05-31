import logo from "@/assets/logo.svg"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/store/auth"
import { toast } from "sonner"
import { LockIcon, MailIcon, UserRoundPlus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field } from "@/components/ui/field"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/ui/formField"
import { useEffect } from "react"

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  lembrarMe: z.boolean().default(false)
})

type LoginForm = z.infer<typeof schema>


export function Login() {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { lembrarMe: false }
  })

  const login = useAuthStore((state) => state.login)

  const onSubmit = async (formData: LoginForm) => {
    if (formData.lembrarMe) {
      localStorage.setItem('lembrarMe', 'true')
    } else {
      localStorage.removeItem('lembrarMe')
    }

    try {
      const ok = await login({ email: formData.email, senha: formData.senha })
      if (ok) {
        window.location.href = '/'
      }
    } catch {
      toast("Não foi possível fazer o login!", {
        description: "Verifique se seu e-mail ou senha estão corretos.",
        classNames: {
          description: "!text-red-500 !font-bold"
        }})
    }
  }

  useEffect(() => {
    setValue("email", "")
    setValue("senha", "")
  }, [])

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-6 p-8">
      <img src={logo} className="w-64 h-22" />
      <Card className="w-full max-w-md rounded-xl mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Fazer login
          </CardTitle>
          <CardDescription>
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
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
            <div>
               <FormField
                  className="h-12 pl-10"
                  id="senha"
                  label="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  icon={LockIcon}
                  error={errors.senha?.message} 
                  {...register("senha")}
                />
            </div>
            <div className="flex justify-between">
              <Field orientation="horizontal">
                <Checkbox 
                  id="lembrarme" 
                  checked={watch("lembrarMe")}
                  onCheckedChange={(e) => setValue("lembrarMe", !!e)} 
                />
                <Label htmlFor="lembrarme">Lembrar-me?</Label>
              </Field>
              <Link to="/recuperar-senha" className="text-brand-base text-sm">
                Recuperar Senha
              </Link>
            </div>
            <Button type="submit" className="w-full h-12 bg-brand-base hover:bg-brand-dark hover:cursor-pointer" disabled={isSubmitting}>
              Entrar
            </Button>
            <div className="bg-gray-300 w-full h-[1px]"/>
            <CardTitle className="text-[14px] text-gray-600">
              Ainda não tem uma conta?
            </CardTitle>
            <Button variant="outline" className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-200 hover:cursor-pointer" asChild>
              <Link to="/cadastro"> 
                <UserRoundPlus className="h-4 w-4" />
                Criar conta 
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
