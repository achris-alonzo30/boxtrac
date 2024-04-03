
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
import { Sidebar } from "./_components/sidebar"
import { SearchBar } from "./_components/search-bar"
import { TabsLists } from "./_components/tabs-lists"
import { ActionButtons } from "./_components/action-buttons"
import { MobileSidebar } from "./_components/mobile-sidebar"
import { InventoryTable } from "./_components/table/inventory-table"
import { AccountSettings } from "./_components/account-settings"
import { ModeToggle } from "@/components/mode-toggle"

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
              <TabsLists />
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
