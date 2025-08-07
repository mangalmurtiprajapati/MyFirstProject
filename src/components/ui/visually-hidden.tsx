"use client"

import * as React from "react"
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden"

import { cn } from "@/lib/utils"

const VisuallyHidden = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentProps<"div"> & {
    asChild?: boolean
  }
>(({ asChild = false, ...props }, ref) => {
  return (
    <VisuallyHiddenPrimitive.Root ref={ref} {...props} asChild={asChild} />
  )
})
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }

    