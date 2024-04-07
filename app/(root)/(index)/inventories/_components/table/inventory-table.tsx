"use client";

import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { formatRelative } from "date-fns";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";


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


export const InventoryTable = () => {
    const { orgId, orgRole } = useAuth();
    const router = useRouter();

    const isAdmin = orgRole === "org:admin";
    const isStaff = orgRole === "org:member";

    const inventories = useQuery(api.inventories.getInventories, orgId ? { orgId } : "skip");

    const isLoading = inventories === undefined;

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
                                item.status === 'In Stock'
                                    ? 'default'
                                    : item.status === 'Low Stock'
                                        ? 'secondary'
                                        : item.status === 'Out Of Stock'
                                            ? 'destructive'
                                            : 'default';
                            return (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.itemName}</TableCell>
                                    <TableCell className="font-medium">{item.size}</TableCell>
                                    <TableCell><Badge variant={variant}>{item.status}</Badge></TableCell>
                                    <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                                    <TableCell className="hidden md:table-cell">₱{item.price}</TableCell>
                                    <TableCell className="font-medium">{item.supplier}</TableCell>
                                    <TableCell className="hidden md:table-cell capitalize">{formatRelative(new Date(item._creationTime), new Date())}</TableCell>
                                    <TableCell>
                                        <InventoryActions itemId={item._id} orgId={orgId} isAdmin={isAdmin} isStaff={isStaff}  />
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
            {isLoading && <Loader text="Loading Inventory"/>}
        </>
    )
}
