import { TableHead, TableRow } from "@/components/ui/table"

export const AdminOrdersTableHeads = () => {
    return (
        <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Quantity</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">
                Transaction Date
            </TableHead>
            <TableHead>
                <span className="sr-only">Actions</span>
            </TableHead>
        </TableRow>
    )
}