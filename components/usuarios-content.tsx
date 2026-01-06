"use client"

import { useState, useEffect } from "react"
import { Edit2, Trash2, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingButton } from "./loading-button"
import { UserFormDialog } from "./user-form-dialog"
import { SalesStatsPanel } from "./sales-stats-panel"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"

interface Usuario {
  id_usuario: number
  username: string
  nombre_completo: string
  rol: string
  estado: boolean
  fecha_creacion: string
}

export default function UsuariosContent() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | undefined>()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/api/usuarios")
      if (!response.ok) throw new Error("Error fetching usuarios")
      const data = await response.json()
      setUsuarios(data)
      setFilteredUsuarios(data)
    } catch (error) {
      console.error("[v0] Error fetching usuarios:", error)
      alert("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  useEffect(() => {
    const filtered = usuarios.filter(
      (u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.rol.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsuarios(filtered)
  }, [searchTerm, usuarios])

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/usuarios/${id}`, { method: "DELETE" })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }
      await fetchUsuarios()
    } catch (error) {
      console.error("[v0] Error deleting usuario:", error)
      alert("Error al eliminar usuario")
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenDialog = () => {
    setSelectedUsuario(undefined)
    setDialogOpen(true)
  }

  const getRolDisplay = (rol: string) => {
    const roles: { [key: string]: string } = {
      admin: "Administrador",
      produccion: "Producción",
      ventas: "Ventas",
    }
    return roles[rol] || rol
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Cargando usuarios...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance mb-2">Gestión de Usuarios</h1>
        <p className="text-muted-foreground text-lg">Administra los usuarios del sistema</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Usuarios Registrados</h2>
        <Button onClick={handleOpenDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
      </div>


      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                <span className="ml-auto">
                  {filteredUsuarios.length} usuario{filteredUsuarios.length !== 1 ? "s registrados" : " registrado"}
                </span>
              </CardTitle>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              <Input
                placeholder="Buscar por usuario, nombre o rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-left">Usuario</TableHead>
                  <TableHead className="text-left">Nombre</TableHead>
                  <TableHead className="text-center">Rol</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Fecha de Creación</TableHead>
                  <TableHead className="text-right text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-foreground/60">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id_usuario} className="border-border">
                      <TableCell className="font-medium text-foreground">{usuario.username}</TableCell>
                      <TableCell className="text-foreground">{usuario.nombre_completo}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          {getRolDisplay(usuario.rol)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                            usuario.estado ? "bg-green-100/50 text-green-700" : "bg-red-100/50 text-red-700"
                          }`}
                          >
                          {usuario.estado ? "Activo" : "Inactivo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-foreground/60 text-center">
                        {new Date(usuario.fecha_creacion).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(usuario)} className="h-8 w-8 p-0">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <LoadingButton
                            variant="ghost"
                            size="sm"
                            isLoading={deletingId === usuario.id_usuario}
                            onClick={() => handleDelete(usuario.id_usuario)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </LoadingButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <UserFormDialog
        key={selectedUsuario ? selectedUsuario.id_usuario : "crear"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        usuario={selectedUsuario}
        onSuccess={fetchUsuarios}
      />
    </div>
  )
}
