"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, SunMoon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const Toggle = ({ icon }: { icon?: boolean }) => {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="secondary"
            className={`m-auto align-top ${icon && "rounded-l-none"}`}
            onClick={() => setTheme({
                light: "dark",
                dark: "system",
                system: "light"
            }[theme as keyof typeof theme])}
        >
            {icon || {
                light: "Light",
                dark: "Dark",
                system: "System"
            }[theme as keyof typeof theme]}
            {{
                light: <Sun className={`w-4 h-4 ${icon || "ml-2"}`} />,
                dark: <Moon className={`w-4 h-4 ${icon || "ml-2"}`} />,
                system: <SunMoon className={`w-4 h-4 ${icon || "ml-2"}`} />
            }[theme as keyof typeof theme]}
        </Button>
    )
}