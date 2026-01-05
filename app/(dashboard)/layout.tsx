import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "@/app/globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { Suspense } from "react"
import { getSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Construnaval - Sistema de Gestión",
  description: "Sistema de gestión para desguace naval",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getSession()
  return (
    <>
      <div className="flex h-screen">
        <Suspense fallback={<div>Cargando...</div>}>
          <AppSidebar user={user} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </Suspense>
      </div>
      <Analytics />
    </>
  )
}
