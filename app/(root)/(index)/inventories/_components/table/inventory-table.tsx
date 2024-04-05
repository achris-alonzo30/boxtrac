"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { formatRelative } from "date-fns";
import { redirect, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { transformStockText } from "@/lib/utils";

import { PlusCircle } from "lucide-react"

import {
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
} from "@/components/ui/table";

import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryActions } from "./inventory-actions";
import { InventoryTableHeads } from "./inventory-table-heads";

import { useOrganization, useUser } from "@clerk/nextjs";

export const InventoryTable = () => {
    
    const router = useRouter();
    
    const { user, isLoaded: userIsLoaded, isSignedIn } = useUser();
    const { organization, isLoaded: orgIsLoaded } = useOrganization();
    let orgId: string | undefined = undefined;
    if (orgIsLoaded && userIsLoaded) {
        orgId = organization?.id ?? user?.id;
    }
 
    const inventories = useQuery(api.inventories.getInventories, orgId ? { orgId } : "skip");

    if (!isSignedIn) redirect("/");

    if (!inventories) return <Loader text="Loading Your Inventories" />;

    return (
        <>
            {inventories && inventories.length > 0 ? (
                <Table>
                    <TableHeader>
                        <InventoryTableHeads />
                    </TableHeader>
                    <TableBody>
                        {inventories.map((item) => {
                            const variant =
                                item.status === 'inStock'
                                    ? 'default'
                                    : item.status === 'lowStock'
                                        ? 'secondary'
                                        : item.status === 'outOfStock'
                                            ? 'destructive'
                                            : 'default';
                            return (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.itemName}</TableCell>
                                    <TableCell className="font-medium">{item.size}</TableCell>
                                    <TableCell><Badge variant={variant}>{transformStockText(item.status)}</Badge></TableCell>
                                    <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                                    <TableCell className="hidden md:table-cell">₱{item.price}</TableCell>
                                    <TableCell className="font-medium">{item.supplier}</TableCell>
                                    <TableCell className="hidden md:table-cell capitalize">{formatRelative(new Date(item._creationTime), new Date())}</TableCell>
                                    <TableCell>
                                        <InventoryActions itemId={item._id} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            ) : (
                <section className="w-full flex flex-col items-center justify-center space-y-4 my-12">
                    <Image src="/no-data.svg" alt="No Data" width={100} height={100} />
                    <p className="text-xl  font-medium">No Inventory</p>
                    <Button size="sm" className="h-8 gap-1" onClick={() => router.push("/inventories/add")}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Inventory
                        </span>
                    </Button>
                </section>
            )}

        </>
    )
}
