"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { InventoryDataTable } from "./inventory-data-table";
import { columns } from "./inventory-table-columns";

export const InventoryTable = ({ orgId }: { orgId: string;}) => {
    const data = useQuery(api.logs.getAllLogs, { orgId })

    if (!data) return [];

    return (
        <div className="container mx-auto">
            <InventoryDataTable columns={columns} data={data} />
        </div>
    )
}