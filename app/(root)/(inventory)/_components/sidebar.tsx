import Link from "next/link";

import { 
    Home, 
    Users2,
    Package, 
    Settings, 
    ShoppingCart,  
} from "lucide-react"

import { Logo } from "@/components/logo"
import { ActionTooltip } from "@/components/action-tooltip"

export const Sidebar = () => {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Logo />
                <ActionTooltip name="Dashboard">
                    <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Home className="h-5 w-5" />
                        <span className="sr-only">Dashboard</span>
                    </Link>
                </ActionTooltip>
                <ActionTooltip name="Orders">
                    <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Orders</span>
                    </Link>
                </ActionTooltip>
                <ActionTooltip name="Products">
                    <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Package className="h-5 w-5" />
                        <span className="sr-only">Products</span>
                    </Link>
                </ActionTooltip>
                <ActionTooltip name="Customers">
                    <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Users2 className="h-5 w-5" />
                        <span className="sr-only">Customers</span>
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