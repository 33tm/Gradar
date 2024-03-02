"use client"

import { useState } from "react"

import type { Data } from "@/types"
import { Grades } from "@/app/app/grades"
import { Courses } from "@/components/app/courses"
import { Separator } from "@/components/ui/separator"

export const App = ({ data }: { data: Data[] }) => {
    const [index, setIndex] = useState<number>(0)

    if (!data.length) return <div className="flex h-[calc(100vh-69px)]"><p className="m-auto font-semibold">No Grades Found!</p></div>

    return (
        <>
            <Separator orientation="vertical" className="h-auto" />
            <Grades course={data[index]} />
            <Courses data={data} index={index} setIndex={setIndex} />
        </>
    )
}