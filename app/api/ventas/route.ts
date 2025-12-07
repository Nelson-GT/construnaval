import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const ventas = await query(
      `SELECT 
        vs.id_salida,
        vs.numero_guia,
        vs.fecha_salida,
        vs.nombre_comprador,
        vs.destino_ubicacion,
        vs.placa_gandola,
        vs.total,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id_detalle', dv.id_detalle,
            'id_material', dv.id_material,
            'nombre_material', im.nombre_material,
            'cantidad_material', dv.cantidad_material,
            'unidad_medida', im.unidad_medida
          )
        ) as materiales
      FROM Ventas_Salidas vs
      LEFT JOIN Detalles_Venta dv ON vs.id_salida = dv.id_salida
      LEFT JOIN Inventario_Materiales im ON dv.id_material = im.id_material
      GROUP BY vs.id_salida
      ORDER BY vs.fecha_salida DESC`,
    )
    return NextResponse.json(ventas)
  } catch (error) {
    console.error("[v0] Error fetching ventas:", error)
    return NextResponse.json({ error: "Error al obtener ventas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { numero_guia, fecha_salida, nombre_comprador, destino_ubicacion, placa_gandola, total, materiales } = body

    if (!materiales || materiales.length === 0) {
      return NextResponse.json({ error: "Debe añadir al menos un material" }, { status: 400 })
    }

    const result = await query(
      "INSERT INTO Ventas_Salidas (numero_guia, fecha_salida, nombre_comprador, destino_ubicacion, placa_gandola, total) VALUES (?, ?, ?, ?, ?, ?)",
      [numero_guia, fecha_salida, nombre_comprador, destino_ubicacion, placa_gandola, total],
    )

    const ventaId = (result as any).insertId

    for (const material of materiales) {
      // Insert material detail
      await query("INSERT INTO Detalles_Venta (id_salida, id_material, cantidad_material) VALUES (?, ?, ?)", [
        ventaId,
        material.id_material,
        material.cantidad_material,
      ])

      await query("UPDATE Inventario_Materiales SET stock_actual = stock_actual - ? WHERE id_material = ?", [
        material.cantidad_material,
        material.id_material,
      ])
    }

    return NextResponse.json({ success: true, id_salida: ventaId })
  } catch (error) {
    console.error("[v0] Error creating venta:", error)
    return NextResponse.json({ error: "Error al crear venta" }, { status: 500 })
  }
}
