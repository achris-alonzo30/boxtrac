"use client";


import { columns } from "./columns";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { DataTable } from "./data-table";
import { api } from "@/convex/_generated/api";



export default function DemoPage() {
  const { orgId } = useAuth();
  const org = orgId ? orgId : "skip";
  // const data = useQuery(api.inventories.getInventories, { orgId: org })
  const data = useQuery(api.orders.getOrders, { orgId: org })
  const profit = useQuery(api.orders.getTotalOrders, { orgId: org })

  if (!data || !profit) return [];
  const { weeklyProfit, monthlyProfit, yearlyProfit } = profit as { weeklyProfit: number; monthlyProfit: number; yearlyProfit: number; };
  
  console.log("Weekly Profit: ", weeklyProfit)
  console.log("Monthly Profit: ", monthlyProfit)
  console.log("Yearly Profit: ", yearlyProfit)

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}