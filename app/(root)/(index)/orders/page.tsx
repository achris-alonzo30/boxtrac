"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Loader } from "@/components/loader";

import { AdminBrowser } from "./_components/admin/admin-browser";

const OrdersPage = () => {
    const { isSignedIn, isLoaded, orgRole} = useAuth();

    if (!isLoaded) return <div className="flex h-screen items-center justify-center"><Loader text="Loading..." /></div>;

    if (!isSignedIn) {
        redirect("/dashboard");
    }

    return (
        <>
            <AdminBrowser />
        </>
    )
}

export default OrdersPage;