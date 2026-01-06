import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const usuarios = await query(
      `SELECT id_usuario, username, nombre_completo, rol, fecha_creacion, estado FROM Usuarios ORDER BY fecha_creacion DESC`,
    )
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error("[v0] Error fetching usuarios:", error)
    return NextResponse.json({ error: "Error fetching usuarios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, nombre_completo, rol } = body

    if (!username || !password || !rol) {
      return NextResponse.json({ error: "username, password, and rol are required" }, { status: 400 })
    }

    // Hash password with bcrypt
    const password_hash = await bcrypt.hash(password, 10)

    await query(
      `INSERT INTO Usuarios (username, password_hash, nombre_completo, rol, estado) 
        VALUES (?, ?, ?, ?, TRUE)`,
      [username, password_hash, nombre_completo, rol],
    )

    return NextResponse.json({ success: true, message: "Usuario created successfully" })
  } catch (error: any) {
    console.error("[v0] Error creating usuario:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error creating usuario" }, { status: 500 })
  }
}
