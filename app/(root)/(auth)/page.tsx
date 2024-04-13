"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
    Tabs,
    TabsList,
    TabsContent,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Loader } from "@/components/loader";
import { SignUpScreen } from "./_components/sign-up";
import { SignInScreen } from "./_components/sign-in";

const AuthPage = () => {
    const { orgRole, isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn) {
            if (orgRole === "org:admin") {
                redirect("/dashboard");
            } else if (orgRole === "org:member") {
                redirect("/inventories");
            }
        }
    }, [isSignedIn, orgRole]);
    
    return (
        <div className="max-w-lg flex flex-col h-full items-center justify-center mx-auto my-8">
            <Tabs defaultValue="sign-in" className="max-w-lg">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                    <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="sign-in">
                    <SignInScreen />
                </TabsContent>
                <TabsContent value="sign-up">
                    <SignUpScreen />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AuthPage;