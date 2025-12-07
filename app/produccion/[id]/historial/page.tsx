"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, Users, FileText } from "lucide-react"
import useSWR from "swr"
import React from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HistorialCompletoPage({ params }: { params: Promise<{ id: string }> }) {
  const [barcoId, setBarcoId] = React.useState<string | null>(null)

  React.useEffect(() => {
    params.then((p) => setBarcoId(p.id))
  }, [params])

  const { data, error } = useSWR(barcoId ? `/api/barcos/${barcoId}/historial-completo` : null, fetcher)

  if (!barcoId) return <div className="p-8">Cargando...</div>
  if (error) return <div className="p-8">Error al cargar el historial</div>
  if (!data) return <div className="p-8">Cargando...</div>

  const { barco, eventos } = data

  return (
    <div className="min-h-screen bg-background">
      {/* Header sin sidebar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">CONSTRUNAVAL</h1>
              <p className="text-sm text-muted-foreground">Historial Completo del Proyecto</p>
            </div>
            <Badge
              variant={barco.estado === "Activo" ? "default" : barco.estado === "Desguazado" ? "secondary" : "outline"}
              className="text-lg px-4 py-2"
            >
              {barco.estado}
            </Badge>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-8 py-8">
        {/* Información del barco */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{barco.nombre}</CardTitle>
            <p className="text-muted-foreground">Código: {barco.codigo_humano}</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                  <p className="font-semibold">{new Date(barco.fecha_ingreso).toLocaleDateString("es-VE")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tonelaje Inicial</p>
                  <p className="font-semibold">
                    {barco.tonelaje_inicial ? `${barco.tonelaje_inicial.toLocaleString()} Ton` : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Eventos</p>
                  <p className="font-semibold">{eventos.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline de eventos */}
        <Card>
          <CardHeader>
            <CardTitle>Historial Cronológico</CardTitle>
            <p className="text-sm text-muted-foreground">Todos los eventos ordenados por fecha</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventos.map((evento: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full p-2 ${
                        evento.tipo === "consumo"
                          ? "bg-red-500/10 text-red-500"
                          : evento.tipo === "nota"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {evento.tipo === "consumo" ? (
                        <Package className="h-4 w-4" />
                      ) : evento.tipo === "nota" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>
                    {index < eventos.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Semana {evento.semana}</Badge>
                        <Badge
                          variant={
                            evento.tipo === "consumo" ? "destructive" : evento.tipo === "nota" ? "default" : "secondary"
                          }
                        >
                          {evento.tipo === "consumo"
                            ? "Consumo"
                            : evento.tipo === "nota"
                              ? "Nota"
                              : "Personal Asignado"}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(evento.fecha).toLocaleDateString("es-VE")}
                      </span>
                    </div>

                    {evento.tipo === "consumo" && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium">{evento.datos.nombre_material}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {evento.datos.cantidad_consumida} {evento.datos.unidad_medida}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Tipo: {evento.datos.tipo_material}</p>
                      </div>
                    )}

                    {evento.tipo === "nota" && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium">{evento.datos.titulo}</p>
                        <p className="text-sm text-muted-foreground mt-1">{evento.datos.descripcion}</p>
                      </div>
                    )}

                    {evento.tipo === "personal" && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium">
                          {evento.datos.nombre} {evento.datos.apellido}
                        </p>
                        <p className="text-sm text-muted-foreground">{evento.datos.puesto}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
