"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

type InventoryActionsProps = {
    isLoading: boolean;
    form: UseFormReturn<{
        size: string;
        price: string;
        status: string;
        itemName: string;
        supplier: string;
        quantity: string;
    }, any, undefined>;
    smallScreen?: boolean;
    largeScreen?: boolean;
}

export const InventoryAddActionButtons = ({ isLoading, form, smallScreen, largeScreen }: InventoryActionsProps) => {
    const router = useRouter();
    return (
        <>
            {smallScreen && (
                <div className="flex justify-end items-center gap-2 md:hidden">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            form.reset();
                            router.back();
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button size="sm" disabled={isLoading} type="submit">
                        {isLoading ? (
                            <span className="flex items-center gap-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading...
                            </span>
                        ) : (
                            <p>Update Product</p>
                        )}
                    </Button>
                </div>
            )}
            {largeScreen && (
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            form.reset();
                            router.back();
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button size="sm" disabled={isLoading} type="submit">
                        {isLoading ? (
                            <span className="flex items-center gap-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading...
                            </span>
                        ) : (
                            <p>Add Product</p>
                        )}
                    </Button>
                </div>
            )}
        </>
    )
}