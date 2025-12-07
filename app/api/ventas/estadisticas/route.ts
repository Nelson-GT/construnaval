import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Last month's date range
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Ventas último mes
    const ventasResult = await query<any[]>(
      `SELECT COUNT(*) as total FROM Ventas_Salidas 
        WHERE MONTH(fecha_salida) = ? AND YEAR(fecha_salida) = ?`,
      [lastMonth.getMonth() + 1, lastMonth.getFullYear()],
    )

    // Total ingresos último mes
    const ingresosResult = await query<any[]>(
      `SELECT COALESCE(SUM(total), 0) as total FROM Ventas_Salidas 
        WHERE MONTH(fecha_salida) = ? AND YEAR(fecha_salida) = ?`,
      [lastMonth.getMonth() + 1, lastMonth.getFullYear()],
    )

    // Comprador con más ventas
    const compradorResult = await query<any[]>(
      `SELECT nombre_comprador, COUNT(*) as cantidad FROM Ventas_Salidas 
        WHERE MONTH(fecha_salida) = ? AND YEAR(fecha_salida) = ?
        GROUP BY nombre_comprador ORDER BY cantidad DESC LIMIT 1`,
      [lastMonth.getMonth() + 1, lastMonth.getFullYear()],
    )

    // Material con más ventas
    const materialResult = await query<any[]>(
      `SELECT im.nombre_material, SUM(dv.cantidad_material) as total_cantidad 
        FROM Detalles_Venta dv
        JOIN Inventario_Materiales im ON dv.id_material = im.id_material
        JOIN Ventas_Salidas vs ON dv.id_salida = vs.id_salida
        WHERE MONTH(vs.fecha_salida) = ? AND YEAR(vs.fecha_salida) = ?
        GROUP BY dv.id_material ORDER BY total_cantidad DESC LIMIT 1`,
      [lastMonth.getMonth() + 1, lastMonth.getFullYear()],
    )

    return NextResponse.json({
      ventasUltimoMes: ventasResult[0]?.total || 0,
      totalIngresos: ingresosResult[0]?.total || 0,
      compradorTop: compradorResult[0],
      materialTop: materialResult[0],
    })
  } catch (error) {
    console.error("[v0] Error fetching sales stats:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
