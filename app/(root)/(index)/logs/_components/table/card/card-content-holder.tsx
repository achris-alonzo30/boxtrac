import { CardContent } from "@/components/ui/card";
import { inventoryData, orderData } from "./types";

type CardContentHolder = {
    orderData?: orderData;
    inventoryData?: inventoryData;
    source?: "Inventory" | "Order";
}

export const CardContentHolder = ({ orderData, inventoryData, source }: CardContentHolder) => {
    return (
        <CardContent className="p-6 text-sm">
            {orderData && source && (
                <>
                    <div className="grid gap-4 text-sm">
                    <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Source</div>
                            <div>{source}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Name</div>
                            <div>{orderData.itemName}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Status</div>
                            <div>{orderData.status}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Size</div>
                            <div>{orderData.size}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Quantity</div>
                            <div>{orderData.quantity}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Price</div>
                            <div>₱{(orderData?.price).toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Supplier</div>
                            <div>{orderData.supplier}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Customer</div>
                            <div>{orderData.customer}</div>
                        </div>
                    </div>
                </>
            )}
            {inventoryData && source && (
                <>
                    <div className="grid gap-4 text-sm">
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Source</div>
                            <div>{source}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Name</div>
                            <div>{inventoryData.itemName}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Status</div>
                            <div>{inventoryData.status}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Size</div>
                            <div>{inventoryData.size}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Quantity</div>
                            <div>{inventoryData.quantity}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Price</div>
                            <div>₱{(inventoryData?.price).toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div className="font-medium">Supplier</div>
                            <div>{inventoryData.supplier}</div>
                        </div>
                    </div>
                </>
            )}
        </CardContent>
    )
}