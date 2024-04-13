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
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
} from "@/components/ui/table";
import {
    Select,
    SelectItem,
    SelectValue,
    SelectGroup,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CardHeaders } from "@/components/card-headers";
import { Card, CardContent } from "@/components/ui/card";
import { OrderEditActionButtons } from "./order-edit-action-button";

const formSchema = z.object({
    size: z.string().min(1),
    price: z.string().min(1),
    status: z.string().min(1),
    itemName: z.string().min(1),
    customer: z.string().min(1),
    quantity: z.string().min(1),
})

type OrderEditFormProps = {
    orderId: Id<"order">,
    orgId: string | null,
    isAdmin: boolean,
    isStaff: boolean,
}

export const OrderEditForm = ({ orderId, orgId: id, isAdmin, isStaff }: OrderEditFormProps) => {
    const router = useRouter();
    const { toast } = useToast();

    const updateOrder = useMutation(api.orders.updateOrder);
    const addToStagingArea = useMutation(api.stagingArea.addToStagingArea);
    const order = useQuery(api.orders.orderToEdit, { orderId });

    useEffect(() => {
        // Update the form default values when 'item' changes
        if (order) {
            form.reset({
                size: order?.size || '',
                price: order?.price ? String(order.price) : '',
                status: order?.status || '',
                quantity: order?.quantity ? String(order.quantity) : '',
                itemName: order?.itemName || '',
                customer: order?.customer || '',
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

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

    const isLoading = form.formState.isSubmitting;
    const orgId = id ? id : "skip";
    const items = useQuery(api.inventories.getInventories, { orgId });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const itemToUpdate = items?.find((item) => item.itemName === values.itemName && item.size === values.size && item.orgId === orgId);
        if (!orgId || !order || !items || !itemToUpdate) return;
        try {
            if (isAdmin) {
                const res = await updateOrder({
                    id: orderId,
                    size: values.size,
                    price: parseFloat(values.price),
                    status: values.status,
                    itemName: values.itemName,
                    quantity: parseInt(values.quantity),
                    customer: values.customer,
                    supplier: order.supplier,
                    inventoryId: itemToUpdate._id
                })

                if (res.success === true) {
                    toast({
                        description: "Order updated successfully.",
                        variant: "success",
                        title: "Success",
                    })
                    router.push("/orders");
                } else {
                    toast({
                        description: "Failed to update order. Please try again.",
                        variant: "destructive",
                        title: "Error",
                    })
                }

            } else if (isStaff) {
                const res = await addToStagingArea({
                    orgId,
                    orderId: orderId,
                    inventoryId: itemToUpdate._id,
                    action: "[STAFF] Update Order",
                    data: {
                        dataType: "Order",
                        orderData: {
                            size: values.size,
                            price: parseFloat(values.price),
                            status: values.status,
                            itemName: values.itemName,
                            quantity: parseInt(values.quantity),
                            customer: values.customer,
                            supplier: order.supplier
                        }
                    }
                });

                if (res) {
                    toast({
                        title: "Request Sent",
                        description: "Your request has been sent and is pending for approval",
                        variant: "default",
                    })
                    router.push("/orders");
                } else {
                    toast({
                        description: "Unable to send request. Please try again.",
                        variant: "destructive",
                        title: "Error",
                    })
                }
            }

        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            toast({
                description: "Failed to update order. Please try again.",
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
                                Update Order
                            </h1>
                            <OrderEditActionButtons isLoading={isLoading} form={form} largeScreen />
                        </div>
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
                                                            <FormLabel>Order Name</FormLabel>
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
                                                    name="customer"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Customer Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Enter customer..."  {...field} required />
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
                                    <CardHeaders title="Order Details" description="Fill in the order details." />
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
                                                                        <SelectValue placeholder={order?.status} />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        {order?.status !== "Fulfilled" && <SelectItem value="Fulfilled">Fulfilled</SelectItem>}
                                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                                        <SelectItem value="Refunded">Refunded</SelectItem>
                                                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                                                    </SelectGroup>
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
                        <OrderEditActionButtons form={form} isLoading={isLoading} smallScreen />
                    </div>
                </main>
            </form>
        </Form>
    )
}