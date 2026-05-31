import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { apolloClient } from "@/lib/graphql/apollo"
import type { LoginInput, RegistroInput, Usuario } from '@/types'
import { REGISTRO } from '@/lib/graphql/mutations/Registro'
import { LOGIN } from '../lib/graphql/mutations/Login'

type RegistroMutationData = {
  registro: {
    token: string
    refreshToken: string
    usuario: Usuario
  }
}

type LoginMutationData = {
  login: {
    token: string
    refreshToken: string
    usuario: Usuario
  }
}

interface AuthState {
  usuario: Usuario | null
  token: string | null
  estaAutenticado: boolean
  signup: (data: RegistroInput) => Promise<boolean>
  login: (data: LoginInput) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>() (
    persist(
      (set) => ({
        usuario: null,
        token: null,
        estaAutenticado: false,
        login: async (loginData: LoginInput) => {
          const {data} = await apolloClient.mutate<LoginMutationData, { data: LoginInput }>({
            mutation: LOGIN,
            variables: {
              data: {
                email: loginData.email,
                senha: loginData.senha
              }
            }
          })

          if(data?.login){
            const { usuario, token } = data.login
            set({
              usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                criadoEm: usuario.criadoEm,
                atualizadoEm: usuario.atualizadoEm
              },
              token,
              estaAutenticado: true
            })
            return true
          }
          return false
        },
        signup: async (registroData: RegistroInput) => {
          const { data } = await apolloClient.mutate<
          RegistroMutationData,
            {data: RegistroInput}
          >({
            mutation: REGISTRO,
            variables: {
              data: {
                  nome: registroData.nome,
                  email: registroData.email,
                  senha: registroData.senha
              }
            }
          })
          if(data?.registro){
            const { token, usuario } = data.registro
            set({
              usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                criadoEm: usuario.criadoEm,
                atualizadoEm: usuario.atualizadoEm
              },
              token,
              estaAutenticado: true
            })
            return true
          }
          return false
        },
        logout: () => {
          set({
            usuario:null,
            token: null,
            estaAutenticado: false
          })
          localStorage.removeItem('lembrarMe')
          apolloClient.clearStore()
        },
      }),
      {
        name: 'auth-storage',
         storage: createJSONStorage(() => 
          localStorage.getItem('lembrarMe') === 'true' ? localStorage : sessionStorage
        )
      }
    )
)
