
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ActionTooltipProps = {
    children: React.ReactNode;
    name: string;
}

export const ActionTooltip = ({ children, name }: ActionTooltipProps ) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side="right">{name}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

