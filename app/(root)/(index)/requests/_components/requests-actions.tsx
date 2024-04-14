"use client";


import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { inventoryData, orderData } from "./types";
import { Id } from "@/convex/_generated/dataModel";

import { MoreHorizontal } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ClearDialog } from "./dialogs/clear-dialog";
import { ViewOrderDialog } from "./dialogs/view-order-dialog";
import { ViewInventoryDialog } from "./dialogs/view-inventory-dialog";

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
    const [isViewOpen, setIsViewOpen] = useState(false);
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
                    isStaff: true
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
                    isStaff: true
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
                    isStaff: true
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
                    orgId,
                    isStaff: true
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
                    isStaff: true
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
                const res = await deleteOrder({ id: orderId, isStaff: true })
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

    return (
        <>
            <ClearDialog isConfirmOpen={isConfirmOpen} setIsConfirmOpen={setIsConfirmOpen} stagingAreaId={stagingAreaId} />

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                {/* INVENTORY ACTIONS */}
                {action === "[STAFF] Add New Item in Inventory" && inventoryData && (
                    <ViewInventoryDialog inventoryData={inventoryData} action={"create"} />
                )} 
                {action === "[STAFF] Delete Inventory" && inventoryData && (
                    <ViewInventoryDialog inventoryData={inventoryData} action={"create"} />
                )}
                {action === "[STAFF] Update Item in Inventory" && inventoryData && (
                    <ViewInventoryDialog inventoryData={inventoryData} action={"create"} />
                )}

                {/* Order ACTIONS */}
                {action === "[STAFF] Create New Order" && orderData && (
                    <ViewOrderDialog orderData={orderData} action={"create"} />
                )}
                {action === "[STAFF] Update Order" && orderData  && (
                    <ViewOrderDialog orderData={orderData} action={"update"} />
                )}
                {action === "[STAFF] Delete Order" && orderData && (
                    <ViewOrderDialog orderData={orderData} action={"delete"} />
                )}

            </Dialog>
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
                    <DropdownMenuItem onClick={() => setIsViewOpen(true)}>View</DropdownMenuItem>
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