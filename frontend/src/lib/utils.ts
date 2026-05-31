import { clsx, type ClassValue } from "clsx"
import { BaggageClaim, BookOpen, 
  BriefcaseBusiness, CarFront, 
  Dumbbell, Gift, HeartPulse, House, 
  Mailbox, PawPrint, PiggyBank,  ReceiptText, 
  Salad,  ShoppingCart, Ticket, Utensils, 
  type LucideIcon} from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) 
{
  return twMerge(clsx(inputs))
}

// export function formatRelativeDate(date: Date | string): string 
// {
//   const now = new Date()
//   const past = new Date(date)
//   const diffInMs = now.getTime() - past.getTime()
//   const diffInSeconds = Math.floor(diffInMs / 1000)
//   const diffInMinutes = Math.floor(diffInSeconds / 60)
//   const diffInHours = Math.floor(diffInMinutes / 60)
//   const diffInDays = Math.floor(diffInHours / 24)

//   if (diffInSeconds < 60) 
//   {
//     return "Agora"
//   }

//   if (diffInMinutes < 60)
//   {
//     return `Há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`
//   }

//   if (diffInHours < 24) 
//   {
//     return `Há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`
//   }

//   if (diffInDays === 1) 
//   {
//     return "Ontem"
//   }

//   return `Há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`
// }

export function formatarData(data: Date | string): string {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

const ICONES: Record<number, LucideIcon> = 
{
  1: BriefcaseBusiness,
  2: CarFront,
  3: HeartPulse,
  4: PiggyBank,
  5: ShoppingCart,
  6: Ticket,
  7: Salad,
  8: Utensils,
  9: PawPrint,
  10: House,
  11: Gift,
  12: Dumbbell,
  13: BookOpen,
  14: BaggageClaim,
  15: Mailbox,
  16: ReceiptText,
}

export function recuperarIconeCategoria(icone: number): LucideIcon 
{
  return ICONES[icone];
}
