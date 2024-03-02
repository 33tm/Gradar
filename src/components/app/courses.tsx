import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

import type { Data } from "@/types"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export const Courses = ({ data, index, setIndex }: { data: Data[], index: number, setIndex: Dispatch<SetStateAction<number>> }) => {
    return (
        <Carousel className="w-screen bottom-0 px-16 sticky z-20 rounded-md bg-background py-2">
            <CarouselContent>
                {data.map(({ course: { id, title, section, picture } }, i) => (
                    <CarouselItem key={id} className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5" onClick={() => setIndex(i)}>
                        <Card className="group rounded-lg text-center relative">
                            <Image
                                fill
                                priority
                                sizes="170px"
                                src={picture}
                                alt={`Image for ${title}`}
                                className={`rounded-lg object-cover transition-all duration-500 group-hover:opacity-20 ${i === index ? "opacity-30" : "opacity-0"}`}
                            />
                            <p className="relative font-bold text-xl pt-2 px-4 z-50 truncate">{title}</p>
                            <p className="opacity-80 text-sm pb-2 px-4 z-40 truncate">{section}</p>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext className="right-4" />
            <CarouselPrevious className="left-4" />
        </Carousel>
    )
}