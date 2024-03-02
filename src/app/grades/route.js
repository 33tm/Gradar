import { cookies } from "next/headers"

import { db } from "@/util/prisma"
import { extract, schoology } from "@/util/schoologyapi"

export const POST = async () => {
    const { nonce, key } = cookies()
        .getAll()
        .reduce((object, { name, value }) =>
            Object.assign(object, { [name]: value }), {})

    if (!nonce || !key) return new Response(null, { status: 400 })

    try {
        const { secret } = await db.schoology.findUniqueOrThrow({ where: { nonce } })

        db.schoology.delete({ where: { nonce } })

        const token = await schoology("GET", "/oauth/access_token", { key, secret }).then(extract)

        const { api_uid: uid } = await schoology("GET", "/app-user-info", token)

        const sections = await schoology("GET", `/users/${uid}/sections`, token)
            .then(({ section }) => section.map(({ id, course_title, section_title, profile_url }) => ({
                id,
                title: course_title,
                section: section_title,
                picture: profile_url
            })))

        const courses = await Promise.all(sections
            .map(({ id }) => schoology("GET", `/users/${uid}/grades?section_id=${id}`, token)))
            .then(data => data
                .map(({ section }, i) => ({ ...section[0], ...sections[i] }))
                .filter(({ section_id }) => section_id))

        const assignments = await Promise.all(courses
            .map(({ id }) => schoology("GET", `/sections/${id}/grade_items?start=0&limit=200`, token)
                .then(async ({ assignment, total }) => [
                    ...assignment,
                    ...total > 200 ? await Promise.all([...Array(Math.floor(total / 200)).keys()]
                        .map(i => schoology("GET", `/sections/${id}/grade_items?start=${(i + 1) * 200}&limit=200`, token)))
                        .then(data => data[0].assignment) : []
                ])))

        const scales = await Promise.all(courses
            .map(({ id }) => schoology("GET", `/sections/${id}/grading_scales`, token)
                .then(({ grading_scale }) => grading_scale
                    .map(({ id, hide_numeric, scale }) => ({
                        id,
                        numeric: !hide_numeric,
                        scale: scale.level
                            .map(({ grade, cutoff }) => ({ grade, cutoff }))
                    })))))

        const periods = courses
            .map(({ final_grade, grading_category, period }, i) => period
                .map(({ assignment, period_id, period_title }) => {
                    const final = final_grade.find(({ period_id: id }) => period_id === id)
                    return final && {
                        id: period_id,
                        title: period_title,
                        grade: final.grade,
                        scale: final.scale_id,
                        categories: grading_category
                            .map(({ id, title, weight }) => ({
                                id,
                                title,
                                grade: final.grading_category.find(({ category_id }) => id === category_id)?.grade,
                                weight,
                                assignments: assignment
                                    .filter(({ category_id }) => id === category_id)
                                    .map(assignment => ({
                                        ...assignment,
                                        ...assignments[i].find(({ id }) => assignment.assignment_id === id)
                                    }))
                                    .map(({ assignment_id, title, type, grade, max_points, scale_id, comment, due, web_url }) => ({
                                        id: assignment_id,
                                        title,
                                        type: type
                                            .split("_")
                                            .map(type => type.charAt(0).toUpperCase() + type.slice(1))
                                            .join(" "),
                                        grade,
                                        max: parseInt(max_points),
                                        scale: scale_id,
                                        comment,
                                        due: new Date(Date.parse(due)),
                                        url: web_url,
                                        custom: false
                                    }))
                            }))
                    }
                })
                .filter(period => period))

        const data = courses.map(({ id: cid }, i) => ({
            course: sections.find(({ id }) => cid === id),
            periods: periods[i],
            scales: scales[i]
        }))

        return new Response(JSON.stringify(data))
    } catch (error) {
        return new Response(null, { status: error && typeof error === "number" ? error : 500 })
    }
}