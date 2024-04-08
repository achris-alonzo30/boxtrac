"use client";


import { columns } from "./columns";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { DataTable } from "./data-table";
import { api } from "@/convex/_generated/api";



export default function DemoPage() {
  const { orgId } = useAuth();
  const org = orgId ? orgId : "skip";

  const data = useQuery(api.orders.getOrders, { orgId: org })

  if (!data) return [];
  
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}