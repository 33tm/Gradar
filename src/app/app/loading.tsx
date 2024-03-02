import Image from "next/image"

import { Toggle } from "@/components/toggle"
import { Refresh } from "@/components/refresh"
import { Separator } from "@/components/ui/separator"

export default () => {
    return (
        <>
            <div className="flex">
                <div className="flex">
                    <h1 className="font-bold text-3xl p-4">Gradar</h1>
                    <Toggle />
                </div>
                <Refresh loading />
            </div>
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
    )
}