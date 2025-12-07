import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Obtener información del barco
    const barcos = await query("SELECT * FROM Barcos WHERE id_barco = ?", [id])
    if (!Array.isArray(barcos) || barcos.length === 0) {
      return NextResponse.json({ error: "Barco no encontrado" }, { status: 404 })
    }
    const barco = barcos[0]

    // Obtener todas las semanas
    const semanas = await query(
      `SELECT * FROM Semanas_Barco 
       WHERE id_barco = ? 
       ORDER BY numero_semana`,
      [id],
    )

    // Obtener todos los eventos y ordenarlos cronológicamente
    const eventos: any[] = []

    // Agregar consumos
    const consumos = await query(
      `SELECT mc.*, im.nombre_material, im.unidad_medida, im.tipo_material, sb.numero_semana
       FROM Materiales_Consumidos mc
       JOIN Inventario_Materiales im ON mc.id_material = im.id_material
       JOIN Semanas_Barco sb ON mc.id_semana = sb.id_semana
       WHERE sb.id_barco = ?
       ORDER BY mc.fecha_registro`,
      [id],
    )
    if (Array.isArray(consumos)) {
      consumos.forEach((c: any) => {
        eventos.push({
          tipo: "consumo",
          fecha: c.fecha_registro,
          semana: c.numero_semana,
          datos: c,
        })
      })
    }

    // Agregar notas
    const notas = await query(
      `SELECT n.*, sb.numero_semana
       FROM Notas_Semana n
       JOIN Semanas_Barco sb ON n.id_semana = sb.id_semana
       WHERE sb.id_barco = ?
       ORDER BY n.fecha_nota`,
      [id],
    )
    if (Array.isArray(notas)) {
      notas.forEach((n: any) => {
        eventos.push({
          tipo: "nota",
          fecha: n.fecha_nota,
          semana: n.numero_semana,
          datos: n,
        })
      })
    }

    // Agregar asignaciones de personal
    const personal = await query(
      `SELECT sp.*, t.nombre, t.apellido, t.puesto, sb.numero_semana, sb.fecha_inicio
       FROM Semana_Personal sp
       JOIN Trabajadores t ON sp.id_trabajador = t.id_trabajador
       JOIN Semanas_Barco sb ON sp.id_semana = sb.id_semana
       WHERE sb.id_barco = ?
       ORDER BY sb.fecha_inicio`,
      [id],
    )
    if (Array.isArray(personal)) {
      personal.forEach((p: any) => {
        eventos.push({
          tipo: "personal",
          fecha: p.fecha_inicio,
          semana: p.numero_semana,
          datos: p,
        })
      })
    }

    // Ordenar todos los eventos por fecha
    eventos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

    return NextResponse.json({
      barco,
      semanas,
      eventos,
    })
  } catch (error) {
    console.error("[v0] Error fetching historial completo:", error)
    return NextResponse.json({ error: "Error al obtener historial completo" }, { status: 500 })
  }
}
