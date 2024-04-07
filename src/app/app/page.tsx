import { cookies } from "next/headers"
// import { redirect } from "next/navigation"

import { App } from "@/app/app/app"
import { Toggle } from "@/components/toggle"
import { Refresh } from "@/components/refresh"
import { Separator } from "@/components/ui/separator"

const data = async () => {
    return fetch(`${process.env.NODE_ENV === "production" ? "https://gradar.tttm.us" : "http://localhost:3000"}/grades`, {
        method: "POST",
        cache: "no-store",
        headers: { Cookie: cookies().toString() }
    }).then(res => {
        if (res.ok) return res.json()
        console.log(res)
        return []
    })
}

export default async () => {
    return (
        <div className="h-screen">
            <div className="sticky top-0 z-20 bg-background">
                <div className="flex w-screen">
                    <div className="flex">
                        <h1 className="font-bold text-3xl p-4">Gradar</h1>
                        <Toggle />
                    </div>
                    <Refresh />
                </div>
                <Separator />
            </div>
            <App data={await data()} />
        </div>
    )
}