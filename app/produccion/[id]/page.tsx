"use client"

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Package, Users, Wrench, Plus, FileText, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BarcoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const [barcoId, setBarcoId] = React.useState<string | null>(null)

  React.useEffect(() => {
    params.then((p) => setBarcoId(p.id))
  }, [params])

  const { data: barcoData, error: barcoError } = useSWR(barcoId ? `/api/barcos/${barcoId}` : null, fetcher)
  const {
    data: semanas,
    error: semanasError,
    mutate: mutateSemanas,
  } = useSWR(barcoId ? `/api/barcos/${barcoId}/semanas` : null, fetcher)
  const { data: trabajadores } = useSWR("/api/trabajadores", fetcher)
  const { data: materiales } = useSWR("/api/inventario", fetcher)

  const [isNewSemanaOpen, setIsNewSemanaOpen] = useState(false)
  const [isNewNotaOpen, setIsNewNotaOpen] = useState(false)
  const [selectedTrabajadores, setSelectedTrabajadores] = useState<number[]>([])
  const [expandedSemana, setExpandedSemana] = useState<number | null>(null)
  const [isAddConsumoOpen, setIsAddConsumoOpen] = useState(false)
  const [currentSemanaId, setCurrentSemanaId] = useState<number | null>(null)

  const { data: semanaDetails, mutate: mutateSemanaDetails } = useSWR(
    expandedSemana ? `/api/semanas/${expandedSemana}` : null,
    fetcher,
  )

  const { data: notasSemana, mutate: mutateNotas } = useSWR(
    expandedSemana ? `/api/semanas/${expandedSemana}/notas` : null,
    fetcher,
  )

  const handleCreateSemana = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await fetch(`/api/barcos/${barcoId}/semanas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha_inicio: formData.get("fecha_inicio"),
        trabajadores: selectedTrabajadores,
      }),
    })

    mutateSemanas()
    setIsNewSemanaOpen(false)
    setSelectedTrabajadores([])
  }

  const handleCreateNota = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await fetch(`/api/semanas/${currentSemanaId}/notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: formData.get("titulo"),
        descripcion: formData.get("descripcion"),
        fecha_nota: formData.get("fecha_nota"),
      }),
    })

    mutateNotas()
    setIsNewNotaOpen(false)
  }

  const handleAddConsumo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await fetch(`/api/semanas/${currentSemanaId}/consumos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_material: Number.parseInt(formData.get("id_material") as string),
        fecha_registro: formData.get("fecha_registro"),
        cantidad_consumida: Number.parseFloat(formData.get("cantidad_consumida") as string),
      }),
    })

    mutateSemanaDetails()
    mutateSemanas()
    setIsAddConsumoOpen(false)
  }

  if (!barcoId) return <div className="p-8">Cargando...</div>
  if (barcoError || semanasError) return <div className="p-8">Error al cargar los datos</div>
  if (!barcoData || !semanas) return <div className="p-8">Cargando...</div>

  const barco = barcoData

  const consumosPorTipo = semanaDetails?.consumos?.reduce((acc: any, consumo: any) => {
    const tipo = consumo.tipo_material
    if (!acc[tipo]) acc[tipo] = []
    acc[tipo].push(consumo)
    return acc
  }, {})

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/produccion">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Producción
          </Button>
        </Link>
        <Link href={`/produccion/${barcoId}/historial`}>
          <Button variant="outline" className="gap-2 bg-transparent">
            <History className="h-4 w-4" />
            Ver Historial Completo
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-balance mb-2">{barco.nombre}</h1>
            <p className="text-muted-foreground text-lg">Código: {barco.codigo_humano}</p>
          </div>
          <Badge
            variant={barco.estado === "Activo" ? "default" : barco.estado === "Desguazado" ? "secondary" : "outline"}
            className="text-lg px-4 py-2"
          >
            {barco.estado}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fecha de Ingreso</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date(barco.fecha_ingreso).toLocaleDateString("es-VE")}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tonelaje Inicial</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {barco.tonelaje_inicial ? `${barco.tonelaje_inicial.toString()} Ton` : "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Semanas Activas</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{semanas.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial por Semanas</CardTitle>
              <CardDescription>Gestión semanal del proyecto desde el ingreso del barco</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isNewNotaOpen} onOpenChange={setIsNewNotaOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => setCurrentSemanaId(expandedSemana)}
                    disabled={!expandedSemana}
                  >
                    <FileText className="h-4 w-4" />
                    Añadir Nota
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Añadir Nota</DialogTitle>
                    <DialogDescription>Registra una nota para la semana seleccionada</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateNota} className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título</Label>
                      <Input id="titulo" name="titulo" placeholder="Título de la nota" required />
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        name="descripcion"
                        placeholder="Descripción detallada..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="fecha_nota">Fecha</Label>
                      <Input
                        id="fecha_nota"
                        name="fecha_nota"
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Guardar Nota
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isNewSemanaOpen} onOpenChange={setIsNewSemanaOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Semana
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Semana</DialogTitle>
                    <DialogDescription>
                      Define la fecha de inicio y asigna el personal para esta semana
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSemana} className="space-y-4">
                    <div>
                      <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                      <Input
                        id="fecha_inicio"
                        name="fecha_inicio"
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">La semana finalizará 7 días después</p>
                    </div>

                    <div>
                      <Label>Trabajadores Asignados</Label>
                      <div className="border rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                        {trabajadores?.map((trabajador: any) => (
                          <div key={trabajador.id_trabajador} className="flex items-center space-x-2">
                            <Checkbox
                              id={`trabajador-${trabajador.id_trabajador}`}
                              checked={selectedTrabajadores.includes(trabajador.id_trabajador)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTrabajadores([...selectedTrabajadores, trabajador.id_trabajador])
                                } else {
                                  setSelectedTrabajadores(
                                    selectedTrabajadores.filter((id) => id !== trabajador.id_trabajador),
                                  )
                                }
                              }}
                            />
                            <label
                              htmlFor={`trabajador-${trabajador.id_trabajador}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {trabajador.nombre} {trabajador.apellido} - {trabajador.puesto}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Crear Semana
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(value) => {
              const semanaId = value ? Number.parseInt(value.split("-")[1]) : null
              setExpandedSemana(semanaId)
            }}
          >
            {semanas.map((semana: any) => (
              <AccordionItem key={semana.id_semana} value={`semana-${semana.id_semana}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      Semana {semana.numero_semana}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(semana.fecha_inicio).toLocaleDateString("es-VE")} -{" "}
                      {new Date(semana.fecha_fin).toLocaleDateString("es-VE")}
                    </span>
                    <Badge variant="secondary" className="ml-auto mr-4">
                      {semana.total_trabajadores} trabajadores
                    </Badge>
                    <Badge variant="secondary" className="mr-4">
                      {semana.total_consumos} consumos
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {expandedSemana === semana.id_semana && semanaDetails && (
                    <div className="space-y-6 pt-4">
                      <div className="flex justify-end">
                        <Dialog open={isAddConsumoOpen} onOpenChange={setIsAddConsumoOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="gap-2 bg-transparent"
                              onClick={() => setCurrentSemanaId(semana.id_semana)}
                            >
                              <Plus className="h-4 w-4" />
                              Añadir Insumo
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Añadir Consumo de Material</DialogTitle>
                              <DialogDescription>
                                Registra el material consumido. Se descontará automáticamente del inventario.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddConsumo} className="space-y-4">
                              <div>
                                <Label htmlFor="id_material">Material</Label>
                                <Select name="id_material" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un material" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {materiales?.map((material: any) => (
                                      <SelectItem key={material.id_material} value={material.id_material.toString()}>
                                        {material.nombre_material} (Stock: {material.stock_actual}{" "}
                                        {material.unidad_medida})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="fecha_registro">Fecha</Label>
                                <Input
                                  id="fecha_registro"
                                  name="fecha_registro"
                                  type="date"
                                  defaultValue={new Date().toISOString().split("T")[0]}
                                  required
                                />
                              </div>

                              <div>
                                <Label htmlFor="cantidad_consumida">Cantidad Consumida</Label>
                                <Input
                                  id="cantidad_consumida"
                                  name="cantidad_consumida"
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  required
                                />
                              </div>

                              <Button type="submit" className="w-full">
                                Registrar Consumo
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {notasSemana && notasSemana.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Notas
                          </h4>
                          <div className="space-y-3">
                            {notasSemana.map((nota: any) => (
                              <Card key={nota.id_nota}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <CardTitle className="text-base">{nota.titulo}</CardTitle>
                                    <Badge variant="outline">
                                      {new Date(nota.fecha_nota).toLocaleDateString("es-VE")}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground">{nota.descripcion}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {consumosPorTipo && Object.keys(consumosPorTipo).length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Materiales Consumidos
                          </h4>
                          {Object.entries(consumosPorTipo).map(([tipo, consumos]: [string, any]) => (
                            <div key={tipo} className="mb-4">
                              <h5 className="text-sm font-medium text-muted-foreground mb-2">{tipo}</h5>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Cantidad</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {consumos.map((consumo: any) => (
                                    <TableRow key={consumo.id_consumo}>
                                      <TableCell className="font-medium">{consumo.nombre_material}</TableCell>
                                      <TableCell>
                                        {new Date(consumo.fecha_registro).toLocaleDateString("es-VE")}
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="secondary">
                                          {consumo.cantidad_consumida} {consumo.unidad_medida}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ))}
                        </div>
                      )}

                      {semanaDetails.personal && semanaDetails.personal.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Personal Asignado
                          </h4>
                          <div className="space-y-2">
                            {semanaDetails.personal.map((persona: any) => (
                              <div
                                key={persona.id_asignacion}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">
                                    {persona.nombre} {persona.apellido}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{persona.puesto}</p>
                                </div>
                                <Badge variant="outline">{persona.cedula}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
