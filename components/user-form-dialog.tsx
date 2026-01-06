"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingButton } from "./loading-button"

interface Usuario {
  id_usuario: number
  username: string
  nombre_completo: string
  rol: string
  estado: boolean
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: Usuario
  onSuccess: () => void
}

export function UserFormDialog({ open, onOpenChange, usuario, onSuccess }: UserFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: usuario?.username || "",
    nombre_completo: usuario?.nombre_completo || "",
    password: "",
    rol: usuario?.rol || "produccion",
    estado: usuario?.estado !== false,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = usuario ? "PUT" : "POST"
      const url = usuario ? `/api/usuarios/${usuario.id_usuario}` : "/api/usuarios"

      const body: any = {
        username: formData.username,
        nombre_completo: formData.nombre_completo,
        rol: formData.rol,
        estado: formData.estado,
      }

      if (formData.password) {
        body.password = formData.password
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Error: ${error.error}`)
        return
      }

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert("Error al guardar el usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{usuario ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario de edición de usuario
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="nombre_usuario"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre_completo">Nombre Completo</Label>
            <Input
              id="nombre_completo"
              value={formData.nombre_completo}
              onChange={(e) => handleChange("nombre_completo", e.target.value)}
              placeholder="Nombre Completo"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña {usuario && "(dejar en blanco para no cambiar)"}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Contraseña"
              required={!usuario}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select value={formData.rol} onValueChange={(value) => handleChange("rol", value)}>
              <SelectTrigger id="rol" disabled={loading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="produccion">Producción</SelectItem>
                <SelectItem value="ventas">Ventas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado ? "activo" : "inactivo"}
              onValueChange={(value) => handleChange("estado", value === "activo")}
            >
              <SelectTrigger id="estado" disabled={loading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <LoadingButton type="submit" isLoading={loading}>
              {usuario ? "Actualizar" : "Crear"} Usuario
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
