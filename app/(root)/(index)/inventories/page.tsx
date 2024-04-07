"use client";

import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";

import {
  Card,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Loader } from "@/components/loader";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TabLists } from "@/components/tab-list";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterButton } from "@/components/filter-buttons";
import { InventoryTable } from "./_components/table/inventory-table";
import { CardHeaders } from "@/components/card-headers";
import { AddButton } from "@/components/add-buttons";

const InventoryPage = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) <div className="flex h-screen items-center justify-center"><Loader text="Loading..." /></div>;

  if (!isAuthenticated) {
    redirect("/");
  }
  
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabLists tabs={["inStock", "lowStock", "outOfStock"]} />
              <div className="ml-auto flex items-center gap-2">
                <FilterButton filters={["inStock", "lowStock", "outOfStock"]} />
                <AddButton route="/inventories/add" btnName="Add Inventory" />
              </div>
            </div>
            <TabsContent value="all">
              <Card>
                <CardHeaders title="Inventory" description="Manage and keep track of your inventory."/>
                <CardContent>
                  <InventoryTable />
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
      </div>
    </div>
  )
}

export default InventoryPage;