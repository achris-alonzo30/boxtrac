import Image from "next/image"

import {
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { InventoryActions } from "./inventory-actions"
import { InventoryTableHeads } from "./inventory-table-heads"

const data = [
    {
        image: "/placeholder.svg",
        name: "Laser Lemonade Machine",
        size: "Large",
        status: "In Stock",
        price: "$499.99",
        quantity: 25,
        supplier: "Tech Industries",
        purchasedDate: "2023-07-12 10:42 AM",
    },
    {
        image: "/placeholder.svg",
        name: "AeroGlow Desk Lamp",
        size: "Medium",
        status: "Low Stock",
        price: "$39.99",
        quantity: 10,
        supplier: "Lighting Emporium",
        purchasedDate: "2023-07-12 10:42 AM",
    },
    {
        image: "/placeholder.svg",
        name: "Hypernova Headphones",
        size: "One Size",
        status: "Low Stock",
        price: "$129.99",
        quantity: 5,
        supplier: "AudioTech",
        purchasedDate: "2023-07-12 10:42 AM",
    },
    {
        image: "/placeholder.svg",
        name: "TechToni Energy Drink",
        size: "12 oz",
        status: "Out of Stock",
        price: "$2.99",
        quantity: 0,
        supplier: "Beverage Co.",
        purchasedDate: "2023-07-12 10:42 AM",
    },
    {
        image: "/placeholder.svg",
        name: "Gamer Gear Pro Controller",
        size: "Universal",
        status: "In Stock",
        price: "$59.99",
        quantity: 75,
        supplier: "Gaming World",
        purchasedDate: "2023-07-12 10:42 AM",
    },
];


export const InventoryTable = () => {
    return (
        <Table>
            <TableHeader>
                <InventoryTableHeads />
            </TableHeader>
            <TableBody>
                {data.map((item, index) => {
                    const variant =
                        item.status === 'In Stock'
                            ? 'default'
                            : item.status === 'Low Stock'
                                ? 'secondary'
                                : item.status === 'Out of Stock'
                                    ? 'destructive'
                                    : 'default';
                    return (
                        <TableRow key={index}>
                            <TableCell className="hidden sm:table-cell">
                                <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={item.image}
                                    width="64"
                                />
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="font-medium">{item.size}</TableCell>
                            <TableCell><Badge variant={variant}>{item.status}</Badge></TableCell>
                            <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                            <TableCell className="hidden md:table-cell">{item.price}</TableCell>
                            <TableCell className="font-medium">{item.supplier}</TableCell>
                            <TableCell className="hidden md:table-cell">{item.purchasedDate}</TableCell>
                            <TableCell>
                                <InventoryActions />
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}