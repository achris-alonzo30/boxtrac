"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Loader } from "@/components/loader";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { RequestsScreen } from "./_components/requests-screen";

const RequestsPage = () => {
  const { isSignedIn, isLoaded, orgRole, orgId } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/");
    } else if (isSignedIn) {
      if (orgRole !== "org:admin") {
        redirect("/inventories");
      }
    }
  }, [isSignedIn, orgRole]);

  if (!isLoaded) return <div className="flex min-h-screen items-center justify-center"><Loader text="Loading..." /></div>;

  const id = orgId ? orgId : "skip"
  const isAdmin = orgRole === "org:admin";

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header isAdmin={isAdmin} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <RequestsScreen orgId={id} />
        </main>
      </div>
    </div>
  )
}

export default RequestsPage;