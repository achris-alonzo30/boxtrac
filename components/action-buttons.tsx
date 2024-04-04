
import { File, PlusCircle} from "lucide-react"
import { FilterButton } from "./filter-buttons"
import { Button } from "@/components/ui/button"

export const ActionButtons = ({ btnName, filters }: { btnName: string, filters: string[] }) => {
    return (
        <div className="ml-auto flex items-center gap-2">
            <FilterButton filters={filters}/>
            {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                </span>
            </Button> */}
            <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {btnName}
                </span>
            </Button>
        </div>
    )
}