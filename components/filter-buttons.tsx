import { ListFilterIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Fragment } from "react"


export const FilterButton = ({ filters }: { filters: string[] }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-8 gap-1" size="sm" variant="outline">
                    <ListFilterIcon className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filters.map((filter, index) => {
                    const filterName = filter.split(/(?=[A-Z])/).join(' ')
                    return (
                        <Fragment key={index}>
                            {/* Add checked props to DropdownMenuCheckboxItem */}
                            <DropdownMenuCheckboxItem className="capitalize">{filterName}</DropdownMenuCheckboxItem>
                        </Fragment>
                    )
                })}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}