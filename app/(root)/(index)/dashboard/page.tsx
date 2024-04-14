"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import {
    Tabs,
    TabsList,
    TabsContent,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Loader } from "@/components/loader";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { BestSellers } from "./_components/inventories/best-sellers";
import { CardKPIHolder } from "./_components/inventories/card-kpi-holder";
import { InventoryLevels } from "./_components/inventories/inventory-levels";


const DashboardPage = () => {
    const { isSignedIn, isLoaded, orgRole, orgId: id } = useAuth();

    useEffect(() => {
        if (!isSignedIn) {
            redirect("/");
        } else if (isSignedIn && orgRole !== "org:admin") {
            redirect("/inventories");
        }
    }, [isSignedIn, orgRole]);

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader text="Loading..." />
            </div>)
    };

    const orgId = id ? id : "skip";
    const isAdmin = orgRole === "org:admin";

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/30">
            <Sidebar isAdmin={isAdmin} />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header isAdmin={isAdmin} />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <Tabs defaultValue="inventories" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="inventories">Inventories</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                        </TabsList>
                        <TabsContent value="inventories" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                                <CardKPIHolder orgId={orgId} />
                            </div>
                            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                                <Card className="xl:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Inventory Levels</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <InventoryLevels orgId={orgId} />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>Best Sellers</CardTitle>
                                        <CardDescription className="text-gray-300">
                                            Transaction Count
                                        </CardDescription>
                                    </CardHeader>
                                    <BestSellers orgId={orgId} />
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="orders" className="space-y-4">
                            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                                TODO
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    )
}

export default DashboardPage;
