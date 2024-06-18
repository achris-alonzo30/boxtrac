import { Logo } from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

export default async function Home() {
    const user = await currentUser();

    if (user) {
        redirect("/dashboard");
    }
    return (
        <main className="h-full w-full my-auto flex flex-col items-center justify-center space-y-4">
        <Card className="w-[400px] flex flex-col items-center shadow-md shadow-neutral-600">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Logo />
                    BOXTRAC
                </CardTitle>
                <CardDescription>
                    Please select to continue
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 items-center">
                <Link href="/sign-in" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                    SIGN IN
                </Link>
                <Link href="/sign-up" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                    SIGN UP
                </Link>
            </CardContent>
        </Card>
        </main>
    )
}