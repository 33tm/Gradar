"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ExternalLink, Eye, EyeOff, Plus, RefreshCw, X } from "lucide-react"

import type { Assignment, Data, Period, Error } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Credenza, CredenzaTrigger, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaDescription, CredenzaFooter } from "@/components/ui/credenza"
import { Mismatch } from "@/components/app/mismatch"

export const Grades = ({ course: { course, periods, scales } }: { course: Data }) => {
    const [period, setPeriod] = useState<Period>(periods[0])
    const [original, setOriginal] = useState<Period>(periods[0])
    const [index, setIndex] = useState<number>(0)
    const [error, setError] = useState<Error[]>([])

    const getScale = (sid: number | null) => scales.find(({ id }) => sid === id) || scales[0]

    const numeric = (sid: number | null) => getScale(sid).numeric

    const scaled = (grade: number | null, sid: number | null) => [...getScale(sid).scale].reverse().find(({ cutoff }) => (grade || 0) >= cutoff)?.grade

    const edit = (id: number, options: { grade: number, max: number }) => {
        const categories = period.categories
            .map(category => ({
                ...category,
                assignments: category.assignments
                    .map(assignment => assignment.id === id ? {
                        ...assignment,
                        ...options
                    } : assignment)
            }))

        setPeriod({
            ...period,
            categories
        })
    }

    useEffect(() => {
        setPeriod(periods[index])
        setOriginal(periods[index])
        setError([])
    }, [periods, index])

    useEffect(() => {
        if (error.length) return

        const fixed = (grade: number) => Math.round(grade * 10000) / 100

        const points = (assignments: Assignment[]) => {
            const { grade, max } = assignments.length ? assignments
                .map(({ grade, max }) => ({ grade, max }))
                .reduce(({ grade, max }, assignment) => ({
                    grade: (grade || 0) + (assignment.grade || 0),
                    max: max + assignment.max
                })) : { grade: 0, max: 0 }
            return grade === 0 && max === 0 ? null : fixed((grade || 0) / max)
        }

        const percentage = (assignments: Assignment[]) => assignments.length ?
            Math.floor(assignments
                .map(({ grade, max }) => fixed((grade || 0) / max))
                .reduce((grade, total) => grade + total) / assignments.length * 100) / 100 : null

        if (JSON.stringify(period) === JSON.stringify(original)) {
            const categories = period.categories
                .map(category => {
                    const { title, assignments, grade, weight } = category

                    if (!grade) return category

                    let calculated = [points(assignments), percentage(assignments)]
                    let assignment = assignments

                    while (assignment.length && !calculated.includes(grade)) {
                        assignment = assignment
                            .filter(({ grade, max }) => (grade || 0) / max !== Math.min(
                                ...assignment.map(({ grade, max }) => (grade || 0) / max)))
                        calculated = [points(assignment), percentage(assignment)]
                    }

                    if (!calculated.includes(grade)) {
                        setError([
                            ...error,
                            {
                                category: title,
                                offset: Math.abs(100 - (grade || 0)),
                                weight,
                                dropped: assignments.length - assignment.length
                            }
                        ])

                        console.log([
                            ...error,
                            {
                                category: title,
                                offset: Math.abs(100 - (grade || 0)),
                                weight,
                                dropped: assignments.length - assignment.length
                            }
                        ])
                    }

                    const type = calculated.findIndex(calc => grade === calc) as 0 | 1

                    return {
                        ...category,
                        grade: calculated[type],
                        assignments: assignments.map(object => ({
                            ...object,
                            drop: assignments
                                .filter(({ id: aid }) => !assignment
                                    .some(({ id }) => aid === id)).includes(object)
                        })),
                        type
                    }
                })

            if (JSON.stringify(categories) === JSON.stringify(period.categories)) return

            setPeriod({
                ...period,
                categories
            })
            console.log("auto edit")
        } else {
            console.log("custom edit")
        }
    }, [period, original, error])

    return (
        <div className="grow">
            <Mismatch course={course} error={error} clear={() => setError([])} />
            <div className="sticky top-[69px] z-20 bg-background">
                <div className="p-4">
                    <div className="grid xl:flex">
                        <div>
                            <div className="flex">
                                <p className="text-2xl xl:text-5xl font-bold truncate">{course.title}</p>
                                <Link
                                    href={`https://${localStorage.getItem("subdomain")}.schoology.com/course/${course.id}`}
                                    target="_blank"
                                    className="m-auto opacity-80 ml-2"
                                >
                                    <ExternalLink className="w-4 h-4 xl:w-auto xl:h-auto" />
                                </Link>
                            </div>
                            <p className="text-md xl:text-xl opacity-80 truncate">{course.section}</p>
                        </div>
                        <div className="order-last my-auto">
                            <Select value={index.toString()} onValueChange={i => setIndex(parseInt(i))}>
                                <SelectTrigger className="xl:w-auto xl:ml-4 focus:ring-0 focus:ring-offset-0">
                                    <div className="pr-2">
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        periods.map(({ id, title }, i) => (
                                            <SelectItem key={id} value={i.toString()}>
                                                {title}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator className="my-1 xl:hidden" />
                        <div className={`xl:order-last xl:ml-auto my-auto flex xl:grid ${numeric(period.scale) || "flex"}`}>
                            <p className={`text-center text-xl xl:text-5xl xl:text-center font-bold ${numeric(period.scale) || "my-auto"}`}>{scaled(period.grade, period.scale)}</p>
                            {numeric(period.scale) && <p className="text-xl ml-auto font-bold xl:font-normal opacity-80">{period.grade}%</p>}
                        </div>
                        <Separator className="mt-1 mb-2 xl:hidden" />
                    </div>
                    {numeric(period.scale) && <Progress value={period.grade} className="mt-2 hidden xl:block" />}
                </div>
                <Separator />
            </div>
            <div className="pb-24 xl:pb-4">
                {
                    period.categories
                        .map(({ id, title, grade, weight, assignments }, category) => {
                            return (
                                <div key={id} className="px-4 pt-3">
                                    <div className={`xl:flex text-xl p-2 pl-4 border-2 rounded-lg sticky z-10 bg-background top-[260px] ${numeric(period.scale) ? "xl:top-[214px]" : "xl:top-[190px]"}`}>
                                        <div className="flex w-auto my-auto font-bold">
                                            <p className="truncate">{title}</p>
                                            {typeof weight === "number" && <p className="px-2 ml-auto opacity-80">{weight}%</p>}
                                        </div>
                                        <Separator className="my-1 xl:hidden" />
                                        <div className="flex ml-auto">
                                            <div className="flex my-auto font-bold">
                                                {grade ? (
                                                    <>
                                                        {scaled(grade, period.scale)}
                                                        {numeric(period.scale) && <p className="pl-2 opacity-80">{grade}%</p>}
                                                    </>
                                                ) : <p className="opacity-80">--</p>}
                                            </div>
                                            <Separator orientation="vertical" className="mx-2" />
                                            <Button variant="secondary" size="icon" className="ml-auto h-8 w-8 xl:w-10 xl:h-10">
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {
                                        assignments.map(({ id, title, type, drop, grade, max, scale, comment, due, url, custom }, assignment) => {
                                            const scaledGrade = scaled(((grade || 0) / max) * 100, scale)
                                            const current = original.categories[category].assignments[assignment]

                                            return (
                                                <div key={id} className="flex py-2 px-2.5 border-b-2">
                                                    {/* <GripVertical className="my-auto opacity-50 w-5 h-5" /> */}
                                                    <Credenza>
                                                        <CredenzaTrigger asChild>
                                                            <p className={`font-bold text-left my-auto truncate hover:underline hover:cursor-pointer ${drop && "line-through"}`}>{title}</p>
                                                        </CredenzaTrigger>
                                                        <CredenzaContent>
                                                            <CredenzaHeader>
                                                                <CredenzaTitle>{type}</CredenzaTitle>
                                                                <p className="font-bold text-xl">{title}</p>
                                                                <div className="flex font-semibold">
                                                                    <p className="sm:flex m-auto sm:m-0">
                                                                        {course.title}
                                                                        <p className="sm:pl-1 opacity-80">{course.section}</p>
                                                                    </p>
                                                                </div>
                                                                <Separator />
                                                                {comment && <CredenzaDescription>{comment}</CredenzaDescription>}
                                                                <Separator className={comment || "hidden"} />
                                                                {
                                                                    due && <p className="font-semibold">
                                                                        Due {new Date(due).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                        <p className="opacity-80">{new Date(due).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                                                                    </p>
                                                                }
                                                            </CredenzaHeader>
                                                            <CredenzaFooter>
                                                                <div className="flex w-full">
                                                                    <p className="font-bold my-auto">
                                                                        {numeric(scale) ? `${grade}/${max}` : scaledGrade}
                                                                    </p>
                                                                    {
                                                                        url && (
                                                                            <Link
                                                                                href={url.replace("app", localStorage.getItem("subdomain") || "app")}
                                                                                target="_blank"
                                                                                className="ml-auto"
                                                                            >
                                                                                <Button>
                                                                                    Open in Schoology
                                                                                </Button>
                                                                            </Link>
                                                                        )
                                                                    }
                                                                </div>
                                                            </CredenzaFooter>
                                                        </CredenzaContent>
                                                    </Credenza>
                                                    {
                                                        url && (
                                                            <Link
                                                                href={url.replace("app", localStorage.getItem("subdomain") || "app")}
                                                                target="_blank"
                                                                className="my-auto">
                                                                <ExternalLink className="opacity-80 ml-2 w-4 h-4" />
                                                            </Link>
                                                        )
                                                    }
                                                    <div className="flex ml-auto my-auto">
                                                        {numeric(scale) && <p className="w-8 my-auto font-bold ml-4">{scaledGrade}</p>}
                                                        {
                                                            numeric(scale) ? (
                                                                <div className="flex font-bold">
                                                                    <Input
                                                                        className="w-20 text-center ml-4"
                                                                        value={grade?.toString() || "0"}
                                                                        placeholder={(current.grade || 0).toString()}
                                                                        onChange={({ target }) => edit(id, { grade: parseFloat(target.value || (current.grade || 0).toString()), max })}
                                                                    />
                                                                    <p className="px-2 my-auto opacity-80">/</p>
                                                                    <Input
                                                                        className="w-20 text-center"
                                                                        value={max.toString()}
                                                                        placeholder={current.max.toString()}
                                                                        onChange={({ target }) => edit(id, { grade: grade || 0, max: parseFloat(target.value || current.max.toString()) })}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <Select value={scaledGrade}>
                                                                    <SelectTrigger className="w-[182px] m-auto ml-4 font-bold focus:ring-0 focus:ring-offset-0">
                                                                        <div className="pr-2">
                                                                            <SelectValue />
                                                                        </div>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {
                                                                            scales
                                                                                .find(({ id }) => scale === id)?.scale
                                                                                .map(({ grade }) => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)
                                                                                .reverse()
                                                                        }
                                                                    </SelectContent>
                                                                </Select>
                                                            )
                                                        }
                                                        <Separator orientation="vertical" className="mx-2" />
                                                        <Button variant="secondary" size="icon" onClick={() => { }}>
                                                            {drop ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="ml-2"
                                                            onClick={() => edit(id, { grade: current.grade || 0, max: current.max })}
                                                        >
                                                            {custom ? <X className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                }
            </div>
        </div >
    )
}