"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BestSellers = ({ orgId }: { orgId: string }) => {
    const orders = useQuery(api.orders.getBestSellers, { orgId });

    if (!Array.isArray(orders)) {
        return (
            <CardContent className="grid gap-8">
                <Skeleton className="h-9 w-9 rounded-lg bg-muted" />
                <Skeleton className="h-9 w-9 rounded-lg bg-muted/90" />
                <Skeleton className="h-9 w-9 rounded-lg bg-muted/80" />
                <Skeleton className="h-9 w-9 rounded-lg bg-muted/70" />
                <Skeleton className="h-9 w-9 rounded-lg bg-muted/60" />
                <Skeleton className="h-9 w-9 rounded-lg bg-muted/50" />
            </CardContent>
        )
    }

    return (
        <CardContent className="grid gap-8">
            {orders.length === 0 ?
                (
                    <div className="flex h-40 w-full items-center justify-center">
                        <p>No data</p>
                    </div>
                ) : (
                    <>
                        {orders.map((order, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="flex h-9 w-9 text-center bg-muted rounded-full items-center justify-center">
                                    {idx + 1}
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">
                                        {order.itemName}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">{order.transactionCount}</div>
                            </div>
                        ))}
                    </>
                )}
        </CardContent>
    )
}