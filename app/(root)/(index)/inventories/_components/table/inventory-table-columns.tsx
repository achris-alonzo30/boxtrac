"use client"

import { useAuth } from "@clerk/nextjs";
import { formatRelative } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "@/convex/_generated/dataModel";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryActions } from "./inventory-actions";

export const useAuthDetails = () => {
    const { orgId, orgRole } = useAuth();
    if (!orgId) return;
    const isAdmin = orgRole === "org:admin";
    const isStaff = orgRole === "org:member";
    return { orgId, isAdmin, isStaff };
}


export const columns: ColumnDef<Doc<"inventory">>[] = [
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
        accessorKey: "itemName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
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
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
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
        accessorKey: "supplier",
        header: "Supplier",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <InventoryActions itemId={payment._id} />
            )
        },
    },
]
