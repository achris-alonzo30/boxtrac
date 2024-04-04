import { TableHead, TableRow } from "@/components/ui/table"

export const InventoryTableHeads = () => {
    return (
        <TableRow>
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