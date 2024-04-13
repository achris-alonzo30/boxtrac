"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Dispatch, SetStateAction } from "react";
import { Id } from "@/convex/_generated/dataModel";

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
import { useToast } from "@/components/ui/use-toast";


type ClearDialogProps = {
    isConfirmOpen: boolean;
    setIsConfirmOpen: Dispatch<SetStateAction<boolean>>;
    stagingAreaId: Id<"stagingArea">;
}

export const ClearDialog = ({ isConfirmOpen, setIsConfirmOpen, stagingAreaId }: ClearDialogProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const clear = useMutation(api.stagingArea.clear);

    const handleClearInventory = async () => {
        try {
            const res = await clear({ itemId: stagingAreaId })

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
                        onClick={handleClearInventory}
                        className="transform hover:-translate-y-1 transition-all duration-400"
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}