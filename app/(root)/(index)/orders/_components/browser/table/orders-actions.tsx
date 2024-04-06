"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { MoreHorizontal } from "lucide-react";

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
import { useToast } from "@/components/ui/use-toast";

type InventoryActionsProps = {
    itemId: Id<"order">;
    orgId: string | null | undefined;
    isAdmin: boolean;
    isStaff: boolean;
}

export const OrdersActions = ({ itemId, isAdmin, isStaff, orgId }: InventoryActionsProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    

    const addToStagingArea = useMutation(api.stagingArea.addToStagingArea);
    const deleteOrder = useMutation(api.orders.deleteOrder);
    
    const handleSubmit = async (orderId: Id<"order">) => {
        if (!orgId || !orderId) return;
        try {
            if (isAdmin) {
                const res = await deleteOrder({
                    id: orderId
                })

                if (res.success === true) {
                    toast({
                        title: "Success",
                        description: "Item has been deleted",
                        variant: "default",
                    })
                    router.push("/orders")
                    setIsConfirmOpen(false);
                }
                
            } else if (isStaff) {
                const res = await addToStagingArea({
                    orgId,
                    action: "[STAFF] Delete Order",
                    data: {
                        dataType: "Order",
                    },
                    orderId
                })

                if (res) {
                    toast({
                        title: "Request Sent",
                        description: "Your request has been sent and is pending for approval",
                        variant: "default",
                    })
                    router.push("/orders")
                    setIsConfirmOpen(false);
                }

            } else {
                return null;
            }

        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setIsConfirmOpen(false);
        }
    }

    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone and this will permanently delete this item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="transform hover:-translate-y-1 transition-all duration-400" onClick={() => setIsConfirmOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleSubmit(itemId)}
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
                    <Link href={`/orders/edit/${itemId}`} className="cursor-pointer">
                        <DropdownMenuItem>
                            Edit
                        </DropdownMenuItem></Link>
                    <DropdownMenuItem onClick={() => setIsConfirmOpen(true)} className="cursor-pointer">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}