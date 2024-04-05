import { TableHead, TableRow } from "@/components/ui/table"

export const RequestTableHeads = () => {
    return (
        <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Date Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
        </TableRow>
    )
}