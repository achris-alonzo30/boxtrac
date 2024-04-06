"use client";


import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { inventoryData } from "./types";
import { formatRelative } from "date-fns";
import { api } from "@/convex/_generated/api";
import { transformStockText } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { redirect, useRouter } from "next/navigation";


import { PlusCircle, MoreHorizontal } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
import { useToast } from "@/components/ui/use-toast";
import { RequestTableHeads } from "./request-table-heads";
import { Id } from "@/convex/_generated/dataModel";


export const RequestsTable = () => {
    const { orgRole, orgId, isSignedIn } = useAuth();

    const router = useRouter();
    const { toast } = useToast();

    const clear = useMutation(api.stagingArea.clear);
    const addInventory = useMutation(api.inventories.addItemToInventory);
    const updateInventory = useMutation(api.inventories.updateItemToInventory);
    const deleteInventory = useMutation(api.inventories.deleteItemToInventory);
    const items = useQuery(api.stagingArea.getItemsInStagingArea, orgId ? { orgId } : "skip");
    

    const handleAddInventory = async (
        values: inventoryData,
        itemId: Id<"stagingArea">,
        inventoryId: Id<"inventory">,
        action: string
    ) => {
        if (!values || !orgId || !itemId || !inventoryId) return;
        try {
            const res = await addInventory({
                ...values,
                orgId,
            })

            if (res?.status === "complete") {
                clear({ itemId });
                toast({
                    description: "Item added successfully.",
                    variant: "success",
                    title: "Success",
                })
                router.push("/inventories")
            } else {
                toast({
                    description: "Failed to add the item. Please try again.",
                    variant: "destructive",
                    title: "Error",
                })
            }

            if (inventoryId && action.includes("Update")) {
                const res = await deleteInventory({
                    itemId: inventoryId,
                })

                if (res.success === true ) {
                    clear({ itemId });
                    toast({
                        description: "Item updated successfully.",
                        variant: "success",
                        title: "Success",
                    })
                } else {
                    toast({
                        description: "Failed to update the item. Please try again.",
                        variant: "destructive",
                        title: "Error",
                    })
                }
            }

            if (inventoryId && action.includes("Delete")) {
                const res = await updateInventory({
                    id: inventoryId,
                    ...values,
                })

                if (res.success === true ) {
                    clear({ itemId });
                    toast({
                        description: "Item deleted successfully.",
                        variant: "success",
                        title: "Success",
                    })
                } else {
                    toast({
                        description: "Failed to delete the item. Please try again.",
                        variant: "destructive",
                        title: "Error",
                    })
                }
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toast({
                description: "Something went wrong in the operation. Please try again.",
                variant: "destructive",
                title: "Error",
            })
        }
    }
    const handleClearInventory = async (itemId: Id<"stagingArea">) => {
        if (!itemId) return;
        try {
            const res = await clear({ itemId })

            if (res) {
                toast({
                    description: "Item clearedsuccessfully.",
                    variant: "success",
                    title: "Success",
                })
                router.push("/inventories")
            } else {
                toast({
                    description: "Failed to clear the item. Please try again.",
                    variant: "destructive",
                    title: "Error",
                })
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toast({
                description: "Failed to clear the item. Please try again.",
                variant: "destructive",
                title: "Error",
            })
        }
    }

    const isLoading = items === undefined;

    if (!isSignedIn) redirect("/");
    return (
        <>
            {items && items.length > 0 ? (
                <Table>
                    <TableHeader>
                        <RequestTableHeads />
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => {
                            return (
                                <TableRow key={item._id}>
                                    <TableCell className="hidden md:table-cell capitalize">{formatRelative(new Date(item._creationTime), new Date())}</TableCell>
                                    <TableCell className="font-medium">{item.data.dataType}</TableCell>
                                    <TableCell><Badge variant="default">{transformStockText(item.action)}</Badge></TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-indigo-500">View</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAddInventory(item.data.inventoryData, item._id, item.inventoryId!, item.action!)} className="text-emerald-500">
                                                    Accept
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleClearInventory(item._id)} className="text-rose-500">Deny</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
            {isLoading && <Loader text="Loading Requests" />}
        </>
    )
}
