"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, AlertTriangle, Search, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingButton } from "@/components/loading-button"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function InventarioPage() {
  const { data: materiales, error, mutate } = useSWR("/api/inventario", fetcher)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<any>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const filteredMateriales = materiales?.filter((m: any) =>
    m.nombre_material.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const consumibles = filteredMateriales?.filter((m: any) => m.tipo_material === "Consumible Producción")
  const epis = filteredMateriales?.filter((m: any) => m.tipo_material === "EPI")

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        nombre_material: formData.get("nombre_material"),
        tipo_material: formData.get("tipo_material"),
        unidad_medida: formData.get("unidad_medida"),
        stock_actual: Number.parseFloat(formData.get("stock_actual") as string),
        stock_minimo: Number.parseFloat(formData.get("stock_minimo") as string),
      }

      const response = await fetch("/api/inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        mutate()
        setIsNewOpen(false)
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingMaterial) return

    setIsEditing(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        nombre_material: formData.get("nombre_material"),
        tipo_material: formData.get("tipo_material"),
        unidad_medida: formData.get("unidad_medida"),
        stock_actual: Number.parseFloat(formData.get("stock_actual") as string),
        stock_minimo: Number.parseFloat(formData.get("stock_minimo") as string),
      }

      const response = await fetch(`/api/inventario/${editingMaterial.id_material}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        mutate()
        setIsEditOpen(false)
        setEditingMaterial(null)
      }
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/inventario/${id}`, {
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
  if (!materiales) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance mb-2">Módulo de Inventario</h1>
          <p className="text-muted-foreground text-lg">Control de stock de materiales y consumibles</p>
        </div>
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger asChild>
            <LoadingButton size="lg" isLoading={isCreating} loadingText="Creando..." className="gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Material
            </LoadingButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Material</DialogTitle>
              <DialogDescription>Registra un nuevo material en el inventario</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="new_nombre_material">Nombre del Material</Label>
                <Input id="new_nombre_material" name="nombre_material" placeholder="Oxígeno Industrial" required />
              </div>
              <div>
                <Label htmlFor="new_tipo_material">Tipo de Material</Label>
                <Select name="tipo_material" defaultValue="Consumible Producción">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consumible Producción">Consumible Producción</SelectItem>
                    <SelectItem value="EPI">EPI</SelectItem>
                    <SelectItem value="Suministro">Suministro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new_unidad_medida">Unidad de Medida</Label>
                <Input id="new_unidad_medida" name="unidad_medida" placeholder="m³, L, Kg, Unidad" required />
              </div>
              <div>
                <Label htmlFor="new_stock_actual">Stock Actual</Label>
                <Input id="new_stock_actual" name="stock_actual" type="number" step="0.01" defaultValue="0" required />
              </div>
              <div>
                <Label htmlFor="new_stock_minimo">Stock Mínimo</Label>
                <Input id="new_stock_minimo" name="stock_minimo" type="number" step="0.01" defaultValue="10" required />
              </div>
              <LoadingButton type="submit" isLoading={isCreating} loadingText="Creando..." className="w-full">
                Crear Material
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Consumibles de Producción</CardTitle>
            <CardDescription>Oxígeno, propano y gases industriales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consumibles?.map((material: any) => (
                <div key={material.id_material} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{material.nombre_material}</p>
                    <p className="text-sm text-muted-foreground">{material.unidad_medida}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{material.stock_actual.toString()}</p>
                    {Number(material.stock_actual) <= Number(material.stock_minimo) && (
                      <Badge variant="destructive" className="gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        Bajo
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipos y Suministros</CardTitle>
            <CardDescription>EPIs, herramientas y materiales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {epis?.map((material: any) => (
                <div key={material.id_material} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{material.nombre_material}</p>
                    <p className="text-sm text-muted-foreground">{material.unidad_medida}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{material.stock_actual.toString()}</p>
                    {Number(material.stock_actual) <= Number(material.stock_minimo) && (
                      <Badge variant="destructive" className="gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        Bajo
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todos los Materiales</CardTitle>
              <CardDescription>Inventario completo de materiales disponibles</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar material..."
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
                <TableHead>Material</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Stock Mínimo</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMateriales?.map((material: any) => (
                <TableRow key={material.id_material}>
                  <TableCell className="font-medium">{material.nombre_material}</TableCell>
                  <TableCell>{material.tipo_material}</TableCell>
                  <TableCell className="font-bold">{material.stock_actual.toString()}</TableCell>
                  <TableCell>{material.stock_minimo.toString()}</TableCell>
                  <TableCell>{material.unidad_medida}</TableCell>
                  <TableCell>
                    {Number(material.stock_actual) <= Number(material.stock_minimo) ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Stock Bajo
                      </Badge>
                    ) : (
                      <Badge variant="default">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog
                      open={isEditOpen && editingMaterial?.id_material === material.id_material}
                      onOpenChange={setIsEditOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingMaterial(material)
                            setIsEditOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Material</DialogTitle>
                          <DialogDescription>Modifica la información del material</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                          <div>
                            <Label htmlFor="nombre_material">Nombre del Material</Label>
                            <Input
                              id="nombre_material"
                              name="nombre_material"
                              defaultValue={editingMaterial?.nombre_material}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="tipo_material">Tipo de Material</Label>
                            <Select name="tipo_material" defaultValue={editingMaterial?.tipo_material}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Consumible Producción">Consumible Producción</SelectItem>
                                <SelectItem value="EPI">EPI</SelectItem>
                                <SelectItem value="Suministro">Suministro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="unidad_medida">Unidad de Medida</Label>
                            <Input
                              id="unidad_medida"
                              name="unidad_medida"
                              defaultValue={editingMaterial?.unidad_medida}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="stock_actual">Stock Actual</Label>
                            <Input
                              id="stock_actual"
                              name="stock_actual"
                              type="number"
                              step="0.01"
                              defaultValue={editingMaterial?.stock_actual}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="stock_minimo">Stock Mínimo</Label>
                            <Input
                              id="stock_minimo"
                              name="stock_minimo"
                              type="number"
                              step="0.01"
                              defaultValue={editingMaterial?.stock_minimo}
                              required
                            />
                          </div>
                          <LoadingButton
                            type="submit"
                            isLoading={isEditing}
                            loadingText="Guardando..."
                            className="w-full"
                          >
                            Guardar Cambios
                          </LoadingButton>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <LoadingButton
                      variant="ghost"
                      size="sm"
                      isLoading={isDeleting === material.id_material}
                      loadingText="..."
                      onClick={() => handleDelete(material.id_material)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
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
