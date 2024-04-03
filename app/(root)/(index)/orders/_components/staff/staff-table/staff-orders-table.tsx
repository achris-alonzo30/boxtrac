import Image from "next/image"

import {
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StaffOrdersActions } from "./staff-orders-actions"
import { StaffOrdersTableHeads } from "./staff-orders-table-heads"

const data = [
    {
        customerName: "Liam Johnson",
        email: "bIqgU@example.com",
        itemName: "Product 1",
        size: "Small",
        status: "Fulfilled",
        quantity: 5,
        price: "$299.99",
        transactionDate: "2023-07-12 10:42 AM",
    },
    {
        customerName: "Emma Smith",
        email: "eSmith@example.com",
        itemName: "Product 2",
        size: "Medium",
        status: "Pending",
        quantity: 3,
        price: "$199.99",
        transactionDate: "2023-07-13 09:15 AM",
    },
    {
        customerName: "Noah Williams",
        email: "nWilliams@example.com",
        itemName: "Product 3",
        size: "Large",
        status: "Fullfilled",
        quantity: 2,
        price: "$499.99",
        transactionDate: "2023-07-14 14:30 PM",
    },
    {
        customerName: "Olivia Brown",
        email: "oBrown@example.com",
        itemName: "Product 4",
        size: "Extra Large",
        status: "Cancelled",
        quantity: 1,
        price: "$99.99",
        transactionDate: "2023-07-15 11:55 AM",
    },
];


export const StaffOrdersTable = () => {
    return (
        <Table>
            <TableHeader>
                <StaffOrdersTableHeads />
            </TableHeader>
            <TableBody>
                {data.map((item, index) => {
                    const variant =
                        item.status === 'Fulfilled'
                            ? 'default'
                            : item.status === 'Pending'
                                ? 'secondary'
                                : item.status === 'Cancelled'
                                    ? 'destructive'
                                    : 'default';
                    return (
                        <TableRow key={index}>
                            <TableCell className="hidden sm:table-cell">{item.customerName}</TableCell>
                            <TableCell className="font-medium">{item.itemName}</TableCell>
                            <TableCell className="font-medium">{item.size}</TableCell>
                            <TableCell><Badge variant={variant}>{item.status}</Badge></TableCell>
                            <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                            <TableCell className="hidden md:table-cell">{item.price}</TableCell>
                            <TableCell className="font-medium">{item.transactionDate}</TableCell>
                            <TableCell>
                                <StaffOrdersActions />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}