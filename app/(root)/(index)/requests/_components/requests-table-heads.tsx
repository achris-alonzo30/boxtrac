import { TableHead, TableRow } from "@/components/ui/table"

export const RequestsTableHeads = () => {
    return (
        <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
        </TableRow>
    )
}