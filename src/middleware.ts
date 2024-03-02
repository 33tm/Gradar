import { type NextRequest, NextResponse } from "next/server"

export default (request: NextRequest) => {
    const { nextUrl } = request
    if (nextUrl.searchParams.get("oauth_token")) {
        nextUrl.searchParams.delete("oauth_token")
        return NextResponse.redirect(nextUrl)
    }
}