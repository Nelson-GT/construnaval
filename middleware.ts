import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Define qué roles tienen acceso a qué rutas principales
const rolePermissions: Record<string, string[]> = {
  "/produccion": ["admin", "produccion"],
  "/trabajadores": ["admin", "produccion"],
  "/ventas": ["admin", "ventas"],
  "/inventario": ["admin", "produccion", "ventas"], // Ambos pueden ver inventario
  "/usuarios": ["admin"], // Solo admin
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 1. Excluir rutas públicas (login, api, assets, imágenes)
  if (
    path === "/login" ||
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.includes(".") // Para archivos como favicon.ico, images, etc.
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get("session_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "tu_clave_secreta_super_segura")
    const { payload } = await jwtVerify(token, secret)
    
    const userRole = payload.rol as string // 'admin' | 'produccion' | 'ventas'

    // 4. Lógica de Redirección según permisos
    
    // Verificamos cada ruta protegida
    for (const [route, allowedRoles] of Object.entries(rolePermissions)) {
      // Si la ruta actual empieza con una ruta protegida (ej: /ventas/nueva)
      if (path.startsWith(route)) {
        // Si el rol del usuario NO está en la lista permitida
        if (!allowedRoles.includes(userRole)) {
          console.log(`Acceso denegado a ${userRole} en ${path}`)
          // Redirigir al inicio (Dashboard general)
          return NextResponse.redirect(new URL("/", request.url))
        }
      }
    }

    // Si pasa todas las validaciones, permitir acceso
    return NextResponse.next()

  } catch (error) {
    // Si el token es inválido o expiró, borrar cookie y mandar a login
    console.error("Token inválido:", error)
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("session_token")
    return response
  }
}

// Configuración para que el middleware solo se ejecute en las rutas necesarias
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - api (rutas API)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico (icono)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}