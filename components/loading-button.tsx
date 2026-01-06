"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

type ButtonProps = React.ComponentProps<typeof Button>

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
}

export function LoadingButton({
  isLoading = false,
  loadingText = "Procesando...",
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading ? loadingText : children}
    </Button>
  )
}