"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

import { PlusCircle } from "lucide-react";

import {
    Card,
    CardTitle,
    CardHeader,
    CardFooter,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { TabLists } from "@/components/tab-list";
import { OrdersTable } from "./table/orders-table";
import { Tabs, TabsContent, } from "@/components/ui/tabs";
import { OrderReceipt } from "./admin-only/order-receipt";
import { FilterButton } from "@/components/filter-buttons";
import { PerformanceCard } from "./admin-only/performance-card";


export const Browser = () => {
    const { orgRole, orgId } = useAuth();

    const isAdmin = orgRole === "org:admin";
    const isStaff = orgRole === "org:member";

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header />
                {isAdmin && (
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                            <PerformanceCard />
                            <Tabs defaultValue="week">
                                <div className="flex items-center">
                                    <TabLists tabs={["week", "month", "year"]} />
                                    <div className="ml-auto flex items-center gap-2">
                                        <FilterButton filters={["Fulfilled", "Pending", "Cancelled"]} />
                                        <Button size="sm" className="h-8 gap-1">
                                            <Link href="/orders/add" className="flex items-center gap-x-2">
                                                <PlusCircle className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                    New Order
                                                </span>
                                            </Link>
                                        </Button>
                                    </div>
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
                                            <OrdersTable orgId={orgId ? orgId : "skip"} isAdmin={isAdmin} isStaff={isStaff} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                        <OrderReceipt />
                    </main>
                )}
                {isStaff && (
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <Tabs defaultValue="all">
                            <div className="flex items-center">
                                <TabLists tabs={["inStock", "lowStock", "outOfStock"]} />
                                <div className="ml-auto flex items-center gap-2">
                                    <FilterButton filters={["inStock", "lowStock", "outOfStock"]} />
                                    <Button size="sm" className="h-8 gap-1" asChild>
                                        <Link href="/inventories/add" className="flex items-center gap-x-2">
                                            <PlusCircle className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                New Order
                                            </span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <TabsContent value="all">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Orders</CardTitle>
                                        <CardDescription>
                                            Recent orders from your store.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                    <OrdersTable orgId={orgId ? orgId : "skip"} isAdmin={isAdmin} isStaff={isStaff} />
                                    </CardContent>
                                    <CardFooter>
                                        <div className="text-xs text-muted-foreground">
                                            Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                            products
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </main>
                )}
            </div>
        </div>
    )
}
