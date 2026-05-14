"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-foreground group-[.toaster]:border-border shadow-lg ring-1 ring-border",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary-500 group-[.toast]:text-white font-medium hover:group-[.toast]:bg-primary-600 transition-colors",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: 
            "group-[.toast]:bg-surface group-[.toast]:text-foreground group-[.toast]:border-border hover:group-[.toast]:bg-surface-alt !left-auto !right-0 !translate-x-[35%]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
