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

export default function TrabajadoresPage() {
  const { data: trabajadores, error, mutate } = useSWR("/api/trabajadores", fetcher)
  const [searchTerm, setSearchTerm] = useState("")
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [editingTrabajador, setEditingTrabajador] = useState<any>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const filteredTrabajadores = trabajadores?.filter(
    (t: any) =>
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.puesto.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      cedula: formData.get("cedula"),
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      correo: formData.get("correo"),
      telefono: formData.get("telefono"),
      direccion: formData.get("direccion"),
      puesto: formData.get("puesto"),
      salario: Number.parseFloat(formData.get("salario") as string),
      fecha_contratacion: formData.get("fecha_contratacion"),
    }

    await fetch("/api/trabajadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    mutate()
    setIsNewOpen(false)
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTrabajador) return

    const formData = new FormData(e.currentTarget)
    const data = {
      cedula: formData.get("cedula"),
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      correo: formData.get("correo"),
      telefono: formData.get("telefono"),
      direccion: formData.get("direccion"),
      puesto: formData.get("puesto"),
      salario: Number.parseFloat(formData.get("salario") as string),
      fecha_contratacion: formData.get("fecha_contratacion"),
    }

    await fetch(`/api/trabajadores/${editingTrabajador.id_trabajador}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    mutate()
    setIsEditOpen(false)
    setEditingTrabajador(null)
  }

  if (error) return <div className="p-8">Error al cargar los datos</div>
  if (!trabajadores) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-balance mb-2">Módulo de Trabajadores</h1>
          <p className="text-muted-foreground text-lg">Gestión de personal y asignaciones</p>
        </div>
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Trabajador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Trabajador</DialogTitle>
              <DialogDescription>Registra un nuevo trabajador en el sistema</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new_cedula">Cédula</Label>
                  <Input id="new_cedula" name="cedula" placeholder="V-12345678" required />
                </div>
                <div>
                  <Label htmlFor="new_fecha_contratacion">Fecha de Contratación</Label>
                  <Input
                    id="new_fecha_contratacion"
                    name="fecha_contratacion"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new_nombre">Nombre</Label>
                  <Input id="new_nombre" name="nombre" placeholder="Carlos" required />
                </div>
                <div>
                  <Label htmlFor="new_apellido">Apellido</Label>
                  <Input id="new_apellido" name="apellido" placeholder="Rodríguez" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new_puesto">Puesto</Label>
                  <Input id="new_puesto" name="puesto" placeholder="Supervisor de Desguace" required />
                </div>
                <div>
                  <Label htmlFor="new_salario">Salario</Label>
                  <Input id="new_salario" name="salario" type="number" step="0.01" placeholder="1500.00" required />
                </div>
              </div>
              <div>
                <Label htmlFor="new_correo">Correo Electrónico</Label>
                <Input id="new_correo" name="correo" type="email" placeholder="carlos@construnaval.com" />
              </div>
              <div>
                <Label htmlFor="new_telefono">Teléfono</Label>
                <Input id="new_telefono" name="telefono" placeholder="+58 412-1234567" />
              </div>
              <div>
                <Label htmlFor="new_direccion">Dirección</Label>
                <Input id="new_direccion" name="direccion" placeholder="Av. Principal, Puerto La Cruz" />
              </div>
              <Button type="submit" className="w-full">
                Crear Trabajador
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Activo</CardTitle>
              <CardDescription>Lista de trabajadores registrados en el sistema</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar trabajador..."
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
                <TableHead>Cédula</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Fecha Contratación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrabajadores?.map((trabajador: any) => (
                <TableRow key={trabajador.id_trabajador}>
                  <TableCell className="font-medium">{trabajador.cedula}</TableCell>
                  <TableCell>
                    {trabajador.nombre} {trabajador.apellido}
                  </TableCell>
                  <TableCell>{trabajador.puesto}</TableCell>
                  <TableCell className="text-sm">{trabajador.telefono}</TableCell>
                  <TableCell className="text-sm">{trabajador.correo}</TableCell>
                  <TableCell className="font-bold">${trabajador.salario.toLocaleString()}</TableCell>
                  <TableCell>{new Date(trabajador.fecha_contratacion).toLocaleDateString("es-VE")}</TableCell>
                  <TableCell>
                    <Dialog
                      open={isEditOpen && editingTrabajador?.id_trabajador === trabajador.id_trabajador}
                      onOpenChange={setIsEditOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTrabajador(trabajador)
                            setIsEditOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar Trabajador</DialogTitle>
                          <DialogDescription>Modifica la información del trabajador</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cedula">Cédula</Label>
                              <Input id="cedula" name="cedula" defaultValue={editingTrabajador?.cedula} required />
                            </div>
                            <div>
                              <Label htmlFor="fecha_contratacion">Fecha de Contratación</Label>
                              <Input
                                id="fecha_contratacion"
                                name="fecha_contratacion"
                                type="date"
                                defaultValue={editingTrabajador?.fecha_contratacion}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="nombre">Nombre</Label>
                              <Input id="nombre" name="nombre" defaultValue={editingTrabajador?.nombre} required />
                            </div>
                            <div>
                              <Label htmlFor="apellido">Apellido</Label>
                              <Input
                                id="apellido"
                                name="apellido"
                                defaultValue={editingTrabajador?.apellido}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="puesto">Puesto</Label>
                              <Input id="puesto" name="puesto" defaultValue={editingTrabajador?.puesto} required />
                            </div>
                            <div>
                              <Label htmlFor="salario">Salario</Label>
                              <Input
                                id="salario"
                                name="salario"
                                type="number"
                                step="0.01"
                                defaultValue={editingTrabajador?.salario}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="correo">Correo Electrónico</Label>
                            <Input
                              id="correo"
                              name="correo"
                              type="email"
                              defaultValue={editingTrabajador?.correo || ""}
                            />
                          </div>
                          <div>
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" name="telefono" defaultValue={editingTrabajador?.telefono || ""} />
                          </div>
                          <div>
                            <Label htmlFor="direccion">Dirección</Label>
                            <Input id="direccion" name="direccion" defaultValue={editingTrabajador?.direccion || ""} />
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
