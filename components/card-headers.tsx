import {
    CardTitle,
    CardHeader,
    CardDescription,
} from "@/components/ui/card";

export const CardHeaders = ({ title, description }: { title: string; description?: string }) => {
    return (
        <CardHeader >
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>

    );
}