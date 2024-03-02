import Link from "next/link"
import Image from "next/image"
import { ArrowDown, Database, Github, Lock } from "lucide-react"

import { OAuth } from "@/components/oauth"
import { Toggle } from "@/components/toggle"
import { Separator } from "@/components/ui/separator"

export default () => {
    return (
        <div className="grid lg:flex">
            <div className="lg:grow">
                <div className="w-auto h-screen p-8 space-y-4 flex flex-col justify-center">
                    <div className="flex w-auto h-1/6 rounded-xl outline outline-secondary">
                        <div className="flex">
                            <Lock className="h-8 w-8 lg:h-12 lg:w-12 my-auto mx-8" />
                            <Separator orientation="vertical" className="h-3/4 my-auto" />
                        </div>
                        <p className="m-auto px-6">Schoology data is <b>inaccessible</b> from the server alone.</p>
                    </div>
                    <div className="flex w-auto h-1/6 rounded-xl outline outline-secondary">
                        <div className="flex">
                            <Database className="h-8 w-8 lg:h-12 lg:w-12 my-auto mx-8" />
                            <Separator orientation="vertical" className="h-3/4 my-auto" />
                        </div>
                        <p className="m-auto px-6">User data is <b>never</b> persistently stored.</p>
                    </div>
                    <div className="flex w-auto h-1/6 rounded-xl outline outline-secondary">
                        <div className="flex">
                            <Github className="h-8 w-8 lg:h-12 lg:w-12 my-auto mx-8" />
                            <Separator orientation="vertical" className="h-3/4 my-auto" />
                        </div>
                        <p className="m-auto px-6">
                            Gradar is open-sourced on{" "}
                            <Link href="https://github.com/33tm/Gradar" target="_blank" className="font-bold hover:underline">GitHub</Link>
                            {" "}under{" "}
                            <Link href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank" className="font-bold hover:underline">GPLv3</Link>.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex h-screen order-first lg:order-last lg:w-fit">
                <Separator orientation="vertical" className="hidden lg:block" />
                <div className="m-auto text-center">
                    <h1 className="text-6xl font-bold pb-1 lg:px-48">Gradar</h1>
                    <OAuth />
                    <Toggle icon />
                </div>
                <Link href="https://tttm.us" target="_blank" className="group absolute bottom-0 right-0">
                    <Image
                        src="/art.jpg"
                        alt="tttm"
                        width={100}
                        height={100}
                        className="absolute rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <Image
                        src="/logo.gif"
                        alt="tttm"
                        width={100}
                        height={100}
                        className="invert dark:invert-0 group-hover:opacity-0 transition-opacity duration-500"
                    />
                </Link>
            </div>
            <div className="group absolute w-fit m-auto left-0 right-0 bottom-8 lg:hidden">
                <p className="pb-4 opacity-0 group-hover:opacity-50 transition-opacity duration-500">Scroll</p>
                <ArrowDown className="m-auto animate-bounce" />
            </div>
        </div>
    )
}