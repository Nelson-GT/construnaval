import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Barco } from "@/lib/mock-data"

export async function GET() {
  try {
    const barcos = await query<Barco[]>("SELECT * FROM Barcos ORDER BY fecha_ingreso DESC")
    return NextResponse.json(barcos)
  } catch (error) {
    console.error("[v0] Error fetching barcos:", error)
    return NextResponse.json({ error: "Error al obtener barcos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { codigo_humano, nombre, fecha_ingreso, tonelaje_inicial, estado } = body

    const result = await query(
      "INSERT INTO Barcos (codigo_humano, nombre, fecha_ingreso, tonelaje_inicial, estado) VALUES (?, ?, ?, ?, ?)",
      [codigo_humano, nombre, fecha_ingreso, tonelaje_inicial, estado],
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("[v0] Error creating barco:", error)
    return NextResponse.json({ error: "Error al crear barco" }, { status: 500 })
  }
}
