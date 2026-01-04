"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X } from "lucide-react"
import { LoadingButton } from "@/components/loading-button"

interface MaterialItem {
  id_material: number
  cantidad_material: number
  descripcion_material?: string
  unidad_medida?: string
  peso?: number
}

interface SalesFormGuideProps {
  materiales: any[]
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  initialData?: any
}

export function SalesFormGuide({ materiales, onSubmit, isLoading, initialData }: SalesFormGuideProps) {
  const [modoVenta, setModoVenta] = useState<"From Inventory" | "Direct Sale">(
    initialData?.modo_venta || "From Inventory",
  )
  const [selectedMateriales, setSelectedMateriales] = useState<MaterialItem[]>(
    initialData?.materiales || [{ id_material: 0, cantidad_material: 0, descripcion_material: "" }],
  )

  const addMaterial = () => {
    setSelectedMateriales([...selectedMateriales, { id_material: 0, cantidad_material: 0, descripcion_material: "" }])
  }

  const removeMaterial = (index: number) => {
    setSelectedMateriales(selectedMateriales.filter((_, i) => i !== index))
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = [...selectedMateriales]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedMateriales(updated)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (selectedMateriales.length === 0) {
      alert("Debe añadir al menos un material")
      return
    }

    const formData = new FormData(e.currentTarget)
    const data = {
      numero_guia: formData.get("numero_guia"),
      acto_inspeccion: formData.get("acto_inspeccion"),
      codigo_control: formData.get("codigo_control"),
      fecha_salida: formData.get("fecha_salida"),
      nombre_comprador: formData.get("nombre_comprador"),
      destino_ubicacion: formData.get("destino_direccion"),
      placa_gandola: formData.get("tractor_placa"),
      total: Number.parseFloat(formData.get("total") as string),
      empresa_solicitante: formData.get("empresa_solicitante"),
      rif: formData.get("rif"),
      conductor_nombre: formData.get("conductor_nombre"),
      conductor_ci: formData.get("conductor_ci"),
      tractor_marca: formData.get("tractor_marca"),
      tractor_modelo: formData.get("tractor_modelo"),
      tractor_color: formData.get("tractor_color"),
      tractor_placa: formData.get("tractor_placa"),
      batea_modelo: formData.get("batea_modelo"),
      batea_color: formData.get("batea_color"),
      batea_placa: formData.get("batea_placa"),
      origen_direccion: formData.get("origen_direccion"),
      destino_direccion: formData.get("destino_direccion"),
      fecha_validez_inicio: formData.get("fecha_validez_inicio"),
      fecha_validez_fin: formData.get("fecha_validez_fin"),
      modo_venta: modoVenta,
      materiales: selectedMateriales,
    }

    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={modoVenta} onValueChange={(v) => setModoVenta(v as "From Inventory" | "Direct Sale")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="From Inventory">Del Inventario</TabsTrigger>
          <TabsTrigger value="Direct Sale">Venta Directa/Externa</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Encabezado de Documento */}
      <div className="border-2 border-gray-300 p-4 bg-gray-50 space-y-2">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <Label className="text-xs font-bold">NÚMERO DE GUÍA</Label>
            <Input name="numero_guia" placeholder="GU-2025-001" defaultValue={initialData?.numero_guia} required />
          </div>
          <div>
            <Label className="text-xs font-bold">ACT DE INSPE N°</Label>
            <Input name="acto_inspeccion" placeholder="N° 4445" defaultValue={initialData?.acto_inspeccion} required />
          </div>
          <div>
            <Label className="text-xs font-bold">CÓDIGO CONTROL</Label>
            <Input name="codigo_control" placeholder="CZ-RUNPA..." defaultValue={initialData?.codigo_control} required />
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: Empresa Solicitante */}
      <div className="border-2 border-gray-300 p-4">
        <h3 className="font-bold text-sm mb-3 border-b pb-2">EMPRESA SOLICITANTE</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold">Nombre Empresa</Label>
            <Input
              name="empresa_solicitante"
              placeholder="Empresa Solicitante"
              defaultValue={initialData?.empresa_solicitante}
              required
            />
          </div>
          <div>
            <Label className="text-xs font-bold">RIF (C.I.V.)</Label>
            <Input name="rif" placeholder="V-123456789" defaultValue={initialData?.rif} />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Conductor */}
      <div className="border-2 border-gray-300 p-4">
        <h3 className="font-bold text-sm mb-3 border-b pb-2">CONDUCTOR</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold">Nombre Completo</Label>
            <Input
              name="conductor_nombre"
              placeholder="Nombre del Conductor"
              defaultValue={initialData?.conductor_nombre}
            />
          </div>
          <div>
            <Label className="text-xs font-bold">C.I.V.</Label>
            <Input name="conductor_ci" placeholder="V-12345678" defaultValue={initialData?.conductor_ci} />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: Información de Vehículos */}
      <div className="border-2 border-gray-300 p-4">
        <h3 className="font-bold text-sm mb-3 border-b pb-2">INFORMACIÓN DE VEHÍCULOS</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border-r-2 pr-4">
            <p className="font-semibold text-xs mb-2">Tractor/Camión</p>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Marca</Label>
                <Input name="tractor_marca" defaultValue={initialData?.tractor_marca} />
              </div>
              <div>
                <Label className="text-xs">Modelo</Label>
                <Input name="tractor_modelo" defaultValue={initialData?.tractor_modelo} />
              </div>
              <div>
                <Label className="text-xs">Color</Label>
                <Input name="tractor_color" defaultValue={initialData?.tractor_color} />
              </div>
              <div>
                <Label className="text-xs">Placa</Label>
                <Input name="tractor_placa" defaultValue={initialData?.tractor_placa} />
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-xs mb-2">Remolque/Batea</p>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Modelo</Label>
                <Input name="batea_modelo" defaultValue={initialData?.batea_modelo} />
              </div>
              <div>
                <Label className="text-xs">Color</Label>
                <Input name="batea_color" defaultValue={initialData?.batea_color} />
              </div>
              <div>
                <Label className="text-xs">Placa</Label>
                <Input name="batea_placa" defaultValue={initialData?.batea_placa} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: Ruta de Traslado */}
      <div className="border-2 border-gray-300 p-4">
        <h3 className="font-bold text-sm mb-3 border-b pb-2">RUTA DE TRASLADO</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold">Dirección Origen</Label>
            <Textarea
              name="origen_direccion"
              placeholder="Ubicación de origen"
              defaultValue={initialData?.origen_direccion}
            />
          </div>
          <div>
            <Label className="text-xs font-bold">Dirección Destino</Label>
            <Textarea
              name="destino_direccion"
              placeholder="Ubicación de destino"
              defaultValue={initialData?.destino_direccion}
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 5: Validez */}
      <div className="border-2 border-gray-300 p-4">
        <h3 className="font-bold text-sm mb-3 border-b pb-2">FECHAS DE VALIDEZ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-bold">Inicio</Label>
            <Input type="datetime-local" name="fecha_validez_inicio" defaultValue={initialData?.fecha_validez_inicio?.slice(0, 16) || new Date().toISOString().slice(0, 16)} />
          </div>
          <div>
            <Label className="text-xs font-bold">Fin</Label>
            <Input type="datetime-local" name="fecha_validez_fin" defaultValue={initialData?.fecha_validez_fin?.slice(0, 16) || new Date().toISOString().slice(0, 16)} />
          </div>
        </div>
      </div>

      {/* SECCIÓN 6: Detalles de Materiales */}
      <div className="border-2 border-gray-300 p-4">
        <div className="flex items-center justify-between mb-3 border-b pb-2">
          <h3 className="font-bold text-sm">DETALLES DE MATERIALES</h3>
          <Button type="button" size="sm" variant="outline" onClick={addMaterial}>
            <Plus className="h-4 w-4 mr-1" />
            Añadir Material
          </Button>
        </div>

        {selectedMateriales.length === 0 ? (
          <p className="text-sm text-red-500 font-medium py-4">Mínimo debe haber un material para crear la venta</p>
        ) : (
          <div className="space-y-3">
            {selectedMateriales.map((item, index) => (
              <div key={index} className="border rounded p-3 bg-slate-50">
                <div className="flex items-end gap-2 mb-2">
                  <div className="flex-1">
                    {modoVenta === "From Inventory" ? (
                      <>
                        <Label className="text-xs font-semibold">Material del Inventario</Label>
                        <select
                          value={item.id_material}
                          onChange={(e) => updateMaterial(index, "id_material", Number(e.target.value))}
                          className="w-full px-2 py-1 border rounded text-sm"
                          required
                        >
                          <option value={0}>Seleccionar material</option>
                          {materiales?.map((m: any) => (
                            <option key={m.id_material} value={m.id_material}>
                              {m.nombre_material} ({m.unidad_medida}) - Stock: {m.stock_actual}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <Label className="text-xs font-semibold">Descripción del Material</Label>
                        <Textarea
                          value={item.descripcion_material}
                          onChange={(e) => updateMaterial(index, "descripcion_material", e.target.value)}
                          placeholder="Ej: Material férrico proveniente del buque X..."
                          className="text-sm"
                          required
                        />
                      </>
                    )}
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

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Cantidad</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.cantidad_material || ""}
                      onChange={(e) => updateMaterial(index, "cantidad_material", Number.parseFloat(e.target.value))}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Unidad</Label>
                    <Input value={item.unidad_medida || ""} placeholder="Kg, L, m³" readOnly className="bg-gray-100" />
                  </div>
                  <div>
                    <Label className="text-xs">Peso (Kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.peso || ""}
                      onChange={(e) => updateMaterial(index, "peso", Number.parseFloat(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN 7: Información Financiera */}
      <div className="border-2 border-gray-300 p-4">
        <h3 className="font-bold text-sm mb-3 border-b pb-2">INFORMACIÓN FINANCIERA</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-bold">Fecha de Salida</Label>
            <Input
              type="datetime-local"
              name="fecha_salida"
              defaultValue={initialData?.fecha_salida?.slice(0, 16) || new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
          <div>
            <Label className="text-xs font-bold">Comprador</Label>
            <Input
              name="nombre_comprador"
              placeholder="Nombre del Comprador"
              defaultValue={initialData?.nombre_comprador}
              required
            />
          </div>
          <div>
            <Label className="text-xs font-bold">Total Venta ($)</Label>
            <Input
              type="number"
              step="0.01"
              name="total"
              placeholder="0.00"
              defaultValue={initialData?.total || ""}
              required
            />
          </div>
        </div>
      </div>

      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingText="Guardando..."
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {initialData ? "Guardar Cambios" : "Crear Guía de Traslado"}
      </LoadingButton>
    </form>
  )
}
