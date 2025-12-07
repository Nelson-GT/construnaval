"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, X } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/loading-button"
import { SalesStatsPanel } from "@/components/sales-stats-panel"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function VentasPage() {
  const { data: ventas, error, mutate } = useSWR("/api/ventas", fetcher)
  const { data: materiales } = useSWR("/api/inventario", fetcher)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [editingVenta, setEditingVenta] = useState<any>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [selectedMateriales, setSelectedMateriales] = useState<
    Array<{ id_material: number; cantidad_material: number }>
  >([])

  const filteredVentas = ventas?.filter(
    (v: any) =>
      v.numero_guia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.nombre_comprador.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addMaterial = () => {
    setSelectedMateriales([...selectedMateriales, { id_material: 0, cantidad_material: 0 }])
  }

  const removeMaterial = (index: number) => {
    setSelectedMateriales(selectedMateriales.filter((_, i) => i !== index))
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = [...selectedMateriales]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedMateriales(updated)
  }

  const canSubmit = selectedMateriales.length > 0 && selectedMateriales.every((m) => m.id_material > 0)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!canSubmit) {
      alert("Debe añadir al menos un material con cantidad válida")
      return
    }

    setIsCreating(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        numero_guia: formData.get("numero_guia"),
        fecha_salida: formData.get("fecha_salida"),
        nombre_comprador: formData.get("nombre_comprador"),
        destino_ubicacion: formData.get("destino_ubicacion"),
        placa_gandola: formData.get("placa_gandola"),
        total: Number.parseFloat(formData.get("total") as string),
        materiales: selectedMateriales,
      }

      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        mutate()
        setIsNewOpen(false)
        setSelectedMateriales([])
      } else {
        const error = await response.json()
        alert(error.error || "Error al crear venta")
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingVenta) return

    if (!canSubmit) {
      alert("Debe añadir al menos un material con cantidad válida")
      return
    }

    setIsEditing(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        numero_guia: formData.get("numero_guia"),
        fecha_salida: formData.get("fecha_salida"),
        nombre_comprador: formData.get("nombre_comprador"),
        destino_ubicacion: formData.get("destino_ubicacion"),
        placa_gandola: formData.get("placa_gandola"),
        total: Number.parseFloat(formData.get("total") as string),
        materiales: selectedMateriales,
      }

      const response = await fetch(`/api/ventas/${editingVenta.id_salida}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        mutate()
        setIsEditOpen(false)
        setEditingVenta(null)
        setSelectedMateriales([])
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Salidas Registradas</h2>
        </div>
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger asChild>
            <LoadingButton size="lg" isLoading={isCreating} loadingText="Creando..." className="gap-2">
              <Plus className="h-5 w-5" />
              Nueva Salida
            </LoadingButton>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Salida</DialogTitle>
              <DialogDescription>Registra una nueva guía de despacho con uno o más materiales</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new_numero_guia">Número de Guía</Label>
                  <Input id="new_numero_guia" name="numero_guia" placeholder="GU-2025-001" required />
                </div>
                <div>
                  <Label htmlFor="new_fecha_salida">Fecha y Hora de Salida</Label>
                  <Input
                    id="new_fecha_salida"
                    name="fecha_salida"
                    type="datetime-local"
                    defaultValue={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="new_nombre_comprador">Comprador</Label>
                <Input
                  id="new_nombre_comprador"
                  name="nombre_comprador"
                  placeholder="Siderúrgica del Este C.A."
                  required
                />
              </div>

              <div>
                <Label htmlFor="new_destino_ubicacion">Destino</Label>
                <Input
                  id="new_destino_ubicacion"
                  name="destino_ubicacion"
                  placeholder="Zona Industrial, Valencia"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new_placa_gandola">Placa de Gandola</Label>
                  <Input id="new_placa_gandola" name="placa_gandola" placeholder="ABC-123" />
                </div>
                <div>
                  <Label htmlFor="new_total">Total ($)</Label>
                  <Input id="new_total" name="total" type="number" step="0.01" placeholder="0.00" required />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Materiales a Despachar</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addMaterial}>
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir Material
                  </Button>
                </div>

                <div className="space-y-3 border rounded-lg p-4">
                  {selectedMateriales.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-red-500 font-medium">
                      Mínimo debe haber un material para crear la venta
                    </p>
                  ) : (
                    selectedMateriales.map((item, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label className="text-xs">Material</Label>
                          <select
                            value={item.id_material}
                            onChange={(e) => updateMaterial(index, "id_material", Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                            required
                          >
                            <option value={0}>Seleccionar material</option>
                            {materiales?.map((m: any) => (
                              <option key={m.id_material} value={m.id_material}>
                                {m.nombre_material} ({m.unidad_medida})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">Cantidad</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.cantidad_material}
                            onChange={(e) =>
                              updateMaterial(index, "cantidad_material", Number.parseFloat(e.target.value))
                            }
                            placeholder="0"
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMaterial(index)}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <LoadingButton
                type="submit"
                isLoading={isCreating}
                loadingText="Creando..."
                className="w-full"
                disabled={!canSubmit}
              >
                Crear Salida
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Salidas de Gandolas</CardTitle>
              <CardDescription>Historial de despachos y guías de salida</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar salida..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Guía</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Comprador</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVentas?.map((venta: any) => (
                <TableRow key={venta.id_salida}>
                  <TableCell className="font-medium">{venta.numero_guia}</TableCell>
                  <TableCell>{new Date(venta.fecha_salida).toLocaleDateString()}</TableCell>
                  <TableCell>{venta.nombre_comprador}</TableCell>
                  <TableCell className="text-sm">{venta.destino_ubicacion}</TableCell>
                  <TableCell className="font-medium">
                    ${venta.total.toString()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog
                      open={isEditOpen && editingVenta?.id_salida === venta.id_salida}
                      onOpenChange={(open) => {
                        setIsEditOpen(open)
                        if (!open) {
                          setEditingVenta(null)
                          setSelectedMateriales([])
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingVenta(venta)
                            setIsEditOpen(true)
                            setSelectedMateriales(
                              venta.materiales.map((m: any) => ({
                                id_material: m.id_material,
                                cantidad_material: m.cantidad_material,
                              })),
                            )
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Salida</DialogTitle>
                          <DialogDescription>Modifica la información de la guía de despacho</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="numero_guia">Número de Guía</Label>
                              <Input
                                id="numero_guia"
                                name="numero_guia"
                                defaultValue={editingVenta?.numero_guia}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="fecha_salida">Fecha y Hora de Salida</Label>
                              <Input
                                id="fecha_salida"
                                name="fecha_salida"
                                type="datetime-local"
                                defaultValue={editingVenta?.fecha_salida?.slice(0, 16)}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="nombre_comprador">Comprador</Label>
                            <Input
                              id="nombre_comprador"
                              name="nombre_comprador"
                              defaultValue={editingVenta?.nombre_comprador}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="destino_ubicacion">Destino</Label>
                            <Input
                              id="destino_ubicacion"
                              name="destino_ubicacion"
                              defaultValue={editingVenta?.destino_ubicacion}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="placa_gandola">Placa de Gandola</Label>
                              <Input
                                id="placa_gandola"
                                name="placa_gandola"
                                defaultValue={editingVenta?.placa_gandola || ""}
                              />
                            </div>
                            <div>
                              <Label htmlFor="total">Total ($)</Label>
                              <Input
                                id="total"
                                name="total"
                                type="number"
                                step="0.01"
                                defaultValue={editingVenta?.total || 0}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <Label>Materiales a Despachar</Label>
                              <Button type="button" size="sm" variant="outline" onClick={addMaterial}>
                                <Plus className="h-4 w-4 mr-1" />
                                Añadir Material
                              </Button>
                            </div>

                            <div className="space-y-3 border rounded-lg p-4">
                              {selectedMateriales.map((item, index) => (
                                <div key={index} className="flex gap-2 items-end">
                                  <div className="flex-1">
                                    <Label className="text-xs">Material</Label>
                                    <select
                                      value={item.id_material}
                                      onChange={(e) => updateMaterial(index, "id_material", Number(e.target.value))}
                                      className="w-full px-2 py-1 border rounded text-sm"
                                      required
                                    >
                                      <option value={0}>Seleccionar material</option>
                                      {materiales?.map((m: any) => (
                                        <option key={m.id_material} value={m.id_material}>
                                          {m.nome_material} ({m.unidad_medida})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex-1">
                                    <Label className="text-xs">Cantidad</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={item.cantidad_material}
                                      onChange={(e) =>
                                        updateMaterial(index, "cantidad_material", Number.parseFloat(e.target.value))
                                      }
                                      placeholder="0"
                                      required
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeMaterial(index)}
                                    className="text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <LoadingButton
                            type="submit"
                            isLoading={isEditing}
                            loadingText="Guardando..."
                            className="w-full"
                            disabled={!canSubmit}
                          >
                            Guardar Cambios
                          </LoadingButton>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <LoadingButton
                      variant="ghost"
                      size="sm"
                      isLoading={isDeleting === venta.id_salida}
                      loadingText="..."
                      onClick={() => handleDelete(venta.id_salida)}
                    >
                      <X className="h-4 w-4" />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
