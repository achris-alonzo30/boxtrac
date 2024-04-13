"use client";

import { z } from "zod";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    CircleCheck,
    ChevronLeft,
    OctagonAlert,
    TriangleAlert,
} from "lucide-react"

import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
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
    SelectLabel,
    SelectGroup,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import { Loader } from "@/components/loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CardHeaders } from "@/components/card-headers";
import { Card, CardContent } from "@/components/ui/card";
import { OrderAddActionButtons } from "./order-add-action-buttons";


const formSchema = z.object({
    size: z.string().min(1),
    price: z.string().min(1),
    status: z.string().min(1),
    itemName: z.string().min(1),
    customer: z.string().min(1),
    quantity: z.string().min(1),
})

type AddInventoryFormProps = {
    orgId: string | null;
    isAdmin: boolean;
    isStaff: boolean;
}

export const AddOrderForm = ({ orgId: id, isAdmin, isStaff }: AddInventoryFormProps) => {
    const [chosenItem, setChosenItem] = useState("");
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const addNewOrder = useMutation(api.orders.addNewOrder);
    const addToStagingArea = useMutation(api.stagingArea.addToStagingArea);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            size: "",
            price: "",
            status: "",
            quantity: "",
            itemName: "",
            customer: "",
        }
    })

    const isSubmitting = form.formState.isSubmitting;
    const orgId = id ? id : "skip";
    const items = useQuery(api.inventories.getInventories, { orgId });
    const isLoading = items === undefined;

    const itemNames = Array.from(new Set(items?.map((item) => ({ itemName: item.itemName, status: item.status }))));

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const itemToUpdate = items?.find((item) => item.itemName === values.itemName && item.size === values.size && item.orgId === orgId);
        if (!orgId || !itemToUpdate) return;
        try {
            if (isAdmin) {
                const res = await addNewOrder({
                    orgId,
                    size: values.size,
                    status: values.status,
                    itemName: values.itemName,
                    customer: values.customer,
                    inventoryId: itemToUpdate?._id,
                    price: parseFloat(values.price),
                    supplier: itemToUpdate?.supplier,
                    quantity: parseInt(values.quantity),
                })

                if (res) {
                    toast({
                        title: "Success",
                        description: "Order added successfully.",
                        variant: "success",
                    })
                    router.push("/orders")
                }
            } else if (isStaff) {
                const res = await addToStagingArea({
                    orgId,
                    inventoryId: itemToUpdate?._id,
                    action: "[STAFF] Create New Order",
                    data: {
                        dataType: "Order",
                        orderData: {
                            size: values.size,
                            status: values.status,
                            itemName: values.itemName,
                            customer: values.customer,
                            price: parseFloat(values.price),
                            supplier: itemToUpdate?.supplier,
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
                    router.push("/orders")
                }
            } else {
                return null;
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

    const handleItemChange = (val: string) => {
        setChosenItem(val);
        const itemStatus = itemNames.find((item) => item.itemName === val)?.status;
        if (itemStatus === "Out Of Stock") {
            setDisabled(true);
        } else {
            setDisabled(false);
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
                                Add New Order
                            </h1>
                            <OrderAddActionButtons form={form} isLoading={isSubmitting} disabled={disabled} largeScreen />
                        </div>
                        {isLoading && <Loader text="Loading Order" />}
                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                <Card>
                                    <CardHeaders title="Order Details" description="Fill in the order details." />
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="itemName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Choose Product</FormLabel>
                                                            <Select onValueChange={(val) => {
                                                                field.onChange(val);
                                                                handleItemChange(val);
                                                            }} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Item Name" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {itemNames?.map((item, index) => (
                                                                        <SelectItem key={index} value={item.itemName}>
                                                                            <div className="flex items-center">
                                                                                <p className={cn(item.status === "Out Of Stock" && "line-through text-muted-foreground")}>{item.itemName}</p>
                                                                                {item.status === "Low Stock" && <TriangleAlert className="h-3.5 w-3.5 text-amber-400 ml-4" />}
                                                                                {item.status === "Out Of Stock" && <OctagonAlert className="h-3.5 w-3.5 text-rose-400 ml-4" />}
                                                                                {item.status === "In Stock" && <CircleCheck className="h-3.5 w-3.5 text-emerald-400 ml-4" />}
                                                                            </div>

                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name="customer"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Customer Name</FormLabel>
                                                            <FormControl>
                                                                <Input disabled={disabled} placeholder="Enter customer"  {...field} required />
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
                                    <CardHeaders title="Order Quantity" description="Write down the number of items they ordered." />
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow >
                                                    <TableHead>Quantity</TableHead>
                                                    <TableHead>Price</TableHead>
                                                    <TableHead>Size</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow >
                                                    <TableCell>
                                                        <FormField
                                                            control={form.control}
                                                            name="quantity"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input disabled={disabled} id="quantity" min="0" placeholder="99" type="number" {...field} />
                                                                    </FormControl>
                                                                    {items?.filter((item) => item.itemName === chosenItem).map((item, index) => (
                                                                        <FormDescription key={index} className="text-muted-foreground text-sm">
                                                                            Cannot Exceed: {item.quantity}
                                                                        </FormDescription>
                                                                    ))}
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
                                                                            <Input disabled={disabled} id="price" step="0.01" type="number" {...field} />
                                                                        </div>

                                                                    </FormControl>
                                                                    {items?.filter((item) => item.itemName === chosenItem).map((item, index) => (
                                                                        <FormDescription key={index} className="text-muted-foreground text-sm">
                                                                            Product Selected Price: ₱{item.price}
                                                                        </FormDescription>
                                                                    ))}
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
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Size" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectLabel>Available Sizes</SelectLabel>
                                                                                {items?.filter(item => item.itemName === chosenItem).map((item, index) => (
                                                                                    <SelectItem  key={index} value={item.size} disabled={item.status === "Out Of Stock"}>{item.size}</SelectItem>
                                                                                ))}
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
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
                                    <CardHeaders title="Order Status" />
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
                                                                        <SelectValue placeholder="Select Status" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                                    <SelectItem value="Refunded">Refunded</SelectItem>
                                                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                        <OrderAddActionButtons form={form} isLoading={isSubmitting} disabled={disabled} smallScreen />
                    </div>
                </main>
            </form>
        </Form>
    )
}