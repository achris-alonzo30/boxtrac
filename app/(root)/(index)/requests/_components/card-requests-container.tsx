import {
    Card,
    CardTitle,
    CardFooter,
    CardHeader,
    CardContent,
    CardDescription,
  } from "@/components/ui/card";
import { RequestsTable } from "./log-table";

export const RequestsScreen = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Requests</CardTitle>
                <CardDescription>
                    Here are all the requests from your staffs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RequestsTable />
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                </div>
            </CardFooter>
        </Card>
    )
}