"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation'
import { 
    Package, 
    Settings, 
    LayoutGrid, 
    ShoppingCart,
} from "lucide-react"

import { Logo } from "@/components/logo"
import { ActionTooltip } from "@/components/action-tooltip"
import { cn } from "@/lib/utils";

export const Sidebar = () => {
    const pathname = usePathname()

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Logo />
                <ActionTooltip name="Dashboard">
                    <Link
                        href="/dashboard"
                        className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname === "/" && "bg-accent text-accent-foreground")}
                    >
                        <LayoutGrid className="h-5 w-5" />
                        <span className="sr-only">Dashboard</span>
                    </Link>
                </ActionTooltip>
                <ActionTooltip name="Orders">
                    <Link
                        href="/orders"
                        className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname === "/orders" && "bg-accent text-accent-foreground")}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Orders</span>
                    </Link>
                </ActionTooltip>
                <ActionTooltip name="Inventories">
                    <Link
                        href="/inventories"
                        className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname === "/inventories" && "bg-accent text-accent-foreground")}
                    >
                        <Package className="h-5 w-5" />
                        <span className="sr-only">Inventories</span>
                    </Link>
                </ActionTooltip>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <ActionTooltip name="Settings">
                    <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                    </Link>
                </ActionTooltip>
            </nav>
        </aside >
    )
}