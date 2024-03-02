"use client"

import type { Course, Error } from "@/types"
import { Credenza, CredenzaBody, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle } from "@/components/ui/credenza"

export const Mismatch = ({ course, error, clear }: { course: Course, error: Error[], clear: () => void }) => {
    return (
        <Credenza open={!!error.length} onOpenChange={clear}>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle>Grade Mismatch</CredenzaTitle>
                    <div className="flex font-bold text-xl m-auto sm:m-0">
                        <p className="font-bold text-xl">
                            {course.title}
                        </p>
                        &nbsp;
                        <p className="opacity-80">{course.section}</p>
                    </div>
                </CredenzaHeader>
                <CredenzaBody>
                    <div className="font-mono bg-secondary rounded-sm px-3 py-1">
                        <div className="flex font-bold">
                            <p>Category</p>
                            <div className="ml-auto opacity-80">
                                Weight
                                Offset
                                Drop
                            </div>
                        </div>
                        {
                            error.map(({ category, offset, weight, dropped }) => (
                                <div key={category} className="flex">
                                    <p className="font-medium">{category}</p>
                                    <div className="flex ml-auto opacity-80">
                                        <p>{weight ? `${weight.toPrecision(4)}%` : "??????"}</p>
                                        &nbsp;
                                        <p>{offset.toPrecision(4)}%</p>
                                        &nbsp;
                                        <p>{dropped.toString().padStart(4, "0")}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </CredenzaBody>
                <CredenzaDescription>
                    {(() => {
                        const time = new Date()
                        const [day, month, year] = [
                            time.toLocaleDateString([], { day: "numeric" }),
                            time.toLocaleDateString([], { month: "numeric" }),
                            time.toLocaleDateString([], { year: "numeric" })
                        ]
                        return `${year}.${month}.${day} ${time.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}`
                    })()}
                </CredenzaDescription>
            </CredenzaContent>
        </Credenza>
    )
}