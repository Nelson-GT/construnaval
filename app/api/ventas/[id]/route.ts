import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const {
      numero_guia,
      fecha_salida,
      nombre_comprador,
      destino_ubicacion,
      placa_gandola,
      materiales, // Array of materials
    } = body

    // Update main sale record
    await query(
      "UPDATE Ventas_Salidas SET numero_guia = ?, fecha_salida = ?, nombre_comprador = ?, destino_ubicacion = ?, placa_gandola = ? WHERE id_salida = ?",
      [numero_guia, fecha_salida, nombre_comprador, destino_ubicacion, placa_gandola, id],
    )

    await query("DELETE FROM Detalles_Venta WHERE id_salida = ?", [id])

    for (const material of materiales) {
      await query("INSERT INTO Detalles_Venta (id_salida, id_material, cantidad_material) VALUES (?, ?, ?)", [
        id,
        material.id_material,
        material.cantidad_material,
      ])
    }

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
