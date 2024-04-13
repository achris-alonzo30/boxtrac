"use client";


import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { inventoryData, orderData } from "./types";

import { MoreHorizontal } from "lucide-react"

import {
    AlertDialog,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";

type RequestsActionsProps = {
    orgId: string;
    action: string;
    stagingAreaId: Id<"stagingArea">;
    orderData?: orderData | undefined;
    orderId?: Id<"order"> | undefined;
    inventoryData?: inventoryData | undefined;
    inventoryId?: Id<"inventory"> | undefined;
}

export const RequestsActions = ({ 
    orgId, 
    stagingAreaId, 
    action, 
    orderData, 
    orderId, 
    inventoryData, 
    inventoryId 
}: RequestsActionsProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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
            if (action === "[STAFF] Add New Item in Inventory" && inventoryData) {
                const res = await addInventory({
                    ...inventoryData,
                    orgId,
                })

                if (res) {
                    toast({
                        description: "Item added successfully.",
                        variant: "success",
                        title: "Success",
                    })
                    clear({ itemId });  
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
                    toast({
                        description: "Item deleted successfully.",
                        variant: "success",
                        title: "Success",
                    })
                    clear({ itemId });
                    router.push("/inventories")
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
                    toast({
                        description: "Item updated successfully.",
                        variant: "success",
                        title: "Success",
                    })
                    clear({ itemId });
                    router.push("/inventories")
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
                    toast({
                        title: "Success",
                        description: "Order added successfully.",
                        variant: "success",
                    })
                    clear({ itemId });
                    router.push("/inventories")
                }
            }
            if (orderData && orderId && inventoryId && action === "[STAFF] Update Order") {
                const res = await updateOrder({
                    id: orderId,
                    ...orderData,
                    inventoryId,
                })

                if (res?.success === true) {
                    toast({
                        description: "Order updated successfully.",
                        variant: "success",
                        title: "Success",
                    })
                    clear({ itemId });
                    router.push("/inventories")
                }
            }

            if (orderId && action === "[STAFF] Delete Order") {
                const res = await deleteOrder({ id: orderId })
                if (res?.success === true) {
                    toast({
                        description: "Order deleted successfully.",
                        variant: "default",
                        title: "Success",
                    })
                    clear({ itemId });
                    router.push("/inventories")
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
        try {
            const res = await clear({ itemId })

            if (res) {
                toast({
                    description: "Item cleared successfully.",
                    variant: "success",
                    title: "Success",
                })
                router.push("/requests")
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
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Make sure you have carefully reviewed the request?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone and this will permanently delete the request.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="transform hover:-translate-y-1 transition-all duration-400" onClick={() => setIsConfirmOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleClearInventory(stagingAreaId)}
                            className="transform hover:-translate-y-1 transition-all duration-400"
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
                    <DropdownMenuItem 
                        onClick={() => 
                            handleAcceptRequests(
                                inventoryData, 
                                orderData, 
                                stagingAreaId, 
                                inventoryId!, 
                                orderId!, 
                                action)
                            }
                        >
                        Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsConfirmOpen(true)}>Deny</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}