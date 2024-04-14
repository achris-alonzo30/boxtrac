export type inventoryData = {
    size: string;
    price: number;
    status: string;
    itemName: string;
    quantity: number;
    supplier: string;
} | undefined

export type orderData = {
    size: string;
    price: number;
    status: string;
    itemName: string;
    customer: string;
    quantity: number;
    supplier: string;
} | undefined
