import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Trabajador } from "@/lib/mock-data"

export async function GET() {
  try {
    const trabajadores = await query<Trabajador[]>("SELECT * FROM Trabajadores ORDER BY apellido, nombre")
    return NextResponse.json(trabajadores)
  } catch (error) {
    console.error("[v0] Error fetching trabajadores:", error)
    return NextResponse.json({ error: "Error al obtener trabajadores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cedula, nombre, apellido, correo, telefono, direccion, puesto, salario, fecha_contratacion } = body

    const result = await query(
      "INSERT INTO Trabajadores (cedula, nombre, apellido, correo, telefono, direccion, puesto, salario, fecha_contratacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [cedula, nombre, apellido, correo, telefono, direccion, puesto, salario, fecha_contratacion],
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("[v0] Error creating trabajador:", error)
    return NextResponse.json({ error: "Error al crear trabajador" }, { status: 500 })
  }
}
