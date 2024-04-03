import { TableHead, TableRow } from "@/components/ui/table"

export const InventoryTableHeads = () => {
    return (
        <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">
                Quantity
            </TableHead>
            <TableHead className="hidden md:table-cell">
                Price
            </TableHead>
            <TableHead className="hidden md:table-cell">
                Supplier
            </TableHead>
            <TableHead className="hidden md:table-cell">
                Transaction Date
            </TableHead>
            <TableHead>
                <span className="sr-only">Actions</span>
            </TableHead>
        </TableRow>
    )
}