"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil } from "lucide-react"
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function VentasPage() {
  const { data: ventas, error, mutate } = useSWR("/api/ventas", fetcher)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [editingVenta, setEditingVenta] = useState<any>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const filteredVentas = ventas?.filter(
    (v: any) =>
      v.numero_guia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.nombre_comprador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.nombre_material.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      numero_guia: formData.get("numero_guia"),
      fecha_salida: formData.get("fecha_salida"),
      nombre_material: formData.get("nombre_material"),
      cantidad_material: Number.parseFloat(formData.get("cantidad_material") as string),
      unidad_medida: formData.get("unidad_medida"),
      nombre_comprador: formData.get("nombre_comprador"),
      destino_ubicacion: formData.get("destino_ubicacion"),
      placa_gandola: formData.get("placa_gandola"),
    }

    await fetch("/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    mutate()
    setIsNewOpen(false)
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingVenta) return

    const formData = new FormData(e.currentTarget)
    const data = {
      numero_guia: formData.get("numero_guia"),
      fecha_salida: formData.get("fecha_salida"),
      nombre_material: formData.get("nombre_material"),
      cantidad_material: Number.parseFloat(formData.get("cantidad_material") as string),
      unidad_medida: formData.get("unidad_medida"),
      nombre_comprador: formData.get("nombre_comprador"),
      destino_ubicacion: formData.get("destino_ubicacion"),
      placa_gandola: formData.get("placa_gandola"),
    }

    await fetch(`/api/ventas/${editingVenta.id_salida}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    mutate()
    setIsEditOpen(false)
    setEditingVenta(null)
  }

  if (error) return <div className="p-8">Error al cargar los datos</div>
  if (!ventas) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance mb-2">Módulo de Ventas</h1>
          <p className="text-muted-foreground text-lg">Registro de salidas y guías de despacho</p>
        </div>
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nueva Salida
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nueva Salida</DialogTitle>
              <DialogDescription>Registra una nueva guía de despacho</DialogDescription>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new_nombre_material">Material</Label>
                  <Input id="new_nombre_material" name="nombre_material" placeholder="Acero Naval" required />
                </div>
                <div>
                  <Label htmlFor="new_cantidad_material">Cantidad</Label>
                  <Input
                    id="new_cantidad_material"
                    name="cantidad_material"
                    type="number"
                    step="0.01"
                    placeholder="5000"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="new_unidad_medida">Unidad de Medida</Label>
                <Input id="new_unidad_medida" name="unidad_medida" placeholder="Kg, Ton, m³" required />
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
              <div>
                <Label htmlFor="new_placa_gandola">Placa de Gandola</Label>
                <Input id="new_placa_gandola" name="placa_gandola" placeholder="ABC-123" />
              </div>
              <Button type="submit" className="w-full">
                Crear Salida
              </Button>
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
                <TableHead>Material</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Comprador</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVentas?.map((venta: any) => (
                <TableRow key={venta.id_salida}>
                  <TableCell className="font-medium">{venta.numero_guia}</TableCell>
                  <TableCell>{new Date(venta.fecha_salida).toLocaleString("es-VE")}</TableCell>
                  <TableCell>{venta.nombre_material}</TableCell>
                  <TableCell>
                    {venta.cantidad_material.toLocaleString()} {venta.unidad_medida}
                  </TableCell>
                  <TableCell>{venta.nombre_comprador}</TableCell>
                  <TableCell className="text-sm">{venta.destino_ubicacion}</TableCell>
                  <TableCell>{venta.placa_gandola || "N/A"}</TableCell>
                  <TableCell>
                    <Dialog
                      open={isEditOpen && editingVenta?.id_salida === venta.id_salida}
                      onOpenChange={setIsEditOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingVenta(venta)
                            setIsEditOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
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
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="nombre_material">Material</Label>
                              <Input
                                id="nombre_material"
                                name="nombre_material"
                                defaultValue={editingVenta?.nombre_material}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="cantidad_material">Cantidad</Label>
                              <Input
                                id="cantidad_material"
                                name="cantidad_material"
                                type="number"
                                step="0.01"
                                defaultValue={editingVenta?.cantidad_material}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="unidad_medida">Unidad de Medida</Label>
                            <Input
                              id="unidad_medida"
                              name="unidad_medida"
                              defaultValue={editingVenta?.unidad_medida}
                              required
                            />
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
                          <div>
                            <Label htmlFor="placa_gandola">Placa de Gandola</Label>
                            <Input
                              id="placa_gandola"
                              name="placa_gandola"
                              defaultValue={editingVenta?.placa_gandola || ""}
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Guardar Cambios
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
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
