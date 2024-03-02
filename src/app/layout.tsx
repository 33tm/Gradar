import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/app/style.css"
import Theme from "@/components/theme"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Gradar",
    description: "Gradar: Schoology Grade Calculator"
}

export default ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Theme
                    attribute="class"
                    defaultTheme="system"
                    disableTransitionOnChange
                    enableSystem
                >
                    {children}
                </Theme>
            </body>
        </html>
    )
}
