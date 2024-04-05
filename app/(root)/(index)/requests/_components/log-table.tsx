"use client";

import Link from "next/link";
import Image from "next/image";
import { inventoryData } from "./types";
import { formatRelative } from "date-fns";
import { api } from "@/convex/_generated/api";
import { transformStockText } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { redirect, useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";

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


export const RequestsTable = () => {
    const { toast } = useToast();
    const router = useRouter();

    const { user, isLoaded: userIsLoaded, isSignedIn } = useUser();
    const { organization, isLoaded: orgIsLoaded } = useOrganization();
    let orgId: string | undefined = undefined;
    if (orgIsLoaded && userIsLoaded) {
        orgId = organization?.id ?? user?.id;
    }

    const items = useQuery(api.stagingArea.getItemsInStagingArea, orgId ? { orgId } : "skip");
    const addInventory = useMutation(api.inventories.addInventory);
    if (!isSignedIn) redirect("/");

    const isLoading = items === undefined;

    const handleAddInventory = async (values: inventoryData) => {
        if(!values || !orgId) return;
        try {
            await addInventory({
                ...values,
                orgId,
            })
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toast({
                description: "Failed to add item. Please try again.",
                variant: "destructive",
                title: "Error",
            })
        }
    }

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
                                                <DropdownMenuItem onClick={() => handleAddInventory(item.data.inventoryData)}>
                                                    Accept
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Deny</DropdownMenuItem>
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
            {isLoading && <Loader text="Loading Your Requests" />}
        </>
    )
}
