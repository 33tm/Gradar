"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

import { App } from "@/app/app/app"
import { Toggle } from "@/components/toggle"
import { Refresh } from "@/components/refresh"
import { Separator } from "@/components/ui/separator"

export default () => {
    const [data, setData] = useState()

    useEffect(() => {
        fetch(`${process.env.NODE_ENV === "production" ? "https://gradar.tttm.us" : "http://localhost:3000"}/grades`, {
            method: "POST",
            headers: { Cookie: document.cookie }
        }).then(async res => res.ok ? setData(await res.json()) : window.location.href = "/")
    }, [])

    return (
        <div className="h-screen">
            <div className="sticky top-0 z-20 bg-background">
                <div className="flex w-screen">
                    <div className="flex">
                        <h1 className="font-bold text-3xl p-4">Gradar</h1>
                        <Toggle />
                    </div>
                    <Refresh loading={!data} />
                </div>
                <Separator />
            </div>
            {data ? <App data={data} /> : (
                <>
                    <Separator />
                    <div className="flex h-[calc(100vh-69px)]">
                        <Image
                            priority
                            src="/loading.gif"
                            alt="loading"
                            width="150"
                            height="150"
                            className="m-auto invert dark:invert-0"
                        />
                    </div>
                </>
            )}
        </div>
    )
}