import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Obtener detalles de una semana específica
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Obtener información de la semana
    const { id } = await params;
    const semana: any = await query("SELECT * FROM Semanas_Barco WHERE id_semana = ?", [id])

    if (!semana || semana.length === 0) {
      return NextResponse.json({ error: "Semana no encontrada" }, { status: 404 })
    }

    // Obtener materiales consumidos con información del material
    const consumos = await query(
      `SELECT mc.*, im.nombre_material, im.tipo_material, im.unidad_medida
       FROM Materiales_Consumidos mc
       JOIN Inventario_Materiales im ON mc.id_material = im.id_material
       WHERE mc.id_semana = ?
       ORDER BY mc.fecha_registro DESC`,
      [id],
    )

    // Obtener personal asignado
    const personal = await query(
      `SELECT sp.*, t.nombre, t.apellido, t.puesto, t.cedula
       FROM Semana_Personal sp
       JOIN Trabajadores t ON sp.id_trabajador = t.id_trabajador
       WHERE sp.id_semana = ?`,
      [id],
    )

    return NextResponse.json({
      semana: semana[0],
      consumos,
      personal,
    })
  } catch (error) {
    console.error("[v0] Error fetching semana details:", error)
    return NextResponse.json({ error: "Error al obtener detalles de la semana" }, { status: 500 })
  }
}
