import Image from "next/image"
import Link from "next/link"
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    File,
    ListFilter,
    MoreVertical,
    Truck,

} from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from "@/components/search-bar"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { AccountSettings } from "@/components/account-settings"
import { PerformanceCard } from "./admin-card/performance-card"
import { TabLists } from "@/components/tab-list"
import { OrderReceipt } from "./admin-card/order-receipt"
import { AdminOrdersTable } from "./admin-table/admin-orders-table"
import { ActionButtons } from "@/components/action-buttons"

export const AdminBrowser = () => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <MobileSidebar />
                    <SearchBar />
                    <ModeToggle />
                    <AccountSettings />
                </header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                        <PerformanceCard />
                        <Tabs defaultValue="week">
                            <div className="flex items-center">
                                <TabLists tabs={["week", "month", "year"]} />
                                <ActionButtons btnName="New Order" filters={["Fulfilled", "Declined", "Pending"]} />
                            </div>
                            <TabsContent value="week">
                                <Card>
                                    <CardHeader className="px-7">
                                        <CardTitle>Orders</CardTitle>
                                        <CardDescription>
                                            Recent orders from your store.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <AdminOrdersTable />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <OrderReceipt />
                </main>
            </div>
        </div>
    )
}

