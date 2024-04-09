"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { formatNumber } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
    Card,
    CardTitle,
    CardFooter,
    CardHeader,
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export const PerformanceCard = () => {
    const { orgId: id } = useAuth();
    const orgId = id ? id : "skip";
    const profit = useQuery(api.orders.getTotalOrders, { orgId });

    const isLoading = profit === undefined;

    const isProfitObject = (obj: any): obj is { 
        curWeeklyProfit: number; 
        curMonthlyProfit: number; 
        curYearlyProfit: number; 
        weeklyPercentChange: number;
        monthlyPercentChange: number;
        yearlyPercentChange: number
    } => {
        return obj && 
        typeof obj === 'object' && 
        'curWeeklyProfit' in obj && 
        'curMonthlyProfit' in obj && 
        'curYearlyProfit' in obj && 
        'weeklyPercentChange' in obj &&
        'monthlyPercentChange' in obj &&
        'yearlyPercentChange' in obj
    };

    if (!profit || !isProfitObject(profit)) return null;

    const { 
        curWeeklyProfit, 
        curMonthlyProfit, 
        curYearlyProfit, 
        weeklyPercentChange, 
        monthlyPercentChange, 
        yearlyPercentChange } = profit;


    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-23 xl:grid-cols-3" >
            {
                isLoading ? (
                    <>
                        <Skeleton className="bg-muted h-40 w-100" />
                        <Skeleton className="bg-muted h-40 w-100" />
                        <Skeleton className="bg-muted h-40 w-100" />
                    </>
                ) : (
                    <>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>This Week</CardDescription>
                                <CardTitle className="text-4xl">{formatNumber(curWeeklyProfit)}</CardTitle>
                            </CardHeader >
                            <CardContent>
                                <div className="text-xs text-muted-foreground">
                                    {weeklyPercentChange < 0 && <span className="text-red-500">-{weeklyPercentChange}% from last week</span>}
                                    {weeklyPercentChange > 0 && <span className="text-emerald-500">+{weeklyPercentChange}% from last week</span>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                {weeklyPercentChange > 0 && <Progress value={weeklyPercentChange} aria-label={`${weeklyPercentChange}% increase`} />}
                            </CardFooter>
                        </Card >
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>This Month</CardDescription>
                                <CardTitle className="text-4xl">{formatNumber(curMonthlyProfit)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground">
                                    {monthlyPercentChange < 0 && <span className="text-red-500">-{monthlyPercentChange}% from last month</span>}
                                    {monthlyPercentChange > 0 && <span className="text-emerald-500">+{monthlyPercentChange}% from last month</span>}
                                </div>
                            </CardContent>
                            <CardFooter>
                            {monthlyPercentChange > 0 && <Progress value={monthlyPercentChange} aria-label={`${monthlyPercentChange}% increase`} />}
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>This Year</CardDescription>
                                <CardTitle className="text-4xl">{formatNumber(curYearlyProfit)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground">
                                    {yearlyPercentChange < 0 && <span className="text-red-500">-{yearlyPercentChange}% from last year</span>}
                                    {yearlyPercentChange > 0 && <span className="text-emerald-500">+{yearlyPercentChange}% from last year</span>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                {yearlyPercentChange > 0 && <Progress value={yearlyPercentChange} aria-label={`${yearlyPercentChange}% increase`} />}
                            </CardFooter>
                        </Card>
                    </>
                )}

        </div >
    )
}
