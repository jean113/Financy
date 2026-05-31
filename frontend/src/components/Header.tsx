import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/auth"
import logo from "@/assets/logo.svg"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export function Header() {
  const { usuario, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const dashboard = location.pathname === "/dashboard"
  const transacao = location.pathname === "/transacao"
  const categoria = location.pathname === "/categoria"

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="w-full px-16 py-4 bg-white">
        <div className="flex justify-between w-full">
          <div className="min-w-48">
            <img src={logo} />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button
                size="sm"
                className={`gap-2 bg-white ${dashboard ? 'text-brand-base font-bold' : 'text-gray-600'}`}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/transacao">
              <Button
                size="sm"
                className={`gap-2 bg-white ${transacao ? 'text-brand-base font-bold' : 'text-gray-600'}`}
              >
                Transações
              </Button>
            </Link>
            <Link to="/categoria">
              <Button
                size="sm"
                className={`gap-2 bg-white ${categoria ? 'text-brand-base font-bold' : 'text-gray-600'}`}
              >
                Categorias
              </Button>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="after:hidden cursor-pointer">
                <AvatarFallback className="bg-gray-300 text-gray-800">
                  {usuario?.nome?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-xs text-gray-600">
                {usuario?.email}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-xs text-red-500 cursor-pointer ">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </div>
  )
}
