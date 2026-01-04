"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface Filters {
  dateFrom?: string
  dateTo?: string
  buyerName?: string
  destination?: string
  totalFrom?: number
  totalTo?: number
  guideNumber?: string
}

interface SalesFilterBarProps {
  onFilter: (filters: Filters) => void
  onClear: () => void
}

export function SalesFilterBar({ onFilter, onClear }: SalesFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<Filters>({})

  const handleApply = () => {
    onFilter(filters)
  }

  const handleClear = () => {
    setFilters({})
    onClear()
  }

  return (
    <div className="mb-6 border rounded-lg p-4 bg-slate-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Filtros Avanzados</h3>
        <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Contraer" : "Expandir"}
        </Button>
      </div>

      {isExpanded && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs font-semibold">Número de Guía</Label>
              <Input
                placeholder="GU-2025-001"
                value={filters.guideNumber || ""}
                onChange={(e) => setFilters({ ...filters, guideNumber: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Comprador</Label>
              <Input
                placeholder="Nombre del comprador"
                value={filters.buyerName || ""}
                onChange={(e) => setFilters({ ...filters, buyerName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-xs font-semibold">Fecha Desde</Label>
              <Input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Fecha Hasta</Label>
              <Input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Destino</Label>
              <Input
                placeholder="Ubicación de destino"
                value={filters.destination || ""}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs font-semibold">Total Desde ($)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0"
                value={filters.totalFrom || ""}
                onChange={(e) =>
                  setFilters({ ...filters, totalFrom: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Total Hasta ($)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="999999"
                value={filters.totalTo || ""}
                onChange={(e) =>
                  setFilters({ ...filters, totalTo: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleApply} className="flex-1">
              Aplicar Filtros
            </Button>
            <Button size="sm" variant="outline" onClick={handleClear} className="flex-1 bg-transparent">
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
