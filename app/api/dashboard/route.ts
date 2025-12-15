import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const resultados = await query(
      `SELECT 
        (SELECT COUNT(*) FROM Barcos WHERE estado = 'Activo') as barcosData,
        (SELECT COUNT(*) FROM Inventario_Materiales) as inventarioMaterialesData,
        (SELECT COUNT(*) FROM Ventas_Salidas) as ventasSalidasData,
        (SELECT COUNT(*) FROM Trabajadores) as trabajadoresData`
    )
    const data = Array.isArray(resultados) ? resultados[0] : resultados
    return NextResponse.json(data)
  } catch (error) {
    console.error("[Dashboard] Error fetching counts:", error)
    return NextResponse.json({ error: "Error al obtener contadores del dashboard" }, { status: 500 })
  }
}