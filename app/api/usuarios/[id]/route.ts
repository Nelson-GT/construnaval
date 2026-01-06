import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { username, password, nombre_completo, rol, estado } = body

    const updates: string[] = []
    const values: any[] = []

    if (username !== undefined) {
      updates.push("username = ?")
      values.push(username)
    }
    if (password !== undefined) {
      const password_hash = await bcrypt.hash(password, 10)
      updates.push("password_hash = ?")
      values.push(password_hash)
    }
    if (nombre_completo !== undefined) {
      updates.push("nombre_completo = ?")
      values.push(nombre_completo)
    }
    if (rol !== undefined) {
      updates.push("rol = ?")
      values.push(rol)
    }
    if (estado !== undefined) {
      updates.push("estado = ?")
      values.push(estado)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)

    await query(`UPDATE Usuarios SET ${updates.join(", ")} WHERE id_usuario = ?`, values)

    return NextResponse.json({ success: true, message: "Usuario updated successfully" })
  } catch (error: any) {
    console.error("[v0] Error updating usuario:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error updating usuario" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Prevent deletion of admin user (optional security measure)
    const usuario = await query("SELECT id_usuario FROM Usuarios WHERE id_usuario = ? AND rol = 'admin'", [id])
    if ((usuario as any[]).length > 0) {
      return NextResponse.json({ error: "Cannot delete admin user" }, { status: 400 })
    }

    await query("DELETE FROM Usuarios WHERE id_usuario = ?", [id])

    return NextResponse.json({ success: true, message: "Usuario deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting usuario:", error)
    return NextResponse.json({ error: "Error deleting usuario" }, { status: 500 })
  }
}
