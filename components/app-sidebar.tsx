"use client"

import { useRouter } from "next/navigation"
import { Ship, Package, DollarSign, Users, LayoutDashboard, LogOut, User, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard,
    allowedRoles: ["admin", "produccion", "ventas"]
  },
  { name: "Producción", href: "/produccion", icon: Ship,
    allowedRoles: ["admin", "produccion"]
  },
  { name: "Inventario", href: "/inventario", icon: Package,
    allowedRoles: ["admin", "produccion", "ventas"]
  },
  { name: "Ventas", href: "/ventas", icon: DollarSign,
    allowedRoles: ["admin", "ventas"]
  },
  { name: "Trabajadores", href: "/trabajadores", icon: Users,
    allowedRoles: ["admin", "produccion"]
  },
]

export function AppSidebar({ user }: { user: any }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      // 2. Hacemos la petición a tu API de logout
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })
      if (res.ok) {
        router.refresh()
        router.push("/login")
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Ship className="h-8 w-8 text-sidebar-primary" />
        <span className="ml-3 text-xl font-bold text-sidebar-foreground">Construnaval</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          if (user && !item.allowedRoles.includes(user.rol)) {
            return null
          }
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
        {user && (
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full">
              <User className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-white">
                {user.username}
              </span>
              <span className="truncate text-xs text-muted-foreground capitalize flex items-center gap-1 ">
                <Shield className="h-3 w-3" />
                {user.rol}
              </span>
            </div>
          </div>
        )}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground cursor-pointer"
          )}
        >
          <LogOut className="h-5 w-5" /> 
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
