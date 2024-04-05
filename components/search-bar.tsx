

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export const SearchBar = () => {
    return (
        <div className="relative flex-1 md:grow-0 items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
        </div>
    )
}