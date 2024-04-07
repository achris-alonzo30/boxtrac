
import Link from "next/link";
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type AddButtonProps = {
    route: string;
    btnName: string
}
export const AddButton = ({ btnName, route }: AddButtonProps) => {
    return (
        <Button size="sm" className="h-8 gap-1" asChild>
            <Link href={route} className="flex items-center gap-x-2">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {btnName}
                </span>
            </Link>
        </Button>
    )
}