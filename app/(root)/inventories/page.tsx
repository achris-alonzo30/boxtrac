
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { TabLists } from "@/components/tab-list"
import { SearchBar } from "@/components/search-bar"
import { ModeToggle } from "@/components/mode-toggle"
import { ActionButtons } from "@/components/action-buttons"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { AccountSettings } from "@/components/account-settings"
import { InventoryTable } from "./_components/table/inventory-table"


const InventoryPage = () => {
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
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabLists tabs={["In Stock", "Low Stock", "Out of Stock"]} />
              <ActionButtons />
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
