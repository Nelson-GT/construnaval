"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function LoadingButton({
  isLoading = false,
  loadingText = "Procesando...",
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={isLoading || disabled}>
      {isLoading ? loadingText : children}
    </Button>
  )
}
