"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChevronLeft } from "lucide-react"

import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
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
import { InventoryAddActionButtons } from "./inventory-add-action-buttons";

const formSchema = z.object({
    size: z.string().min(1),
    price: z.string().min(1),
    status: z.string().min(1),
    itemName: z.string().min(1),
    supplier: z.string().min(1),
    quantity: z.string().min(1),
})

type AddInventoryFormProps = {
    orgId: string | null;
    isAdmin: boolean;
    isStaff: boolean;
}

export const AddInventoryForm = ({ orgId, isAdmin, isStaff }: AddInventoryFormProps) => {
    const router = useRouter();
    const { toast } = useToast();

    const addInventory = useMutation(api.inventories.addItemToInventory);
    const addToStagingArea = useMutation(api.stagingArea.addToStagingArea);

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
                const res = await addInventory({
                    orgId,
                    size: values.size,
                    status: values.status,
                    itemName: values.itemName,
                    supplier: values.supplier,
                    price: parseFloat(values.price),
                    quantity: parseInt(values.quantity),
                })

                if (res) {
                    toast({
                        title: "Success",
                        description: "Item added to inventory",
                        variant: "success",
                    })
                    router.push("/inventories")
                }
            } else if (isStaff) {

                const res = await addToStagingArea({
                    orgId,
                    action: "[STAFF] Add New Item in Inventory",
                    data: {
                        dataType: "Inventory",
                        inventoryData: {
                            size: values.size,
                            status: values.status,
                            itemName: values.itemName,
                            supplier: values.supplier,
                            price: parseFloat(values.price),
                            quantity: parseInt(values.quantity),
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
                }
            } 

        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toast({
                description: "Failed to add item. Please try again.",
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
                                Add New Item to Inventory
                            </h1>
                            <InventoryAddActionButtons form={form} isLoading={isLoading} largeScreen />
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
                                    <CardHeaders title="Stock" description="Keep track of your inventory." />
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
                        <InventoryAddActionButtons form={form} isLoading={isLoading} smallScreen />
                    </div>
                </main>
            </form>
        </Form>
    )
}