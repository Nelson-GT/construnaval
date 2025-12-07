import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { VentaSalida } from "@/lib/mock-data"

export async function GET() {
  try {
    const ventas = await query<VentaSalida[]>("SELECT * FROM Ventas_Salidas ORDER BY fecha_salida DESC")
    return NextResponse.json(ventas)
  } catch (error) {
    console.error("[v0] Error fetching ventas:", error)
    return NextResponse.json({ error: "Error al obtener ventas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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

    const result = await query(
      "INSERT INTO Ventas_Salidas (numero_guia, fecha_salida, nombre_material, cantidad_material, unidad_medida, nombre_comprador, destino_ubicacion, placa_gandola) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        numero_guia,
        fecha_salida,
        nombre_material,
        cantidad_material,
        unidad_medida,
        nombre_comprador,
        destino_ubicacion,
        placa_gandola,
      ],
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("[v0] Error creating venta:", error)
    return NextResponse.json({ error: "Error al crear venta" }, { status: 500 })
  }
}
