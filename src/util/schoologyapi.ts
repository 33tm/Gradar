import crypto from "crypto"
import OAuth from "oauth-1.0a"

export const schoology = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    uri: string,
    token?: { key: string, secret: string },
    body?: object
) => {
    const url = `https://api.schoology.com/v1${uri}`

    const oauth = new OAuth({
        consumer: {
            key: process.env.SCHOOLOGY_KEY as string,
            secret: process.env.SCHOOLOGY_SECRET as string
        },
        signature_method: "HMAC-SHA1",
        hash_function(base, key) {
            return crypto
                .createHmac("sha1", key)
                .update(base)
                .digest("base64")
        }
    })

    return fetch(url, {
        method,
        cache: "no-store",
        body: JSON.stringify(body),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...oauth.toHeader(oauth.authorize({ url, method }, token))
        }
    }).then(res => {
        if (!res.ok) throw res.status
        return res.headers.get("content-type")?.includes("application/json") ? res.json() : res.text()
    })
}

export const extract = (token: string) => ({
    key: token.split("&")[0].split("=")[1],
    secret: token.split("&")[1].split("=")[1]
})