
import { 
    Link,
    Package,
    LineChart,  
    PanelLeft, 
    ShoppingCart,
    LayoutGrid,  
} from "lucide-react"

import { 
    Sheet, 
    SheetContent, 
    SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"



export const MobileSidebar = () => {
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
                    <Link
                        href="/"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <LayoutGrid className="h-5 w-5" />
                        Dashboard
                    </Link>
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
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <LineChart className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    )
}