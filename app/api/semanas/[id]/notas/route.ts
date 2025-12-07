import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Obtener notas de una semana
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const notas = await query(
      `SELECT * FROM Notas_Semana 
       WHERE id_semana = ? 
       ORDER BY fecha_nota DESC`,
      [params.id],
    )

    return NextResponse.json(notas)
  } catch (error) {
    console.error("[v0] Error fetching notas:", error)
    return NextResponse.json({ error: "Error al obtener notas" }, { status: 500 })
  }
}

// POST - Crear nueva nota
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { titulo, descripcion, fecha_nota } = body

    const result = await query(
      `INSERT INTO Notas_Semana (id_semana, titulo, descripcion, fecha_nota) 
       VALUES (?, ?, ?, ?)`,
      [params.id, titulo, descripcion, fecha_nota],
    )

    return NextResponse.json({ success: true, id: (result as any).insertId })
  } catch (error) {
    console.error("[v0] Error creating nota:", error)
    return NextResponse.json({ error: "Error al crear nota" }, { status: 500 })
  }
}
