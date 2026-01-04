"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSWR from "swr"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoadingButton } from "@/components/loading-button"
import { SalesStatsPanel } from "@/components/sales-stats-panel"
import { SalesFilterBar } from "@/components/sales-filter-bar"
import { SalesFormGuide } from "@/components/sales-form-guide"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Filters {
  dateFrom?: string
  dateTo?: string
  buyerName?: string
  destination?: string
  totalFrom?: number
  totalTo?: number
  guideNumber?: string
}

export default function VentasPage() {
  const { data: ventas, error, mutate } = useSWR("/api/ventas", fetcher)
  const { data: materiales } = useSWR("/api/inventario", fetcher)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [editingVenta, setEditingVenta] = useState<any>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [filters, setFilters] = useState<Filters>({})

  const filteredVentas = ventas?.filter((v: any) => {
    if (filters.guideNumber && !v.numero_guia.toLowerCase().includes(filters.guideNumber.toLowerCase())) return false
    if (filters.buyerName && !v.nombre_comprador.toLowerCase().includes(filters.buyerName.toLowerCase())) return false
    if (filters.destination && !v.destino_ubicacion.toLowerCase().includes(filters.destination.toLowerCase()))
      return false
    if (filters.dateFrom && new Date(v.fecha_salida) < new Date(filters.dateFrom)) return false
    if (filters.dateTo && new Date(v.fecha_salida) > new Date(filters.dateTo)) return false
    if (filters.totalFrom && v.total < filters.totalFrom) return false
    if (filters.totalTo && v.total > filters.totalTo) return false
    return true
  })

  const handleCreate = async (data: any) => {
    setIsCreating(true)
    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        mutate()
        setIsNewOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || "Error al crear venta")
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = async (data: any) => {
    if (!editingVenta) return

    setIsEditing(true)
    try {
      const response = await fetch(`/api/ventas/${editingVenta.id_salida}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        mutate()
        setIsEditOpen(false)
        setEditingVenta(null)
      } else {
        const error = await response.json()
        alert(error.error || "Error al actualizar venta")
      }
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/ventas/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        mutate()
      }
    } finally {
      setIsDeleting(null)
    }
  }

  if (error) return <div className="p-8">Error al cargar los datos</div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance mb-2">Módulo de Ventas</h1>
        <p className="text-muted-foreground text-lg">Registro de salidas y guías de despacho</p>
      </div>

      <SalesStatsPanel />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Salidas Registradas</h2>
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger asChild>
            <LoadingButton size="lg" isLoading={isCreating} loadingText="Creando..." className="gap-2">
              <Plus className="h-5 w-5" />
              Nueva Salida
            </LoadingButton>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Guía de Traslado</DialogTitle>
              <DialogDescription>
                Registra una nueva salida de materiales con todos los detalles requeridos
              </DialogDescription>
            </DialogHeader>
            <SalesFormGuide materiales={materiales || []} onSubmit={handleCreate} isLoading={isCreating} />
          </DialogContent>
        </Dialog>
      </div>

      <SalesFilterBar onFilter={setFilters} onClear={() => setFilters({})} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Salidas</CardTitle>
          <CardDescription>Total: {filteredVentas?.length || 0} salida(s) registrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guía</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Modo</TableHead>
                  <TableHead>Total ($)</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentas?.map((venta: any) => (
                  <TableRow key={venta.id_salida}>
                    <TableCell className="font-mono text-sm">{venta.numero_guia}</TableCell>
                    <TableCell>{new Date(venta.fecha_salida).toLocaleDateString("es-VE")}</TableCell>
                    <TableCell>{venta.nombre_comprador}</TableCell>
                    <TableCell className="text-sm">{venta.destino_ubicacion}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          venta.modo_venta === "From Inventory"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {venta.modo_venta === "From Inventory" ? "Inventario" : "Directa"}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">${Number(venta.total).toFixed(2)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog
                        open={isEditOpen && editingVenta?.id_salida === venta.id_salida}
                        onOpenChange={setIsEditOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log(venta)
                              setEditingVenta(venta)
                              setIsEditOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Editar Guía de Traslado</DialogTitle>
                            <DialogDescription>Modifica los detalles de la salida</DialogDescription>
                          </DialogHeader>
                          <SalesFormGuide
                            materiales={materiales || []}
                            onSubmit={handleEdit}
                            isLoading={isEditing}
                            initialData={editingVenta}
                          />
                        </DialogContent>
                      </Dialog>
                      <LoadingButton
                        variant="ghost"
                        size="sm"
                        isLoading={isDeleting === venta.id_salida}
                        loadingText="..."
                        onClick={() => handleDelete(venta.id_salida)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
