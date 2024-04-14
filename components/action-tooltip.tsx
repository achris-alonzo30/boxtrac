
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ActionTooltipProps = {
    children: React.ReactNode;
    name: string;
    side?: "right" | "top" | "bottom" | "left" | undefined;
}

export const ActionTooltip = ({ children, name, side }: ActionTooltipProps ) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side ? side :"right"}>{name}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

