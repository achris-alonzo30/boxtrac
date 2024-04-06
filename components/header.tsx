import { 
    SignedIn, 
    UserButton, 
    OrganizationSwitcher 
} from "@clerk/nextjs";

import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";

export const Header = () => {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileSidebar />
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
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
        </header>
    )
}