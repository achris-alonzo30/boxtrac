"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatRelative } from "date-fns"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Doc } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { OrdersActions } from "./orders-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Doc<"order">>[] = [
    {
        accessorKey: "_creationTime",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const data = row.getValue("_creationTime") as number;
            return <div className="capitalize">{formatRelative(new Date(data), new Date())}</div>
        }
    },
    {
        accessorKey: "customer",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "itemName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Product
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price Sold
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
            }).format(amount)

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const variant = status === "In Stock" ? "default" : status === "Low Stock" ? "secondary" : status === "Out Of Stock" ? "destructive" : "default";
            return <Badge variant={variant}>{status}</Badge>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original

            return (
                <OrdersActions itemId={order._id} />
            )
        },
    },
]
