"use client";

import { useQuery } from 'convex/react';
import { formatNumber } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { Package, Recycle } from "lucide-react";

import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
} from "@/components/ui/card";

import { Skeleton } from '@/components/ui/skeleton';


export const CardKPIHolder = ({ orgId }: { orgId: string}) => {
    const data = useQuery(api.inventories.getDasboardData, { orgId })

    if (data === undefined) {
        return (
            <>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </>
        )
    }

    const { COGS, avgInventory, turnoverRate } = data as {
        COGS: number,
        avgInventory: number,
        turnoverRate: number,
    };
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        COGS
                    </CardTitle>
                    <span className="text-muted-foreground">₱</span>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{formatNumber(COGS)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Average Inventory
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{formatNumber(avgInventory)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                    <Recycle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{turnoverRate.toFixed(2)}% </div>
                </CardContent>
            </Card>
        </>
    )
} 