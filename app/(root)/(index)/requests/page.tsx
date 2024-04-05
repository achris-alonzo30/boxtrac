
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import { FilterButton } from "@/components/filter-buttons";
import { RequestsScreen } from "./_components/card-requests-container";

const LogsPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center justify-between">
            <SearchBar />
            <div className="ml-auto flex items-center gap-2">
              <FilterButton filters={["Create", "Update", "Delete"]} />
            </div>
          </div>
          <RequestsScreen />
        </main>
      </div>
    </div>
  )
}

export default LogsPage;