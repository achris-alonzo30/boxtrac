"use client";

import { useAuth } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

import { redirect, useRouter } from "next/navigation";

import { Header } from "@/components/header";

import { Sidebar } from "@/components/sidebar";
import { EditInventoryForm } from "./_components/edit-inventory-form";


export default function EditInventoryPage({ params }: { params: { itemId: Id<"inventory"> } }) {
  const { orgRole, orgId, isSignedIn } = useAuth();

  if (!isSignedIn) {
    redirect("/");
    return null;

  }
  
  const itemId = params.itemId
  const isAdmin = orgRole === "org:admin";
  const isStaff = orgRole === "org:member"

  

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <EditInventoryForm orgId={orgId} isAdmin={isAdmin} isStaff={isStaff} itemId={itemId}/>
      </div>
    </div >
  )
}
