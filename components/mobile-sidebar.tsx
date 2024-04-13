"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
    Link,
    LogOut,
    Package,
    PanelLeft,
    LayoutGrid,
    ScrollText,
    ShoppingCart,
    GitPullRequest,
} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";


export const MobileSidebar = ({ isAdmin }: { isAdmin: boolean }) => {
    const { signOut } = useClerk();
    const router = useRouter();

    const handleSignOut = () => {
        signOut();
        router.push("/")
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    <Logo />
                    {isAdmin && (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <LayoutGrid className="h-5 w-5" />
                            Dashboard
                        </Link>
                    )}

                    <Link
                        href="/orders"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Orders
                    </Link>
                    <Link
                        href="/inventories"
                        className="flex items-center gap-4 px-2.5 text-foreground"
                    >
                        <Package className="h-5 w-5" />
                        Inventories
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/requests"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <GitPullRequest className="h-5 w-5" />
                            <span className="sr-only">Requests</span>
                            {/* Add the number of requests in here */}
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            href="/logs"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <ScrollText className="h-5 w-5" />
                            <span className="sr-only">Logs</span>
                        </Link>
                    )}

                    <div
                        onClick={() => handleSignOut()}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Logout</span>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    )
}