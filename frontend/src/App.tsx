import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Auth/Login'
import { Layout } from './components/Layout'
import { useAuthStore } from './store/auth'
import { Cadastro } from './pages/Auth/Cadastro'
import { CategoriasPagina } from './pages/Categoria'
import { TransacoesPagina } from './pages/Transacao'
import { Dashboard } from './pages/Dashboard'
import { RecuperarSenha } from './pages/Auth/RecuperarSenha'
import { Toaster } from 'sonner'

function RootRoute() {
  const { estaAutenticado } = useAuthStore()
  return estaAutenticado ? <Layout><Dashboard /></Layout> : <Login />
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { estaAutenticado } = useAuthStore()
  return estaAutenticado ? <>{children}</> : <Navigate to="/" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { estaAutenticado } = useAuthStore()
  return !estaAutenticado ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<RootRoute />} />
      <Route path='/cadastro' element={
        <PublicRoute>
          <Cadastro />
        </PublicRoute>
      }/>
      <Route path='/recuperar-senha' element={
        <PublicRoute>
          <RecuperarSenha />
        </PublicRoute>
      }/>
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      }/>
      <Route path='/categoria' element={
        <ProtectedRoute>
          <Layout><CategoriasPagina /></Layout>
        </ProtectedRoute>
      }/>
      <Route path='/transacao' element={
        <ProtectedRoute>
          <Layout><TransacoesPagina /></Layout>
        </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default App
