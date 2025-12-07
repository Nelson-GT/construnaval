import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const barcos = await query("SELECT * FROM Barcos WHERE id_barco = ?", [id])

    if (Array.isArray(barcos) && barcos.length > 0) {
      return NextResponse.json(barcos[0])
    }

    return NextResponse.json({ error: "Barco no encontrado" }, { status: 404 })
  } catch (error) {
    console.error("[v0] Error fetching barco:", error)
    return NextResponse.json({ error: "Error al obtener barco" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { codigo_humano, nombre, fecha_ingreso, tonelaje_inicial, estado } = body

    await query(
      "UPDATE Barcos SET codigo_humano = ?, nombre = ?, fecha_ingreso = ?, tonelaje_inicial = ?, estado = ? WHERE id_barco = ?",
      [codigo_humano, nombre, fecha_ingreso, tonelaje_inicial, estado, id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating barco:", error)
    return NextResponse.json({ error: "Error al actualizar barco" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await query("DELETE FROM Barcos WHERE id_barco = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting barco:", error)
    return NextResponse.json({ error: "Error al eliminar barco" }, { status: 500 })
  }
}
