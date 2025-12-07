import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// POST - Añadir consumo de material a una semana
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { id_material, fecha_registro, cantidad_consumida } = body

    // Verificar que hay stock suficiente
    const material: any = await query("SELECT stock_actual FROM Inventario_Materiales WHERE id_material = ?", [
      id_material,
    ])

    if (!material || material.length === 0) {
      return NextResponse.json({ error: "Material no encontrado" }, { status: 404 })
    }

    if (material[0].stock_actual < cantidad_consumida) {
      return NextResponse.json({ error: "Stock insuficiente" }, { status: 400 })
    }

    // Registrar el consumo
    await query(
      "INSERT INTO Materiales_Consumidos (id_semana, id_material, fecha_registro, cantidad_consumida) VALUES (?, ?, ?, ?)",
      [id, id_material, fecha_registro, cantidad_consumida],
    )

    // Rebajar del inventario
    await query("UPDATE Inventario_Materiales SET stock_actual = stock_actual - ? WHERE id_material = ?", [
      cantidad_consumida,
      id_material,
    ])

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error adding consumo:", error)
    return NextResponse.json({ error: "Error al añadir el consumo" }, { status: 500 })
  }
}
