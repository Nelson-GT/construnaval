'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ship, Package, DollarSign, Users } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {

  interface DashboardData {
    barcosData: number
    inventarioMaterialesData: number
    ventasSalidasData: number
    trabajadoresData: number
  }

  const { data, error, isLoading } = useSWR<DashboardData>("/api/dashboard", fetcher)
  const barcosActivos = data?.barcosData ?? 0
  const totalMateriales = data?.inventarioMaterialesData ?? 0
  const totalVentas = data?.ventasSalidasData ?? 0
  const trabajadoresActivos = data?.trabajadoresData ?? 0

  if (error) return <div>Error al cargar datos</div>
  if (isLoading) return <div>Cargando dashboard...</div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance mb-2">Sistema de Gestión Naval</h1>
        <p className="text-muted-foreground text-lg">Bienvenido al sistema de gestión de Construnaval</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barcos Activos</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{barcosActivos}</div>
            <p className="text-xs text-muted-foreground">En producción</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMateriales}</div>
            <p className="text-xs text-muted-foreground">Materiales registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVentas}</div>
            <p className="text-xs text-muted-foreground">Salidas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trabajadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trabajadoresActivos}</div>
            <p className="text-xs text-muted-foreground">Personal activo</p>
          </CardContent>
        </Card>
      </div>

      {/* El resto de tus cards estáticas se mantienen igual */}
      <div className="grid gap-6 md:grid-cols-2">
         {/* ... (tu código de tarjetas de módulos sigue igual) ... */}
          <Card>
          <CardHeader>
            <CardTitle>Módulo de Producción</CardTitle>
            <CardDescription>Control completo de barcos en desguace</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Registra barcos, materiales consumidos (oxígeno, propano), materiales obtenidos y asigna trabajadores a
              cada proyecto.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Módulo de Ventas</CardTitle>
            <CardDescription>Gestión de salidas y guías de despacho</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Registra salidas de gandolas con información de materiales, compradores y destinos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Módulo de Inventario</CardTitle>
            <CardDescription>Control de stock de materiales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gestiona el inventario de consumibles (oxígeno, propano) y materiales de trabajo (guantes, EPIs, etc.).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Módulo de Trabajadores</CardTitle>
            <CardDescription>Gestión de personal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Administra información de trabajadores: cédula, contacto, salario y asignaciones a proyectos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}