"use client"

import { z } from 'zod';
import { useState } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPasswordSchema, resetPasswordSchema } from './types';


import { Button } from '@/components/ui/button';
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import {
    InputOTP,
    InputOTPSlot,
    InputOTPGroup,
} from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';




const ForgotPasswordPage: NextPage = () => {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { isLoaded, signIn, setActive } = useSignIn();
    const [secondFactor, setSecondFactor] = useState(false);
    const [successfulCreation, setSuccessfulCreation] = useState(false);

    const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    const createForm = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            code: "",
            password: "",
        }
    })

    if (!isLoaded) return null;

    // If the user is already signed in, redirect them to the home page
    if (isSignedIn) router.push('/');


    // Send the password reset code to the user's email
    async function reset(values: z.infer<typeof resetPasswordSchema>) {
        const { email } = values;
        setIsLoading(true);
        await signIn
            ?.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            .then(_ => {
                setSuccessfulCreation(true);
                setError('');
            })
            .catch(err => {
                console.error('error', err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    // Reset the user's password. 
    // Upon successful reset, the user will be 
    // signed in and redirected to the home page
    async function create(values: z.infer<typeof newPasswordSchema>) {
        const { code, password } = values;
        setIsLoading(true);
        await signIn
            ?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })
            .then(result => {
                // Check if 2FA is required
                if (result.status === 'needs_second_factor') {
                    setSecondFactor(true);
                    setError('');
                } else if (result.status === 'complete') {
                    // Set the active session to 
                    // the newly created session (user is now signed in)
                    setActive({ session: result.createdSessionId });
                    setError('');
                } else {
                    console.log(result);
                }
            })
            .catch(err => {
                console.error('error', err.errors[0].longMessage)
                setError(err.errors[0].longMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <>
            {!successfulCreation ? (
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email address to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Form {...resetForm}>
                            <form onSubmit={resetForm.handleSubmit(reset)} className="space-y-4">
                                <div className="grid gap-4">
                                    <FormField
                                        control={resetForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="elon.musk@tesla.com" type="email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Loading..." : "Send Code"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">New Password</CardTitle>
                        <CardDescription>
                            Enter the 6 digit code that was sent to your email and new password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Form {...createForm}>
                            <form onSubmit={createForm.handleSubmit(create)} className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <FormField
                                            control={createForm.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Code</FormLabel>
                                                    <FormControl>
                                                        <InputOTP maxLength={6} {...field}>
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={0} />
                                                                <InputOTPSlot index={1} />
                                                                <InputOTPSlot index={2} />
                                                                <InputOTPSlot index={3} />
                                                                <InputOTPSlot index={4} />
                                                                <InputOTPSlot index={5} />
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <FormField
                                            control={createForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="********" type="password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Loading..." : "Reset"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

        </>
    );
};

export default ForgotPasswordPage;
