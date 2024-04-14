"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Loader } from "@/components/loader";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { AddInventoryForm } from "./_components/add-inventory-form";

const AddInventoryPage = () => {
  const { orgRole, orgId, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
      if (!isSignedIn) {
        redirect("/");
      }
  }, [isSignedIn]);

  if (!isLoaded) return <div className="flex min-h-screen items-center justify-center"><Loader text="Loading..." /></div>;


  const id = orgId ? orgId : "skip"
  const isAdmin = orgRole === "org:admin";
  const isStaff = orgRole === "org:member"

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/30">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header isAdmin={isAdmin}  />
        <AddInventoryForm orgId={id} isAdmin={isAdmin} isStaff={isStaff}/>
      </div>
    </div >
  )
}

export default AddInventoryPage;