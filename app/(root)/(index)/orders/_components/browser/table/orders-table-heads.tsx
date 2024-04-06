import { TableHead, TableRow } from "@/components/ui/table"

export const OrdersTableHeads = () => {
    return (
        <TableRow>
            <TableHead className="hidden md:table-cell">
                Transaction Date
            </TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Quantity</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            
            {/* Only for admin */}
            <TableHead className="hidden md:table-cell">
                Profit
            </TableHead>
            <TableHead>
                <span className="sr-only">Actions</span>
            </TableHead>
        </TableRow>
    )
}