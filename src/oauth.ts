"use server"

import crypto from "crypto"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/util/prisma"
import { schoology, extract } from "@/util/schoologyapi"

export const oauth = async (subdomain: string) => {
    const nonce = crypto.randomBytes(32).toString("hex")
    const { key, secret } = await schoology("GET", "/oauth/request_token").then(token => extract(token as string))

    await db.schoology.create({ data: { nonce, secret } })

    cookies().set("nonce", nonce, { path: "/", expires: Date.now() + 10 * 60 * 1000, httpOnly: true, secure: true, sameSite: "strict" })
    cookies().set("key", key, { path: "/", expires: Date.now() + 10 * 60 * 1000, httpOnly: true, secure: true, sameSite: "strict" })

    redirect(`https://${subdomain}.schoology.com/oauth/authorize?oauth_token=${key}&oauth_callback=${process.env.NODE_ENV === "production" ? "gradar.tttm.us/app" : "tttm.us/callback/app"}`)
}