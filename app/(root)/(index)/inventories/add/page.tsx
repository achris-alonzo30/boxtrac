"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { AddInventoryForm } from "./_components/add-inventory-form";

const AddInventoryPage = () => {
  const { orgRole, orgId, isSignedIn } = useAuth();

  if (!isSignedIn) {
    redirect("/");
  }

  const isAdmin = orgRole === "org:admin";
  const isStaff = orgRole === "org:member"

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <AddInventoryForm orgId={orgId} isAdmin={isAdmin} isStaff={isStaff}/>
      </div>
    </div >
  )
}

export default AddInventoryPage;