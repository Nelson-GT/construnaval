import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 1. Buscar usuario en BD
    // Nota: Asegúrate de que tu query devuelve un array
    const usuarios: any = await query("SELECT * FROM Usuarios WHERE username = ?", [username])

    if (!usuarios || usuarios.length === 0) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const usuario = usuarios[0]

    // 2. Comparar contraseña (hash vs texto plano)
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // 3. Crear el Token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secreto_super_seguro")
    const token = await new SignJWT({
      id: usuario.id_usuario,
      username: usuario.username,
      nombre: usuario.nombre_completo,
      rol: usuario.rol, // <--- Importante para el middleware
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h") // La sesión dura 8 horas
      .sign(secret)

    // 4. Guardar en Cookie
    const cookieStore = await cookies()
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, 
      path: "/",
    })

    return NextResponse.json({ success: true, rol: usuario.rol })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}