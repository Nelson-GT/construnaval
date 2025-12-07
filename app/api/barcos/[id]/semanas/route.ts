import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Obtener todas las semanas de un barco
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const semanas = await query(
      `SELECT s.*, 
        (SELECT COUNT(*) FROM Semana_Personal WHERE id_semana = s.id_semana) as total_trabajadores,
        (SELECT COUNT(*) FROM Materiales_Consumidos WHERE id_semana = s.id_semana) as total_consumos
       FROM Semanas_Barco s 
       WHERE s.id_barco = ? 
       ORDER BY s.numero_semana DESC`,
      [params.id],
    )

    return NextResponse.json(semanas)
  } catch (error) {
    console.error("[v0] Error fetching semanas:", error)
    return NextResponse.json({ error: "Error al obtener las semanas" }, { status: 500 })
  }
}

// POST - Crear nueva semana para un barco
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { fecha_inicio, trabajadores } = body

    // Calcular fecha_fin (7 días después)
    const fechaInicio = new Date(fecha_inicio)
    const fechaFin = new Date(fechaInicio)
    fechaFin.setDate(fechaFin.getDate() + 7)

    // Obtener el número de semana (última semana + 1)
    const ultimaSemana: any = await query(
      "SELECT MAX(numero_semana) as max_semana FROM Semanas_Barco WHERE id_barco = ?",
      [params.id],
    )
    const numeroSemana = (ultimaSemana[0]?.max_semana || 0) + 1

    // Crear la semana
    const result: any = await query(
      "INSERT INTO Semanas_Barco (id_barco, numero_semana, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
      [params.id, numeroSemana, fecha_inicio, fechaFin.toISOString().split("T")[0]],
    )

    const idSemana = result.insertId

    // Asignar trabajadores a la semana
    if (trabajadores && trabajadores.length > 0) {
      for (const idTrabajador of trabajadores) {
        await query("INSERT INTO Semana_Personal (id_semana, id_trabajador) VALUES (?, ?)", [idSemana, idTrabajador])
      }
    }

    return NextResponse.json({ id_semana: idSemana, numero_semana: numeroSemana }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating semana:", error)
    return NextResponse.json({ error: "Error al crear la semana" }, { status: 500 })
  }
}
