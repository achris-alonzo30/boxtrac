
import {
    Tabs,
    TabsList,
    TabsContent,
    TabsTrigger,
} from "@/components/ui/tabs";
import { SignUpScreen } from "./_components/sign-up";
import { SignInScreen } from "./_components/sign-in";


const AuthPage = () => {
    return (
        <div className="max-w-lg flex flex-col h-screen items-center justify-center mx-auto">
            <Tabs defaultValue="sign-in" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sign-in">Sign Up</TabsTrigger>
                    <TabsTrigger value="sign-up">Sign In</TabsTrigger>
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