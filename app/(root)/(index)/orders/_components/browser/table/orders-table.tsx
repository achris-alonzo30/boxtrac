"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { columns } from "./orders-table-columns";
import { OrdersDataTable } from "./orders-table-data";


export const OrdersTable = ({ orgId }: { orgId: string;}) => {
    const data = useQuery(api.orders.getOrders, { orgId })

    if (!data) return [];

    return (
        <div className="container mx-auto">
            <OrdersDataTable columns={columns} data={data} />
        </div>
    )
}