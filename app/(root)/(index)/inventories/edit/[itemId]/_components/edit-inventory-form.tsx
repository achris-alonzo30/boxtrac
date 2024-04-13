"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChevronLeft } from "lucide-react";

import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectItem,
    SelectValue,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CardHeaders } from "@/components/card-headers";
import { Card, CardContent } from "@/components/ui/card";
import { InventoryEditActionButtons } from "./inventory-edit-action-buttons";

const formSchema = z.object({
    size: z.string().min(1),
    price: z.string().min(1),
    status: z.string().min(1),
    itemName: z.string().min(1),
    supplier: z.string().min(1),
    quantity: z.string().min(1),
})

type EditInventoryFormProps = {
    itemId: Id<"inventory">,
    orgId: string | null;
    isAdmin: boolean;
    isStaff: boolean;
}

export const EditInventoryForm = ({ itemId, orgId, isAdmin, isStaff }: EditInventoryFormProps) => {
    const router = useRouter();
    const { toast } = useToast();

    const addToStagingArea = useMutation(api.stagingArea.addToStagingArea);
    const updateInventory = useMutation(api.inventories.updateItemToInventory);
    const item = useQuery(api.inventories.itemToEdit, { itemId });

    useEffect(() => {
        // Update the form default values when 'item' changes
        if (item) (
            form.reset({
                size: item?.size || '',
                price: item?.price ? String(item.price) : '',
                status: item?.status || '',
                quantity: item?.quantity ? String(item.quantity) : '',
                itemName: item?.itemName || '',
                supplier: item?.supplier || '',
            })
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            size: "",
            price: "",
            status: "",
            quantity: "",
            itemName: "",
            supplier: "",
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!orgId) return;
        try {
            if (isAdmin) {
                const res = await updateInventory({
                    id: itemId,
                    size: values.size,
                    price: parseFloat(values.price),
                    status: values.status,
                    itemName: values.itemName,
                    quantity: parseInt(values.quantity),
                    supplier: values.supplier,
                })

                if (res.success === true) {
                    toast({
                        description: "Item updated successfully.",
                        variant: "success",
                        title: "Success",
                    })
                    router.push("/inventories")
                } else {
                    toast({
                        description: "Failed to update item. Please try again.",
                        variant: "destructive",
                        title: "Error",
                    })
                }

            } else if (isStaff) {
                const res = await addToStagingArea({
                    orgId,
                    inventoryId: itemId,
                    action: "[STAFF] Update Item in Inventory",
                    data: {
                        dataType: "Inventory",
                        inventoryData: {
                            size: values.size,
                            price: parseFloat(values.price),
                            status: values.status,
                            itemName: values.itemName,
                            quantity: parseInt(values.quantity),
                            supplier: values.supplier,
                        }
                    }
                });

                if (res) {
                    toast({
                        title: "Request Sent",
                        description: "Your request has been sent and is pending for approval",
                        variant: "default",
                    })
                    router.push("/inventories")
                } else {
                    toast({
                        description: "Unable to send the request. Please try again.",
                        variant: "destructive",
                        title: "Error",
                    })
                }
            }

        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toast({
                description: "Failed to update item. Please try again.",
                variant: "destructive",
                title: "Error",
            })
        } finally {
            form.reset();
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="mx-auto grid max-w-[60rem] flex-1 auto-rows-max gap-4">
                        <div className="flex items-center gap-4">
                            <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Button>
                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                Update Inventory
                            </h1>
                            <InventoryEditActionButtons form={form} isLoading={isLoading} largeScreen />
                        </div>
                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                <Card>
                                    <CardHeaders title="Product Details" description="Fill in the product details." />
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="itemName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Item Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter name..."  {...field} required />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="supplier"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Supplier Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter supplier"  {...field} required />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeaders title="Stock" description="Fill in the stock details." />
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Quantity</TableHead>
                                                    <TableHead>Price</TableHead>
                                                    <TableHead>Size</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormField
                                                            control={form.control}
                                                            name="quantity"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Quantity</FormLabel>
                                                                    <FormControl>
                                                                        <Input id="quantity" min="0" placeholder="99" type="number" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormField
                                                            control={form.control}
                                                            name="price"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Item Size</FormLabel>
                                                                    <FormControl>
                                                                        <div className="flex items-center gap-x-2">
                                                                            ₱
                                                                            <Input id="price" step="0.01" type="number" {...field} />
                                                                        </div>

                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormField
                                                            control={form.control}
                                                            name="size"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Item Size</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Enter size..."  {...field} required />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                <Card>
                                    <CardHeaders title="Product Status" />
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="status"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select State" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="In Stock">In Stock</SelectItem>
                                                                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                                                                    <SelectItem value="Out Of Stock">Out of Stock</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        </div>
                        <InventoryEditActionButtons form={form} isLoading={isLoading} smallScreen />
                    </div>
                </main>
            </form>
        </Form>
    )
}