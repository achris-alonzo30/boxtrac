"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect} from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

import { Header } from "@/components/header";
import { Loader } from "@/components/loader";
import { Sidebar } from "@/components/sidebar";
import { EditInventoryForm } from "./_components/edit-inventory-form";


export default function EditInventoryPage({ params }: { params: { itemId: Id<"inventory"> } }) {
  const { orgRole, orgId, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/");
    }
  }, [isSignedIn]);

  if (!isLoaded) return <div className="flex min-h-screen items-center justify-center"><Loader text="Loading..." /></div>;

  const itemId = params.itemId
  const id = orgId ? orgId : "skip"
  const isAdmin = orgRole === "org:admin";
  const isStaff = orgRole === "org:member"

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header isAdmin={isAdmin} />
        <EditInventoryForm orgId={id} isAdmin={isAdmin} isStaff={isStaff} itemId={itemId}/>
      </div>
    </div >
  )
}
