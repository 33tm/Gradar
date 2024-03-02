"use client"

import { useEffect, useState, useTransition } from "react"
import { RefreshCw } from "lucide-react"

import { oauth } from "@/oauth"
import { Button } from "@/components/ui/button"

export const Refresh = ({ loading = false }: { loading?: boolean }) => {
    const [initial] = useState(Date.now())
    const [time, setTime] = useState(Date.now())
    const [isPending, startTransition] = useTransition()

    const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" })

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(Date.now())
            console.log(time)
        }, 1000)
        return () => clearInterval(interval)
    }, [time])

    return (
        <div className="flex ml-auto pr-4">
            <Button
                variant="outline"
                className="m-auto rounded-r-none pointer-events-none hidden sm:block"
                disabled={isPending || loading}
            >
                {(isPending || loading) ? "Fetching..." : `Fetched ${(() => {
                    for (const { unit, ms } of [
                        { unit: "year", ms: 31536000000 },
                        { unit: "month", ms: 2592000000 },
                        { unit: "week", ms: 604800000 },
                        { unit: "day", ms: 86400000 },
                        { unit: "hour", ms: 3600000 },
                        { unit: "minute", ms: 60000 },
                        { unit: "second", ms: 1000 }
                    ])
                        if (Math.abs(initial - time) >= ms || unit === "second")
                            return rtf.format(Math.round((initial - time) / ms), unit as Intl.RelativeTimeFormatUnit)
                })()}`}
            </Button>
            <Button
                variant="default"
                className="m-auto sm:rounded-l-none"
                onClick={() => startTransition(() => oauth(localStorage.getItem("subdomain") || "app"))}
                disabled={isPending || loading}
            >
                <RefreshCw className={`${(isPending || loading) && "animate-spin"} w-4 h-4`} />
            </Button>
        </div >
    )
}