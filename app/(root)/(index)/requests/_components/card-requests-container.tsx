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
                <CardTitle>Logs</CardTitle>
                <CardDescription>
                    Manage and keep track of your inventory.
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