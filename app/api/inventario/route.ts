import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { InventarioMaterial } from "@/lib/mock-data"

export async function GET() {
  try {
    const materiales = await query<InventarioMaterial[]>("SELECT * FROM Inventario_Materiales ORDER BY nombre_material")
    return NextResponse.json(materiales)
  } catch (error) {
    console.error("[v0] Error fetching inventario:", error)
    return NextResponse.json({ error: "Error al obtener inventario" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre_material, tipo_material, unidad_medida, stock_actual, stock_minimo } = body

    const result = await query(
      "INSERT INTO Inventario_Materiales (nombre_material, tipo_material, unidad_medida, stock_actual, stock_minimo) VALUES (?, ?, ?, ?, ?)",
      [nombre_material, tipo_material, unidad_medida, stock_actual, stock_minimo],
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("[v0] Error creating material:", error)
    return NextResponse.json({ error: "Error al crear material" }, { status: 500 })
  }
}
