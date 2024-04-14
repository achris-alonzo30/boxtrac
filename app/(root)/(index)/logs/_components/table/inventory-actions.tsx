"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { formatRelative } from "date-fns";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { MoreHorizontal } from "lucide-react";

import {
    Dialog,
    DialogFooter,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardContentHolder } from "./card/card-content-holder";


export const InventoryActions = ({ itemId: logId }: { itemId: Id<"logs">; }) => {
    const { orgId: id } = useAuth();
    const orgId = id ? id : "skip";

    const log = useQuery(api.logs.getLog, { logId, orgId });

    if (!log) return null;

    const orderData = log.data.dataType === "Order" ? log.data.orderData : undefined;
    const inventoryData = log.data.dataType === "Inventory" ? log.data.inventoryData : undefined;
    const source = log.data.dataType;
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        aria-haspopup="true"
                        size="icon"
                        variant="ghost"
                    >
                        <span>View</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-row items-start bg-muted/50">
                            <div className="grid gap-0.5">
                                <CardTitle className="group flex items-center gap-2 text-lg">
                                    {log.data.dataType}
                                </CardTitle>
                                <CardDescription className="capitalize">
                                    {formatRelative(new Date(log._creationTime), new Date())}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        {orderData && source && <CardContentHolder orderData={orderData} source={source} />}
                        {inventoryData && source && <CardContentHolder inventoryData={inventoryData} source={source} />}
                    </Card>
                </DialogContent>
            </Dialog>
        </>
    )
}