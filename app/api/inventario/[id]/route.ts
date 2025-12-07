import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { nombre_material, tipo_material, unidad_medida, stock_actual, stock_minimo } = body

    await query(
      "UPDATE Inventario_Materiales SET nombre_material = ?, tipo_material = ?, unidad_medida = ?, stock_actual = ?, stock_minimo = ? WHERE id_material = ?",
      [nombre_material, tipo_material, unidad_medida, stock_actual, stock_minimo, id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating material:", error)
    return NextResponse.json({ error: "Error al actualizar material" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await query("DELETE FROM Inventario_Materiales WHERE id_material = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting material:", error)
    return NextResponse.json({ error: "Error al eliminar material" }, { status: 500 })
  }
}
