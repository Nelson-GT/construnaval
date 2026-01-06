"use client"

import { Suspense } from "react"
import UsuariosContent from "@/components/usuarios-content"

export default function UsuariosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      }
    >
      <UsuariosContent />
    </Suspense>
  )
}
