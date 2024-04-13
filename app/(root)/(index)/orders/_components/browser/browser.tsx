"use client";


import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { OrdersTable } from "./table/orders-table";
import { CardHeaders } from "@/components/card-headers";
import { Card, CardContent } from "@/components/ui/card";
import { PerformanceCard } from "./admin-only/performance-card";


export const Browser = ({ isAdmin }: { isAdmin: boolean; }) => {

    return (
        <div className="flex h-full w-full flex-col bg-muted/40">
            <Sidebar isAdmin={isAdmin} />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header isAdmin={isAdmin} />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                            {isAdmin && <PerformanceCard />}
                            <Card>
                                <CardHeaders title="Orders" description="View and manage your orders." />
                                <CardContent>
                                    <OrdersTable />
                                </CardContent>
                            </Card>
                        </div>
                    </main>
            </div>
        </div>
    )
}

