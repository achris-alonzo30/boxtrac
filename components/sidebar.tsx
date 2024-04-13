"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useClerk, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from 'next/navigation';

import {
    Power,
    Package,
    ScrollText,
    LayoutGrid,
    ShoppingCart,
    GitPullRequest,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { ActionTooltip } from "@/components/action-tooltip";


export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { orgRole } = useAuth();
    const { signOut } = useClerk();

    const isAdmin = orgRole === "org:admin";
    const handleSignOut = () => {
        signOut();
        router.push("/")
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Logo />
                {isAdmin &&
                    <ActionTooltip name="Dashboard">
                        <Link
                            href="/dashboard"
                            className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname === "/dashboard" && "bg-muted")}
                        >
                            <LayoutGrid className={cn("h-5 w-5", pathname === "/dashboard" && "text-[#2ca9bc]")} />
                            <span className="sr-only">Dashboard</span>
                        </Link>
                    </ActionTooltip>
                }
                <ActionTooltip name="Inventories">
                    <Link
                        href="/inventories"
                        className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname === "/inventories" && "bg-muted")}
                    >
                        <Package className={cn("h-5 w-5", pathname === "/inventories" && "text-[#2ca9bc]")} />
                        <span className="sr-only">Inventories</span>
                    </Link>
                </ActionTooltip>
                <ActionTooltip name="Orders">
                    <Link
                        href="/orders"
                        className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname === "/orders" && "bg-muted")}
                    >
                        <ShoppingCart className={cn("h-5 w-5", pathname === "/orders" && "text-[#2ca9bc]")} />
                        <span className="sr-only">Orders</span>
                    </Link>
                </ActionTooltip>

                {isAdmin && (
                    <ActionTooltip name="Requests">
                        <Link
                            href="/requests"
                            className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname === "/requests" && "bg-muted")}
                        >
                            <GitPullRequest className={cn("h-5 w-5", pathname === "/requests" && "text-[#2ca9bc]")} />
                            <span className="sr-only">Requests</span>
                            {/* Add the number of requests in here */}
                        </Link>
                    </ActionTooltip>
                )}
                {isAdmin && (
                    <ActionTooltip name="Logs">
                        <Link
                            href="/logs"
                            className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname === "/logs" && "bg-muted")}
                        >
                            <ScrollText className={cn("h-5 w-5", pathname === "/logs" && "text-[#2ca9bc]")} />
                            <span className="sr-only">Logs</span>
                        </Link>
                    </ActionTooltip>
                )}
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <ActionTooltip name="Logout">
                    <div
                        onClick={() => handleSignOut()}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <Power className="h-5 w-5" />
                        <span className="sr-only">Logout</span>
                    </div>
                </ActionTooltip>
            </nav>
        </aside >
    )
}