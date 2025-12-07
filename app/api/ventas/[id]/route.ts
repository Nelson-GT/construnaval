import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { numero_guia, fecha_salida, nombre_comprador, destino_ubicacion, placa_gandola, total, materiales } = body

    if (!materiales || materiales.length === 0) {
      return NextResponse.json({ error: "Debe añadir al menos un material" }, { status: 400 })
    }

    // Get previous materials to restore stock
    const previousDetalles = await query(
      "SELECT id_material, cantidad_material FROM Detalles_Venta WHERE id_salida = ?",
      [id],
    )

    // Restore previous stock quantities
    for (const detalle of previousDetalles as any[]) {
      await query("UPDATE Inventario_Materiales SET stock_actual = stock_actual + ? WHERE id_material = ?", [
        detalle.cantidad_material,
        detalle.id_material,
      ])
    }

    // Update main sale record
    await query(
      "UPDATE Ventas_Salidas SET numero_guia = ?, fecha_salida = ?, nombre_comprador = ?, destino_ubicacion = ?, placa_gandola = ?, total = ? WHERE id_salida = ?",
      [numero_guia, fecha_salida, nombre_comprador, destino_ubicacion, placa_gandola, total, id],
    )

    await query("DELETE FROM Detalles_Venta WHERE id_salida = ?", [id])

    // Insert new materials and update stock
    for (const material of materiales) {
      await query("INSERT INTO Detalles_Venta (id_salida, id_material, cantidad_material) VALUES (?, ?, ?)", [
        id,
        material.id_material,
        material.cantidad_material,
      ])

      await query("UPDATE Inventario_Materiales SET stock_actual = stock_actual - ? WHERE id_material = ?", [
        material.cantidad_material,
        material.id_material,
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating venta:", error)
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const detalles = await query("SELECT id_material, cantidad_material FROM Detalles_Venta WHERE id_salida = ?", [id])

    for (const detalle of detalles as any[]) {
      await query("UPDATE Inventario_Materiales SET stock_actual = stock_actual + ? WHERE id_material = ?", [
        detalle.cantidad_material,
        detalle.id_material,
      ])
    }

    await query("DELETE FROM Ventas_Salidas WHERE id_salida = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting venta:", error)
    return NextResponse.json({ error: "Error al eliminar venta" }, { status: 500 })
  }
}
