
import { RequestsTable } from "./requests-table";
import { CardHeaders } from "@/components/card-headers";
import { Card, CardContent } from "@/components/ui/card";

export const RequestsScreen = () => {
    return (
        <Card>
            <CardHeaders title="Requests" description="Here are all the requests from your staffs." />
            <CardContent>
                <RequestsTable />
            </CardContent>
        </Card>
    )
}