export type inventoryData = {
    requestForEdit?: boolean | undefined;
    requestForDeletion?: boolean | undefined;
    size: string;
    price: number;
    status: string;
    itemName: string;
    quantity: number;
    supplier: string;
} | undefined