export type Data = {
    course: Course
    periods: Period[],
    scales: Scale[]
}

export type Course = {
    id: string
    title: string
    section: string
    picture: string
}

export type Period = {
    id: string
    title: string
    grade: number | null
    scale: number | null
    categories: Category[]
}

export type Category = {
    id: number
    title: string
    type: 0 | 1
    grade: number | null
    weight: number
    assignments: Assignment[]
}

export type Assignment = {
    id: number
    title: string
    type: string
    drop: boolean
    grade: number | null
    max: number
    scale: number | null
    comment: string | null
    due: Date
    url: string
    custom: boolean
}

export type Scale = {
    id: number
    numeric: boolean
    scale: {
        grade: string
        cutoff: number
    }[]
}

export type Error = {
    category: string,
    offset: number,
    weight: number,
    dropped: number
}