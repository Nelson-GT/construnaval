import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const {
      numero_guia,
      fecha_salida,
      nombre_material,
      cantidad_material,
      unidad_medida,
      nombre_comprador,
      destino_ubicacion,
      placa_gandola,
    } = body

    await query(
      "UPDATE Ventas_Salidas SET numero_guia = ?, fecha_salida = ?, nombre_material = ?, cantidad_material = ?, unidad_medida = ?, nombre_comprador = ?, destino_ubicacion = ?, placa_gandola = ? WHERE id_salida = ?",
      [
        numero_guia,
        fecha_salida,
        nombre_material,
        cantidad_material,
        unidad_medida,
        nombre_comprador,
        destino_ubicacion,
        placa_gandola,
        id,
      ],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating venta:", error)
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await query("DELETE FROM Ventas_Salidas WHERE id_salida = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting venta:", error)
    return NextResponse.json({ error: "Error al eliminar venta" }, { status: 500 })
  }
}
