import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { cedula, nombre, apellido, correo, telefono, direccion, puesto, salario, fecha_contratacion } = body

    await query(
      "UPDATE Trabajadores SET cedula = ?, nombre = ?, apellido = ?, correo = ?, telefono = ?, direccion = ?, puesto = ?, salario = ?, fecha_contratacion = ? WHERE id_trabajador = ?",
      [cedula, nombre, apellido, correo, telefono, direccion, puesto, salario, fecha_contratacion, id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating trabajador:", error)
    return NextResponse.json({ error: "Error al actualizar trabajador" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await query("DELETE FROM Trabajadores WHERE id_trabajador = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting trabajador:", error)
    return NextResponse.json({ error: "Error al eliminar trabajador" }, { status: 500 })
  }
}
