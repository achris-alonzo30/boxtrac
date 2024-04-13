
import { orderData } from "../types";
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DialogContent } from "@/components/ui/dialog";



type ActionDialogProps = {
    action: string;
    orderData: orderData;
}

export const ViewOrderDialog = ({ action, orderData }: ActionDialogProps) => {
    const price = orderData?.price ?? 0;
    const quantity = orderData?.quantity ?? 0;
    const status = orderData?.status ?? null;
    const total = price * quantity;

    const variant = status === "Fulfilled" ? "default" : status === "Pending" ? "secondary" : status === "Refunded" ? "neutral" : status === "Cancelled" ? "destructive" : "default";
    const heading = action === "create" ? "Request to Create New Order" : action === "update" ? "Request to Update Order" : "Request to Delete Order";
    return (
        <DialogContent className="sm:max-w-3xl">
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                            {heading}
                        </CardTitle>
                        <CardDescription>
                            Status:{" "}
                            <Badge variant={variant} >
                                 {orderData?.status}
                            </Badge>

                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <div className="font-semibold">Order Details</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    {orderData?.itemName} x <span>{orderData?.size}</span> x <span>{quantity}</span>
                                </span>
                                <span>₱{(price).toFixed(2)}</span>
                            </li>
                        </ul>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Total</span>
                                <span>₱{total.toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                        <div className="font-semibold">Other Information</div>
                        <dl className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Customer</dt>
                                <dd>{orderData?.customer}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Supplier</dt>
                                <dd>
                                    <a href="mailto:">{orderData?.supplier}</a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </CardContent>
            </Card>
        </DialogContent>
    )
}