"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { loginSchema } from "./types";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast";



export const SignInScreen = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  })

  // start the sign up process.
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const { emailAddress, password } = values;
      const res = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })
        // create user in the backend
        router.push("/dashboard");
      } else {
        console.log(res)
      }


    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={loginForm.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="elon.musk@tesla.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="********" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}