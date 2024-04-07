"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { formatRelative } from "date-fns";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";

import {
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
} from "@/components/ui/table";
import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { OrdersActions } from "./orders-actions";
import { AddButton } from "@/components/add-buttons";
import { OrdersTableHeads } from "./orders-table-heads";


type OrdersTableProps = {
    isAdmin: boolean;
    isStaff: boolean;
    orgId: string | null
}


export const OrdersTable = ({ orgId, isAdmin, isStaff }: OrdersTableProps) => {
    const router = useRouter();
    const orders = useQuery(api.orders.getOrders, orgId ? { orgId } : "skip");

    const isLoading = orders === undefined;

    return (
        <>
            {orders && orders.length > 0 ? (
                <Table>
                    <TableHeader>
                        <OrdersTableHeads isAdmin={isAdmin} />
                    </TableHeader>
                    <TableBody>
                        {orders?.map((item, index) => {
                            const variant =
                                item.status === 'Fulfilled'
                                    ? 'default'
                                    : item.status === 'Pending'
                                        ? 'secondary'
                                        : item.status === 'Refunded'
                                            ? 'neutral'
                                            : item.status === 'Cancelled'
                                                ? 'destructive'
                                                : 'default';
                            const profit = item.price * item.quantity;
                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium capitalize">{formatRelative(new Date(item._creationTime), new Date())}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{item.customer}</TableCell>
                                    <TableCell className="font-medium">{item.itemName}</TableCell>
                                    <TableCell className="font-medium">{item.size}</TableCell>
                                    <TableCell><Badge variant={variant}>{item.status}</Badge></TableCell>
                                    <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                                    <TableCell className="hidden md:table-cell">₱{item.price}</TableCell>
                                    {isAdmin && (
                                        <TableCell className="hidden md:table-cell">₱{profit.toFixed(2)}</TableCell>
                                    )}
                                    <TableCell>
                                        <OrdersActions itemId={item._id} orgId={orgId} isAdmin={isAdmin} isStaff={isStaff} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            ) : (
                <section className="w-full flex flex-col items-center justify-center space-y-4 my-12">
                    {isLoading && <Loader text="Loading Orders" />}
                    <Image src="/no-data.svg" alt="No Data" width={100} height={100} />
                    <p className="text-xl  font-medium">No Order</p>
                    <AddButton route="/orders/add" btnName="New Order" />
                </section>
            )}
        </>
    )
}