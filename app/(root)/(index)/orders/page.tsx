"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Loader } from "@/components/loader";

import { Browser } from "./_components/browser/browser";

const OrdersPage = () => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return <div className="flex h-screen items-center justify-center"><Loader text="Loading..." /></div>;

    if (!isSignedIn) {
        redirect("/dashboard");
    }

    return (
        <>
            <Browser />
        </>
    )
}

export default OrdersPage;