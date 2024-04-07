"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";


import {
  Loader2,
  ChevronLeft,
} from "lucide-react";

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
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
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
  SelectLabel,
  SelectGroup,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  size: z.string().min(1),
  price: z.string().min(1),
  status: z.string().min(1),
  itemName: z.string().min(1),
  customer: z.string().min(1),
  quantity: z.string().min(1),
})

export default function EditOrderPage({ params }: { params: { orderId: Id<"order"> } }) {
  const { orgRole, orgId, isSignedIn } = useAuth();

  const router = useRouter();
  const { toast } = useToast();

  const updateOrder = useMutation(api.orders.updateOrder);
  const addToStagingArea = useMutation(api.stagingArea.addToStagingArea);
  const order = useQuery(api.orders.orderToEdit, { orderId: params.orderId });

  useEffect(() => {
    // Update the form default values when 'item' changes
    form.reset({
      size: order?.size || '',
      price: order?.price ? String(order.price) : '',
      status: order?.status || '',
      quantity: order?.quantity ? String(order.quantity) : '',
      itemName: order?.itemName || '',
      customer: order?.customer || '',
    });
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
  const role = orgRole ?? "skip";
  const isSubmitting = form.formState.isSubmitting;
  const items = useQuery(api.inventories.getInventories, orgId ? { orgId } : "skip");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const itemToUpdate = items?.find((item) => item.itemName === values.itemName && item.size === values.size && item.orgId === orgId);
    if (!orgId || !order || !items || !itemToUpdate) return;
    
    try {
      if (role === "org:admin") {
        const res = await updateOrder({
          id: params.orderId,
          size: values.size,
          price: parseFloat(values.price),
          status: values.status,
          itemName: values.itemName,
          quantity: parseInt(values.quantity),
          customer: values.customer,
          inventoryId: itemToUpdate._id
        })

        if (res.success === true) {
          toast({
            description: "Order updated successfully.",
            variant: "success",
            title: "Success",
          })
          router.push("/orders")
        } else {
          toast({
            description: "Failed to update order. Please try again.",
            variant: "destructive",
            title: "Error",
          })
        }

      } else if (role === "org:member") {
        const res = await addToStagingArea({
          orgId,
          orderId: params.orderId,
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
          router.push("/orders")
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

  if (!isSignedIn) redirect("/")

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
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
                  <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button
                      type="button" 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        form.reset();
                        router.back();
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" disabled={isSubmitting} type="submit">
                      {isSubmitting ? (
                        <span className="flex items-center gap-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        <p>Update Order</p>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                        <CardDescription>
                          Fill in the order details.
                        </CardDescription>
                      </CardHeader>
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
                      <CardHeader>
                        <CardTitle>Order Quantity</CardTitle>
                        <CardDescription>
                          Write down the number of items they ordered.
                        </CardDescription>
                      </CardHeader>
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
                      <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                      </CardHeader>
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
                    {/* <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>
                          Lipsum dolor sit amet, consectetur adipiscing elit
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          <Image
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="300"
                            src="/placeholder.svg"
                            width="300"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <button>
                              <Image
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="84"
                                src="/placeholder.svg"
                                width="84"
                              />
                            </button>
                            <button>
                              <Image
                                alt="Product image"
                                className="aspect-square w-full rounded-md object-cover"
                                height="84"
                                src="/placeholder.svg"
                                width="84"
                              />
                            </button>
                            <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="sr-only">Upload</span>
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card> */}
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2 md:hidden">
                  <Button
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.reset();
                      router.back();
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <p>Update Order</p>
                    )}
                  </Button>
                </div>
              </div>
            </main>
          </form>
        </Form>
      </div>
    </div >
  )
}
