"use client";

import { 
    useAuth,
    SignedIn, 
    UserButton, 
    OrganizationSwitcher, 
} from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ActionTooltip } from "@/components/action-tooltip";
import { MobileSidebar } from "@/components/mobile-sidebar";

export const Header = ({ isAdmin }: { isAdmin: boolean }) => {
    const router = useRouter();
    const { orgId: id } = useAuth();
    const orgId = id ? id : "skip";
    const requestsNumber = useQuery(api.stagingArea.getNumberOfRequests, { orgId });
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileSidebar isAdmin={isAdmin} />
            <SignedIn>
                <div className="relative ml-auto flex-1 md:grow-0 items-center">
                    <OrganizationSwitcher
                        afterCreateOrganizationUrl={"/dashboard"}
                        appearance={{
                            elements: {
                                organizationPreviewTextContainer: "text-[#2ca9bc]",
                                userPreviewTextContainer: "text-[#2ca9bc]",
                                organizationSwitcherPopoverCard: "bg-white",
                            },
                        }} />
                </div>
                {isAdmin && (
                    <ActionTooltip name="Requests" side="bottom">
                        <Button variant="outline" size="icon" className="outline-none border-0 relative" onClick={() => router.push("/requests")}>
                            <Bell className="h-[1.2rem] w-[1.2rem] dark:text-white text-black" />
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                                {requestsNumber} 
                            </span>
                            <span className="sr-only">Requests Notification</span>
                        </Button>
                    </ActionTooltip>
                )}
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </header>
    )
}