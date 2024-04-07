import {
    Card,
    CardFooter,
    CardContent,
  } from "@/components/ui/card";
import { RequestsTable } from "./requests-table";
import { CardHeaders } from "@/components/card-headers";

export const RequestsScreen = () => {
    return (
        <Card>
            <CardHeaders title="Requests" description="Here are all the requests from your staffs." />
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