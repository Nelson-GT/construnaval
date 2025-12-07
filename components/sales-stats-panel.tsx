"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package, DollarSign, User } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SalesStatsPanel() {
  const { data: stats } = useSWR("/api/ventas/estadisticas", fetcher)

  const statCards = [
    {
      title: "Ventas (Último Mes)",
      value: stats?.ventasUltimoMes || 0,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Ingresos (Último Mes)",
      value: `$${(stats?.totalIngresos || 0).toString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Comprador Top (Último Mes)",
      value: stats?.compradorTop?.nombre_comprador || "N/A",
      icon: User,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      subtitle: `${stats?.compradorTop?.cantidad || 0} ventas`,
    },
    {
      title: "Material Más Vendido (Último Mes)",
      value: stats?.materialTop?.nombre_material || "N/A",
      icon: Package,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      subtitle: `${stats?.materialTop?.total_cantidad || 0} unidades`,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className={stat.bgColor}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
