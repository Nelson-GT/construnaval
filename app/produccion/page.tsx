"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import { useState } from "react"
import Link from "next/link"
import type { Barco } from "@/lib/mock-data"
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

export default function ProduccionPage() {
  const { data: barcos, error, mutate } = useSWR<Barco[]>("/api/barcos", fetcher)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingBarco, setEditingBarco] = useState<Barco | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const filteredBarcos = barcos?.filter(
    (barco) =>
      barco.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barco.codigo_humano.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        codigo_humano: formData.get("codigo_humano"),
        nombre: formData.get("nombre"),
        fecha_ingreso: formData.get("fecha_ingreso"),
        tonelaje_inicial: Number.parseFloat(formData.get("tonelaje_inicial") as string),
        estado: formData.get("estado"),
      }

      const response = await fetch("/api/barcos", {
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
    if (!editingBarco) return

    setIsEditing(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        codigo_humano: formData.get("codigo_humano"),
        nombre: formData.get("nombre"),
        fecha_ingreso: formData.get("fecha_ingreso"),
        tonelaje_inicial: Number.parseFloat(formData.get("tonelaje_inicial") as string),
        estado: formData.get("estado"),
      }

      const response = await fetch(`/api/barcos/${editingBarco.id_barco}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        mutate()
        setIsEditOpen(false)
        setEditingBarco(null)
      }
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/barcos/${id}`, {
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
  if (!barcos) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance mb-2">Módulo de Producción</h1>
          <p className="text-muted-foreground text-lg">Control de barcos y proyectos de desguace</p>
        </div>
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger asChild>
            <LoadingButton size="lg" isLoading={isCreating} loadingText="Creando..." className="gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Barco
            </LoadingButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Barco</DialogTitle>
              <DialogDescription>Registra un nuevo barco en el sistema</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="new_codigo_humano">Código</Label>
                <Input id="new_codigo_humano" name="codigo_humano" placeholder="BRC-001" required />
              </div>
              <div>
                <Label htmlFor="new_nombre">Nombre del Barco</Label>
                <Input id="new_nombre" name="nombre" placeholder="Carguero Atlántico" required />
              </div>
              <div>
                <Label htmlFor="new_fecha_ingreso">Fecha de Ingreso</Label>
                <Input
                  id="new_fecha_ingreso"
                  name="fecha_ingreso"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="new_tonelaje_inicial">Tonelaje Inicial (Ton)</Label>
                <Input id="new_tonelaje_inicial" name="tonelaje_inicial" type="number" step="0.01" placeholder="5000" />
              </div>
              <div>
                <Label htmlFor="new_estado">Estado</Label>
                <Select name="estado" defaultValue="Activo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Desguazado">Desguazado</SelectItem>
                    <SelectItem value="Pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <LoadingButton type="submit" isLoading={isCreating} loadingText="Creando..." className="w-full">
                Crear Barco
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Barcos en Producción</CardTitle>
              <CardDescription>Lista de todos los barcos registrados en el sistema</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar barco..."
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
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead>Tonelaje</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBarcos?.map((barco) => (
                <TableRow key={barco.id_barco}>
                  <TableCell className="font-medium">{barco.codigo_humano}</TableCell>
                  <TableCell>
                    <Link href={`/produccion/${barco.id_barco}`} className="hover:underline text-primary">
                      {barco.nombre}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(barco.fecha_ingreso).toLocaleDateString("es-VE")}</TableCell>
                  <TableCell>
                    {barco.tonelaje_inicial ? `${barco.tonelaje_inicial.toString()} Ton` : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        barco.estado === "Activo" ? "default" : barco.estado === "Desguazado" ? "secondary" : "outline"
                      }
                    >
                      {barco.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog open={isEditOpen && editingBarco?.id_barco === barco.id_barco} onOpenChange={setIsEditOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingBarco(barco)
                            setIsEditOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Barco</DialogTitle>
                          <DialogDescription>Modifica la información del barco</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                          <div>
                            <Label htmlFor="codigo_humano">Código</Label>
                            <Input
                              id="codigo_humano"
                              name="codigo_humano"
                              defaultValue={editingBarco?.codigo_humano}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input id="nombre" name="nombre" defaultValue={editingBarco?.nombre} required />
                          </div>
                          <div>
                            <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
                            <Input
                              id="fecha_ingreso"
                              name="fecha_ingreso"
                              type="date"
                              defaultValue={editingBarco?.fecha_ingreso}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="tonelaje_inicial">Tonelaje Inicial</Label>
                            <Input
                              id="tonelaje_inicial"
                              name="tonelaje_inicial"
                              type="number"
                              step="0.01"
                              defaultValue={editingBarco?.tonelaje_inicial || ""}
                            />
                          </div>
                          <div>
                            <Label htmlFor="estado">Estado</Label>
                            <Select name="estado" defaultValue={editingBarco?.estado}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Desguazado">Desguazado</SelectItem>
                                <SelectItem value="Pausado">Pausado</SelectItem>
                              </SelectContent>
                            </Select>
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
                      isLoading={isDeleting === barco.id_barco}
                      loadingText="..."
                      onClick={() => handleDelete(barco.id_barco)}
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
