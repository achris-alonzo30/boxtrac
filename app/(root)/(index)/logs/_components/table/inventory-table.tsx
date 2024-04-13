"use client";


import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { InventoryDataTable } from "./inventory-data-table";
import { columns } from "./inventory-table-columns";



export const InventoryTable = () => {
    const { orgId } = useAuth();
    const org = orgId ? orgId : "skip";
    const data = useQuery(api.inventories.getInventories, { orgId: org })

    if (!data) return [];

    return (
        <div className="container mx-auto">
            <InventoryDataTable columns={columns} data={data} />
        </div>
    )
}