"use client";


import Image from "next/image";
import { useQuery } from "convex/react";
import { formatRelative } from "date-fns";
import { api } from "@/convex/_generated/api";
import { transformStockText } from "@/lib/utils";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { RequestsActions } from "./requests-actions";
import { RequestsTableHeads } from "./requests-table-heads";


export const RequestsTable = ({ orgId }: { orgId: string }) => {
  const items = useQuery(api.stagingArea.getItemsInStagingArea, { orgId });

  const isLoading = items === undefined;

  return (
    <>
      {items && items.length > 0 ? (
        <Table>
          <TableHeader>
            <RequestsTableHeads />
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              return (
                <TableRow key={item._id}>
                  <TableCell className="hidden md:table-cell capitalize">{formatRelative(new Date(item._creationTime), new Date())}</TableCell>
                  <TableCell className="font-medium">{item.data.dataType}</TableCell>
                  <TableCell><Badge variant="default">{transformStockText(item.action)}</Badge></TableCell>
                  <TableCell>
                    <RequestsActions 
                      orgId={orgId} 
                      action={item.action} 
                      orderId={item.orderId} 
                      stagingAreaId={item._id} 
                      inventoryId={item.inventoryId} 
                      orderData={item.data.orderData}
                      inventoryData={item.data.inventoryData} 
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <section className="w-full flex flex-col items-center justify-center space-y-4 my-12">
          {isLoading ? (
            <Loader text="Loading Requests" />
          ) : (
            <>
              <Image src="/no-data.svg" alt="No Data" width={100} height={100} />
              <p className="text-xl  font-medium">You have no requests.</p>
            </>
          )}
        </section>
      )}

    </>
  )
}