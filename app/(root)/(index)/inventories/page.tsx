"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Loader } from "@/components/loader";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { CardHeaders } from "@/components/card-headers";
import { InventoryTable } from "./_components/table/inventory-table";

const InventoryPage = () => {
  const { isSignedIn, isLoaded, orgRole, orgId } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/");
    }
  }, [isSignedIn]);
  
  if (!isLoaded) return <div className="flex min-h-screen items-center justify-center"><Loader text="Loading..." /></div>;

  const id = orgId ? orgId : "skip"
  const isAdmin = orgRole === "org:admin";

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/30">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header isAdmin={isAdmin} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
              <CardHeaders title="Inventory" description="Manage and keep track of your inventory."/>
              <CardContent>
                <InventoryTable orgId={id} />
              </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default InventoryPage;