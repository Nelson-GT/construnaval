import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const ventas = await query(
      `SELECT 
        vs.id_salida,
        vs.numero_guia,
        vs.acto_inspeccion,
        vs.codigo_control,
        vs.fecha_salida,
        vs.nombre_comprador,
        vs.destino_ubicacion,
        vs.placa_gandola,
        vs.total,
        vs.modo_venta,
        vs.empresa_solicitante,
        vs.rif,
        vs.conductor_nombre,
        vs.conductor_ci,
        vs.tractor_marca,
        vs.tractor_modelo,
        vs.tractor_color,
        vs.tractor_placa,
        vs.batea_modelo,
        vs.batea_color,
        vs.batea_placa,
        vs.origen_direccion,
        vs.destino_direccion,
        vs.fecha_validez_inicio,
        vs.fecha_validez_fin,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id_detalle', dv.id_detalle,
            'id_material', dv.id_material,
            'nombre_material', im.nombre_material,
            'cantidad_material', dv.cantidad_material,
            'descripcion_material', dv.descripcion_material,
            'peso', dv.peso,
            'unidad_medida', COALESCE(dv.unidad_medida, im.unidad_medida)
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
    const {
      numero_guia,
      fecha_salida,
      nombre_comprador,
      destino_ubicacion,
      placa_gandola,
      total,
      modo_venta,
      empresa_solicitante,
      rif,
      conductor_nombre,
      conductor_ci,
      tractor_marca,
      tractor_modelo,
      tractor_color,
      tractor_placa,
      batea_modelo,
      batea_color,
      batea_placa,
      origen_direccion,
      destino_direccion,
      fecha_validez_inicio,
      fecha_validez_fin,
      materiales,
    } = body

    if (!materiales || materiales.length === 0) {
      return NextResponse.json({ error: "Debe añadir al menos un material" }, { status: 400 })
    }

    // 1. INSERTAR CABECERA (VENTA)
    const result = await query(
      `INSERT INTO Ventas_Salidas (
        numero_guia, fecha_salida, nombre_comprador, destino_ubicacion, placa_gandola, total,
        modo_venta, empresa_solicitante, rif, conductor_nombre, conductor_ci,
        tractor_marca, tractor_modelo, tractor_color, tractor_placa,
        batea_modelo, batea_color, batea_placa, origen_direccion, destino_direccion,
        fecha_validez_inicio, fecha_validez_fin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numero_guia,
        fecha_salida,
        nombre_comprador,
        destino_ubicacion ?? "",
        placa_gandola ?? null,
        total ?? 0,
        modo_venta ?? null,
        empresa_solicitante ?? null,
        rif ?? null,
        conductor_nombre ?? null,
        conductor_ci ?? null,
        tractor_marca ?? null,
        tractor_modelo ?? null,
        tractor_color ?? null,
        tractor_placa ?? null,
        batea_modelo ?? null,
        batea_color ?? null,
        batea_placa ?? null,
        origen_direccion ?? null,
        destino_direccion ?? null,
        fecha_validez_inicio ?? null,
        fecha_validez_fin ?? null,
      ],
    )

    const ventaId = (result as any).insertId

    for (const material of materiales) {
      if (modo_venta === "From Inventory") {
        // --- MODO INVENTARIO ---
        const currentStock = await query("SELECT stock_actual FROM Inventario_Materiales WHERE id_material = ?", [
          material.id_material,
        ])

        if (!currentStock || currentStock.length === 0 || currentStock[0].stock_actual < material.cantidad_material) {
             // Nota: Validamos que currentStock tenga datos para evitar crash si el ID no existe
          return NextResponse.json(
            { error: `Stock insuficiente para material ID ${material.id_material}` },
            { status: 400 },
          )
        }
        await query(
          "INSERT INTO Detalles_Venta (id_salida, id_material, cantidad_material, unidad_medida, peso) VALUES (?, ?, ?, ?, ?)",
          [
            ventaId, 
            material.id_material, 
            material.cantidad_material ?? 0, 
            material.unidad_medida ?? null, 
            material.peso ?? 0
          ],
        )

        // Decrement stock
        await query("UPDATE Inventario_Materiales SET stock_actual = stock_actual - ? WHERE id_material = ?", [
          material.cantidad_material,
          material.id_material,
        ])
      } else {
        // --- MODO VENTA DIRECTA ---
        await query(
          "INSERT INTO Detalles_Venta (id_salida, cantidad_material, descripcion_material, peso, unidad_medida) VALUES (?, ?, ?, ?, ?)",
          [
            ventaId, 
            material.cantidad_material ?? 0, 
            material.descripcion_material ?? "", 
            material.peso ?? 0, 
            material.unidad_medida ?? null
          ],
        )
      }
    }

    return NextResponse.json({ success: true, id_salida: ventaId })
  } catch (error) {
    console.error("[v0] Error creating venta:", error)
    return NextResponse.json({ error: "Error al crear venta" }, { status: 500 })
  }
}