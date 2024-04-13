
import { inventoryData } from "../types";
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
    inventoryData: inventoryData;
}

export const ViewInventoryDialog = ({ action, inventoryData }: ActionDialogProps) => {
    const price = inventoryData?.price ?? 0;
    const quantity = inventoryData?.quantity ?? 0;
    const status = inventoryData?.status ?? null;
    const total = price * quantity;

    const variant = status === "In Stock" ? "default" : status === "Low Stock" ? "secondary" : status === "Out Of Stock" ? "destructive" : "default";
    const heading = action === "create" ? "Request to Add New Item" : action === "update" ? "Request to Update Item" : "Request to Delete Item";
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
                                 {inventoryData?.status}
                            </Badge>

                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                        <div className="font-semibold">Inventory Details</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    {inventoryData?.itemName} x <span>{inventoryData?.size}</span> x <span>{quantity}</span>
                                </span>
                                <span>₱{(price).toFixed(2)}</span>
                            </li>
                        </ul>
                        <Separator className="my-2" />
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Price Bought</span>
                                <span>₱{total.toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                        <div className="font-semibold">Other Information</div>
                        <dl className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <dt className="text-muted-foreground">Supplier</dt>
                                <dd>
                                    <a href="mailto:">{inventoryData?.supplier}</a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </CardContent>
            </Card>
        </DialogContent>
    )
}