"use client"

import { useTransition } from "react"
import { Loader2 } from "lucide-react"

import { oauth } from "@/oauth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Credenza, CredenzaTrigger, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaDescription, CredenzaBody, CredenzaFooter } from "@/components/ui/credenza"

export const OAuth = () => {
    const [isPending, startTransition] = useTransition()

    return (
        <Credenza {...isPending && { open: true }}>
            <CredenzaTrigger asChild>
                <Button className="rounded-r-none" disabled={isPending}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Schoology"}
                </Button>
            </CredenzaTrigger>
            <CredenzaContent className="outline-none">
                <form onSubmit={event => {
                    event.preventDefault()
                    startTransition(() => oauth(localStorage.getItem("subdomain") || "app"))
                }}>
                    <Input type="submit" className="hidden"></Input>
                    <CredenzaHeader>
                        <CredenzaTitle>Schoology Domain</CredenzaTitle>
                        <CredenzaDescription>
                            Enter your Schoology subdomain to continue
                        </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody className="flex md:pt-2">
                        <div className="flex m-auto sm:m-0">
                            <Input
                                width={2}
                                disabled={isPending}
                                placeholder={localStorage.getItem("subdomain") || "app"}
                                onChange={({ target }) => localStorage.setItem("subdomain", target.value)}
                                className="text-center w-20 font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <p className="text-sm opacity-80 my-auto pl-2">
                                .schoology.com
                            </p>
                        </div>
                    </CredenzaBody>
                    <CredenzaFooter>
                        <Button disabled={isPending}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                        </Button>
                    </CredenzaFooter>
                </form>
            </CredenzaContent>
        </Credenza>
    )
}