"use client";


import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { formatRelative } from "date-fns";
import { api } from "@/convex/_generated/api";
import { transformStockText } from "@/lib/utils";
import { inventoryData, orderData } from "./types";
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
    const { orgId, isSignedIn } = useAuth();

    const router = useRouter();
    const { toast } = useToast();

    // Inventory Actions
    const addInventory = useMutation(api.inventories.addItemToInventory);
    const updateInventory = useMutation(api.inventories.updateItemToInventory);
    const deleteInventory = useMutation(api.inventories.deleteItemToInventory);
    
    // Order Actions
    const addNewOrder = useMutation(api.orders.addNewOrder);
    const updateOrder = useMutation(api.orders.updateOrder);
    const deleteOrder = useMutation(api.orders.deleteOrder);
    
    // Staging Area Actions
    const clear = useMutation(api.stagingArea.clear);
    const items = useQuery(api.stagingArea.getItemsInStagingArea, orgId ? { orgId } : "skip");

    const handleAcceptRequests = async (
        inventoryData: inventoryData,
        orderData: orderData,
        itemId: Id<"stagingArea">,
        inventoryId: Id<"inventory">,
        orderId: Id<"order">,
        action: string
    ) => {

        if (!orgId) return;
        try {
            console.log("[Log Table] - inventoryData", inventoryData)
            console.log("[Log Table] - orderData", orderData)
            console.log("[Log Table] - itemId", itemId)
            console.log("[Log Table] - inventoryId", inventoryId)
            console.log("[Log Table] - action", action)
            if (action === "[STAFF] Add New Item in Inventory" && inventoryData) {
                const res = await addInventory({
                    ...inventoryData,
                    orgId,
                })

                if (res) {
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
            }

            if (inventoryId && action === "[STAFF] Delete Inventory") {
                const res = await deleteInventory({
                    itemId: inventoryId,
                })

                if (res.success === true) {
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

            if (inventoryId && action === "[STAFF] Update Item in Inventory") {
                const res = await updateInventory({
                    id: inventoryId,
                    ...inventoryData,
                })

                if (res.success === true) {
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

            if (inventoryId && action === "[STAFF] Create New Order" && orderData) {
                const res = await addNewOrder({
                    ...orderData,
                    inventoryId,
                    orgId
                })

                if (res) {
                    clear({ itemId });
                    toast({
                        title: "Success",
                        description: "Order added successfully.",
                        variant: "success",
                    })
                    router.push("/orders")
                }
            }
            console.log('[REQUEST_TABLE] - action:', action);
            console.log('[REQUEST_TABLE] - orderData:', orderData);
            console.log('[REQUEST_TABLE] - orderId:', orderId);
            console.log('[REQUEST_TABLE] - inventoryId:', inventoryId);
            if (orderData && orderId && inventoryId && action === "[STAFF] Update Order") {
                const res = await updateOrder({
                    id: orderId,
                    ...orderData,
                    inventoryId,
                })

                if (res?.success === true) {
                    clear({ itemId });
                    toast({
                        description: "Order updated successfully.",
                        variant: "success",
                        title: "Success",
                    })
                }
                router.push("/orders")
            } 

            if (orderId && action === "[STAFF] Delete Order") {
                const res = await deleteOrder({ id: orderId })
                if (res?.success === true) {
                    clear({ itemId });
                    toast({
                        description: "Order deleted successfully.",
                        variant: "default",
                        title: "Success",
                    })
                    router.push("/orders")
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
                    description: "Item cleared successfully.",
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
                                                <DropdownMenuItem>View</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAcceptRequests(item.data.inventoryData, item.data.orderData, item._id, item.inventoryId!, item.orderId!, item.action!)}>
                                                    Accept
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleClearInventory(item._id)}>Deny</DropdownMenuItem>
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