"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ClerkProvider, useAuth } from "@clerk/nextjs"
import { ConvexProviderWithClerk } from "convex/react-clerk"

const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const ConvexClientProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ConvexProvider client={client}>
            {children}
        </ConvexProvider>
    )
}