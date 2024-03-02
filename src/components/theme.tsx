"use client"

import type { ThemeProviderProps } from "next-themes/dist/types"
import { ThemeProvider } from "next-themes"
import { useEffect, useState } from "react"

export default ({ children, ...props }: ThemeProviderProps) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return <ThemeProvider {...props}>{children}</ThemeProvider>
}