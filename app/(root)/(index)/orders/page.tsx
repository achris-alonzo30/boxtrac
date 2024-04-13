"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Loader } from "@/components/loader";
import { Browser } from "./_components/browser/browser";

const OrdersPage = () => {
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
    <>
      <Browser isAdmin={isAdmin} orgId={id} />
    </>
  )
}

export default OrdersPage;