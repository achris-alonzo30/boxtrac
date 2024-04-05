"use client";

import { useRouter } from "next/navigation";
import { 
  SignedIn, 
  UserButton, 
  OrganizationSwitcher 
} from "@clerk/nextjs";

import { PlusCircle } from "lucide-react";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { TabLists } from "@/components/tab-list";
import { ModeToggle } from "@/components/mode-toggle";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterButton } from "@/components/filter-buttons";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { InventoryTable } from "./_components/table/inventory-table";

const InventoryPage = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabLists tabs={["inStock", "lowStock", "outOfStock"]} />
              <div className="ml-auto flex items-center gap-2">
                <FilterButton filters={["inStock", "lowStock", "outOfStock"]} />
                <Button size="sm" className="h-8 gap-1" onClick={() => router.push("/inventories/add")}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Inventory
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                  <CardDescription>
                    Manage and keep track of your inventory.
                  </CardDescription>
                </CardHeader>
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