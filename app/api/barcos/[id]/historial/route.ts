import { NextResponse } from "next/server"
import { query } from "@/lib/db"

interface HistorialSemanal {
  semana: number
  fecha_inicio: string
  fecha_fin: string
  materiales_consumidos: any[]
  materiales_obtenidos: any[]
  personal_asignado: any[]
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Obtener información del barco
    const barcos = await query("SELECT * FROM Barcos WHERE id_barco = ?", [id])
    if (!Array.isArray(barcos) || barcos.length === 0) {
      return NextResponse.json({ error: "Barco no encontrado" }, { status: 404 })
    }
    const barco = barcos[0]

    // Obtener materiales consumidos
    const materialesConsumidos = await query(
      `SELECT mc.*, im.nombre_material 
       FROM Materiales_Consumidos mc
       JOIN Inventario_Materiales im ON mc.id_material = im.id_material
       WHERE mc.id_barco = ?
       ORDER BY mc.fecha_registro`,
      [id],
    )

    // Obtener materiales obtenidos
    const materialesObtenidos = await query(
      "SELECT * FROM Materiales_Obtenidos WHERE id_barco = ? ORDER BY fecha_registro",
      [id],
    )

    // Obtener personal asignado
    const personalAsignado = await query(
      `SELECT bp.*, t.nombre, t.apellido, t.puesto 
       FROM Barco_Personal bp
       JOIN Trabajadores t ON bp.id_trabajador = t.id_trabajador
       WHERE bp.id_barco = ?
       ORDER BY bp.fecha_inicio`,
      [id],
    )

    // Calcular historial por semanas
    const fechaIngreso = new Date(barco.fecha_ingreso)
    const ahora = new Date()
    const historialSemanal: HistorialSemanal[] = []

    // Calcular número de semanas desde el ingreso
    const diffTime = Math.abs(ahora.getTime() - fechaIngreso.getTime())
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))

    for (let semana = 1; semana <= diffWeeks; semana++) {
      const fechaInicioSemana = new Date(fechaIngreso)
      fechaInicioSemana.setDate(fechaInicioSemana.getDate() + (semana - 1) * 7)

      const fechaFinSemana = new Date(fechaInicioSemana)
      fechaFinSemana.setDate(fechaFinSemana.getDate() + 6)

      // Filtrar datos de esta semana
      const consumidosSemana = Array.isArray(materialesConsumidos)
        ? materialesConsumidos.filter((m: any) => {
            const fecha = new Date(m.fecha_registro)
            return fecha >= fechaInicioSemana && fecha <= fechaFinSemana
          })
        : []

      const obtenidosSemana = Array.isArray(materialesObtenidos)
        ? materialesObtenidos.filter((m: any) => {
            const fecha = new Date(m.fecha_registro)
            return fecha >= fechaInicioSemana && fecha <= fechaFinSemana
          })
        : []

      const personalSemana = Array.isArray(personalAsignado)
        ? personalAsignado.filter((p: any) => {
            const fechaInicio = new Date(p.fecha_inicio)
            const fechaFin = p.fecha_fin ? new Date(p.fecha_fin) : ahora
            return fechaInicio <= fechaFinSemana && fechaFin >= fechaInicioSemana
          })
        : []

      // Solo agregar semanas con actividad
      if (consumidosSemana.length > 0 || obtenidosSemana.length > 0 || personalSemana.length > 0) {
        historialSemanal.push({
          semana,
          fecha_inicio: fechaInicioSemana.toISOString().split("T")[0],
          fecha_fin: fechaFinSemana.toISOString().split("T")[0],
          materiales_consumidos: consumidosSemana,
          materiales_obtenidos: obtenidosSemana,
          personal_asignado: personalSemana,
        })
      }
    }

    return NextResponse.json({
      barco,
      historial_semanal: historialSemanal,
    })
  } catch (error) {
    console.error("[v0] Error fetching historial:", error)
    return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 })
  }
}
