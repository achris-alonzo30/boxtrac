import { formatRelative } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "@/convex/_generated/dataModel";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InventoryActions } from "./inventory-actions";


export const columns: ColumnDef<Doc<"logs">>[] = [
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
        accessorKey: "action",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Action
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "data.dataType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
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
