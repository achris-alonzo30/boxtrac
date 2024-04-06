import Image from "next/image"
import Link from "next/link"

export const Logo = () => {
    return (
        <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
            <Image src="/logo.svg" alt="logo" width={20} height={20} />
        </Link>
    )
}