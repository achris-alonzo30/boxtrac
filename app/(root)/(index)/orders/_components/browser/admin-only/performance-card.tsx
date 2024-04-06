import {
    Card,
    CardTitle,
    CardFooter,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export const PerformanceCard = () => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-23 xl:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>This Week</CardDescription>
                    <CardTitle className="text-4xl">$1329</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        +25% from last week
                    </div>
                </CardContent>
                <CardFooter>
                    <Progress value={25} aria-label="25% increase" />
                </CardFooter>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>This Month</CardDescription>
                    <CardTitle className="text-3xl">$5,329</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        +10% from last month
                    </div>
                </CardContent>
                <CardFooter>
                    <Progress value={12} aria-label="12% increase" />
                </CardFooter>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>This Year</CardDescription>
                    <CardTitle className="text-4xl">$10,000</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground">
                        +69% from last year
                    </div>
                </CardContent>
                <CardFooter>
                    <Progress value={90} aria-label="90% increase" />
                </CardFooter>
            </Card>
        </div>
    )
}