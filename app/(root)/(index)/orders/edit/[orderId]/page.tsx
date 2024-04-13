"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { OrderEditForm } from "./_components/order-edit-form";


export default function EditOrderPage({ params }: { params: { orderId: Id<"order"> } }) {
  const { orgRole, orgId, isSignedIn } = useAuth();

  if (!isSignedIn) redirect("/")

  const orderId = params.orderId;
  const isAdmin = orgRole === "org:admin";
  const isStaff = orgRole === "org:member";

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header isAdmin={isAdmin} />
        <OrderEditForm orgId={orgId} isAdmin={isAdmin} isStaff={isStaff} orderId={orderId} />
      </div>
    </div >
  )
}
